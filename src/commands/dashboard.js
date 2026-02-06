const { SlashCommandBuilder } = require('discord.js');
const { generateDashboardEmbed } = require('../utils/dashboardHelper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('View your current learning schedule'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        
        const embed = await generateDashboardEmbed(interaction.client, interaction.user.id);
        
        await interaction.editReply({ embeds: [embed] });
    }
};