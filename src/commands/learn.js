const { SlashCommandBuilder } = require('discord.js');
const Item = require('../models/Item');
const Frequency = require('../models/Frequency');
const UserConfig = require('../models/UserConfig');
const Config = require('../models/Config');
const { updateDashboard } = require('../utils/dashboardHelper');
const { getMidnightIST } = require('../utils/timeHelper');
const ai = require('../utils/ai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('learn')
        .setDescription('Manage your learning items')
        .addSubcommand(sub => 
            sub.setName('add')
               .setDescription('Add a new item to learn')
               .addStringOption(opt => opt.setName('name').setDescription('Name of the item').setRequired(true))
               .addAttachmentOption(opt => opt.setName('image').setDescription('The image to study').setRequired(true))
               .addStringOption(opt => opt.setName('frequency').setDescription('Optional: Default: Daily').setAutocomplete(true).setRequired(false))
        )
        .addSubcommand(sub => 
            sub.setName('remove')
               .setDescription('Permanently delete an item')
               .addStringOption(opt => opt.setName('item').setDescription('Name or #ID').setAutocomplete(true).setRequired(true))
        )
        .addSubcommand(sub => 
            sub.setName('archive')
               .setDescription('Move an item to the Archive')
               .addStringOption(opt => opt.setName('item').setDescription('Name or #ID').setAutocomplete(true).setRequired(true))
        )
        .addSubcommand(sub =>
            sub.setName('rename')
               .setDescription('Rename a learning item')
               .addStringOption(opt => opt.setName('item').setDescription('Existing #ID or Name').setAutocomplete(true).setRequired(true))
               .addStringOption(opt => opt.setName('new_name').setDescription('The new name').setRequired(true))
        ),
    async autocomplete(interaction) {
        const focused = interaction.options.getFocused(true);
        const sub = interaction.options.getSubcommand();

        if (focused.name === 'frequency') {
            const freqs = await Frequency.find();
            const filtered = freqs.filter(f => f.name.toLowerCase().includes(focused.value.toLowerCase()));
            await interaction.respond(filtered.map(f => ({ name: f.name, value: f.name })).slice(0, 25));
        }

        if (focused.name === 'item') {
            const query = { userId: interaction.user.id };
            if (sub !== 'rename') query.isArchived = false;

            const items = await Item.find(query).sort({ isArchived: 1, activeSeq: 1, archiveSeq: 1 });
            const filtered = items.filter(i => i.name.toLowerCase().includes(focused.value.toLowerCase()) || (i.activeSeq && String(i.activeSeq).includes(focused.value)) || (i.archiveSeq && String(i.archiveSeq).includes(focused.value)));
            
            await interaction.respond(filtered.map(i => {
                const label = i.isArchived ? `📦 [Archive #${i.archiveSeq || 'Old'}] ${i.name}` : `📖 [#${i.activeSeq || 'Old'}] ${i.name}`;
                return { name: label, value: i._id.toString() };
            }).slice(0, 25));
        }
    },
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        // CRITICAL: Always defer to prevent interaction timeout
        await interaction.deferReply({ ephemeral: (sub !== 'add') });

        const userConf = await UserConfig.findOne({ userId });
        const masterName = userConf ? userConf.preferredName : null;

        if (sub === 'add') {
            const name = interaction.options.getString('name');
            const image = interaction.options.getAttachment('image');
            
            let freq = await Frequency.findOne({ name: interaction.options.getString('frequency') }) 
                       || await Frequency.findOne({ isDefault: true }) 
                       || { name: 'Daily', duration: 86400000 };

            const config = await Config.findOne();
            const storageChannel = interaction.client.channels.cache.get(config?.storageChannelId);
            if (!storageChannel) return interaction.editReply('Master, the storage room is not set up. Please visit the Admin Panel.');

            const sentMsg = await storageChannel.send({ content: `Drop: ${interaction.user.tag}`, files: [image.url] });
            const lastActive = await Item.findOne({ userId, isArchived: false }).sort({ activeSeq: -1 });
            const nextActive = lastActive ? lastActive.activeSeq + 1 : 1;

            const newItem = new Item({
                userId, name, imageUrl: sentMsg.attachments.first().url, storageMessageId: sentMsg.id, storageChannelId: storageChannel.id,
                frequencyName: freq.name, frequencyDuration: freq.duration, nextReminder: getMidnightIST(Date.now() + freq.duration), activeSeq: nextActive
            });

            await newItem.save();
            await updateDashboard(interaction.client, interaction.guild.id, userId);
            return interaction.editReply({ content: ai.getAddMessage(name, masterName) });
        }

        if (sub === 'rename') {
            const itemIdOrName = interaction.options.getString('item');
            const newName = interaction.options.getString('new_name');
            
            let item = await Item.findById(itemIdOrName) || await Item.findOne({ userId, activeSeq: parseInt(itemIdOrName), isArchived: false }) || await Item.findOne({ userId, archiveSeq: parseInt(itemIdOrName), isArchived: true }) || await Item.findOne({ userId, name: itemIdOrName });

            if (!item) return interaction.editReply({ content: 'I could not find that item in my records.' });
            
            const oldName = item.name;
            item.name = newName;
            await item.save();

            const loc = item.isArchived ? "in your archives" : "on your dashboard";
            await updateDashboard(interaction.client, interaction.guild.id, userId);
            return interaction.editReply({ content: ai.getRenameMessage(newName, masterName) });
        }

        if (sub === 'remove' || sub === 'archive') {
            const itemIdOrName = interaction.options.getString('item');
            let item = await Item.findById(itemIdOrName) || await Item.findOne({ userId, activeSeq: parseInt(itemIdOrName), isArchived: false });
            if (!item) return interaction.editReply({ content: 'I could not find that item.' });

            if (sub === 'remove') {
                await Item.findByIdAndDelete(item._id);
                await interaction.editReply({ content: ai.getRemoveMessage(null, masterName) });
            } else {
                item.isArchived = true;
                item.activeSeq = null;
                const lastArchive = await Item.findOne({ userId, isArchived: true }).sort({ archiveSeq: -1 });
                item.archiveSeq = lastArchive ? lastArchive.archiveSeq + 1 : 1;
                await item.save();
                await interaction.editReply({ content: ai.getArchiveMessage(item.name, masterName) });
            }
            await updateDashboard(interaction.client, interaction.guild.id, userId);
        }
    }
};