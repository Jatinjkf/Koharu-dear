const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Item = require('../models/Item');
const UserConfig = require('../models/UserConfig');
const { updateDashboard, getFreshImageUrl } = require('../utils/dashboardHelper');
const { getFutureMidnightIST } = require('../utils/timeHelper');
const ai = require('../utils/ai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('archive')
        .setDescription('Manage your archived items')
        .addSubcommand(sub => sub.setName('list').setDescription('View archived items'))
        .addSubcommand(sub => sub.setName('revive').setDescription('Bring back to active').addStringOption(opt => opt.setName('item').setDescription('Archive #ID').setAutocomplete(true).setRequired(true)))
        .addSubcommand(sub => sub.setName('send-all').setDescription('DMs all archived images')),
    async autocomplete(interaction) {
        const focused = interaction.options.getFocused(true);
        if (focused.name === 'item') {
            const items = await Item.find({ userId: interaction.user.id, guildId: interaction.guild.id, isArchived: true }).sort({ archiveSeq: 1 });
            const filtered = items.filter(i => 
                i.name.toLowerCase().includes(focused.value.toLowerCase()) || 
                (i.archiveSeq && String(i.archiveSeq).includes(focused.value))
            );
            await interaction.respond(filtered.map(i => ({ name: `Archive #${i.archiveSeq || 'Old'} - ${i.name}`, value: i._id.toString() })).slice(0, 25));
        }
    },
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        await interaction.deferReply({ ephemeral: true });

        const userConf = await UserConfig.findOne({ userId });
        const masterName = userConf ? userConf.preferredName : null;

        if (sub === 'list') {
            const items = await Item.find({ userId, guildId, isArchived: true }).sort({ archiveSeq: 1 });
            if (items.length === 0) return interaction.editReply({ content: 'The archive room is empty, Master.' });
            const list = items.map(i => `**#${i.archiveSeq || 'Old'}** - ${i.name}`).join('\n');
            const embed = new EmbedBuilder().setColor(0x808080).setTitle('🗄️ Archives').setDescription(list);
            return interaction.editReply({ embeds: [embed] });
        }

        if (sub === 'revive') {
            const id = interaction.options.getString('item');
            let item = await Item.findById(id) || await Item.findOne({ userId, guildId, archiveSeq: parseInt(id), isArchived: true });
            if (!item) return interaction.editReply({ content: 'I cannot find that archive, Master.' });

            item.isArchived = false;
            item.archiveSeq = null; 
            item.awaitingReview = false;
            
            const days = Math.round(item.frequencyDuration / 86400000);
            item.nextReminder = getFutureMidnightIST(days);

            const lastActive = await Item.findOne({ userId, guildId, isArchived: false }).sort({ activeSeq: -1 });
            item.activeSeq = lastActive ? lastActive.activeSeq + 1 : 1;
            await item.save();

            await updateDashboard(interaction.client, guildId, userId);
            return interaction.editReply({ content: ai.getReviveMessage(item.name, masterName) });
        }

        if (sub === 'send-all') {
            const items = await Item.find({ userId, guildId, isArchived: true }).sort({ archiveSeq: 1 });
            if (items.length === 0) return interaction.editReply('Archive is empty.');
            
            await interaction.editReply(`Refreshing and sending ${items.length} items to your DM...`);

            for (let i = 0; i < items.length; i += 10) {
                const chunk = items.slice(i, i + 10);
                const attachments = [];
                for (const it of chunk) { attachments.push(await getFreshImageUrl(interaction.client, it)); }
                try {
                    await interaction.user.send({ content: `📜 **Archive Batch ${Math.floor(i/10)+1}**`, files: attachments });
                } catch (e) {
                    return interaction.followUp({ content: "I cannot reach your DMs, Master.", ephemeral: true });
                }
                await new Promise(r => setTimeout(r, 2000)); 
            }
            return interaction.followUp({ content: "I have delivered all your archives, Master. 🙇‍♀️", ephemeral: true });
        }
    }
};