const { SlashCommandBuilder } = require('discord.js');
const Item = require('../models/Item');
const Frequency = require('../models/Frequency');
const UserConfig = require('../models/UserConfig');
const { updateDashboard } = require('../utils/dashboardHelper');
const { getFutureMidnightIST } = require('../utils/timeHelper');
const ai = require('../utils/ai');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Change the frequency of a learning item')
        .addStringOption(opt => opt.setName('item').setDescription('Name or #ID').setAutocomplete(true).setRequired(true))
        .addStringOption(opt => opt.setName('to').setDescription('The new rhythm').setAutocomplete(true).setRequired(true)),
    async autocomplete(interaction) {
        const focused = interaction.options.getFocused(true);
        if (focused.name === 'item') {
            const items = await Item.find({ userId: interaction.user.id, isArchived: false }).sort({ activeSeq: 1 });
            const filtered = items.filter(i => i.name.toLowerCase().includes(focused.value.toLowerCase()) || (i.activeSeq && String(i.activeSeq).includes(focused.value)));
            await interaction.respond(filtered.map(i => ({ name: `#${i.activeSeq || 'Old'} - ${i.name}`, value: i._id.toString() })).slice(0, 25));
        }
        if (focused.name === 'to') {
            const freqs = await Frequency.find();
            const filtered = freqs.filter(f => f.name.toLowerCase().includes(focused.value.toLowerCase()));
            await interaction.respond(filtered.map(f => ({ name: f.name, value: f.name })).slice(0, 25));
        }
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const itemIdOrName = interaction.options.getString('item');
        const freqName = interaction.options.getString('to');

        const userConf = await UserConfig.findOne({ userId: interaction.user.id });
        const masterName = userConf ? userConf.preferredName : null;

        let item = await Item.findById(itemIdOrName) || await Item.findOne({ userId: interaction.user.id, activeSeq: parseInt(itemIdOrName), isArchived: false });
        if (!item) return interaction.editReply({ content: 'Item not found.' });

        const frequency = await Frequency.findOne({ name: freqName });
        if (!frequency) return interaction.editReply({ content: 'Rhythm not found.' });

        item.frequencyName = frequency.name;
        item.frequencyDuration = frequency.duration;
        
        // FIX: Use the correct function name
        const days = Math.round(frequency.duration / 86400000);
        item.nextReminder = getFutureMidnightIST(days);
        item.awaitingReview = false; 
        
        await item.save();
        await updateDashboard(interaction.client, interaction.guild.id, interaction.user.id);

        return interaction.editReply({ content: ai.getMoveMessage(freqName, masterName) });
    }
};