const { InteractionType } = require('discord.js');
const Item = require('../models/Item');
const UserConfig = require('../models/UserConfig');
const Config = require('../models/Config');
const ai = require('../utils/ai');
const { getMidnightIST } = require('../utils/timeHelper');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            // 1. Handle Chat Commands
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;
                try { await command.execute(interaction); } 
                catch (error) {
                    console.error('[Command Error]', error);
                    const msg = { content: 'My apologies, Master. I encountered an error. 🙇‍♀️', ephemeral: true };
                    if (interaction.deferred || interaction.replied) await interaction.editReply(msg).catch(()=>{});
                    else await interaction.reply(msg).catch(()=>{});
                }
            } 
            
            // 2. Handle Autocomplete
            else if (interaction.isAutocomplete()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;
                try { await command.autocomplete(interaction); } catch (e) {}
            }

            // 3. Handle Buttons
            else if (interaction.isButton()) {
                if (interaction.customId.startsWith('batch_done_')) {
                    const intendedUserId = interaction.customId.split('_').pop();
                    if (interaction.user.id !== intendedUserId) {
                        return interaction.reply({ content: "My apologies, but these notes are for another Master's eyes only. 🙇‍♀️", ephemeral: true });
                    }

                    // Acknowledge immediately to prevent 10062 error
                    await interaction.deferReply({ ephemeral: false });

                    const items = await Item.find({ 
                        userId: interaction.user.id, 
                        isArchived: false, 
                        awaitingReview: true,
                        lastReminderMessageId: interaction.message.id 
                    });

                    if (items.length === 0) {
                        return interaction.editReply({ content: "Master, these items have already been processed for today. 🌸" });
                    }

                    const completedNames = [];
                    for (const item of items) {
                        const nextDate = getMidnightIST(Date.now() + item.frequencyDuration);
                        item.nextReminder = nextDate;
                        item.awaitingReview = false;
                        item.lastReminderMessageId = null;
                        await item.save();
                        completedNames.push(item.name);
                    }

                    const userConfig = await UserConfig.findOne({ userId: interaction.user.id });
                    const masterName = userConfig ? userConfig.preferredName : null;
                    const config = await Config.findOne();
                    const botName = config ? config.botName : 'Koharu';

                    const praise = await ai.getPraiseMessage(completedNames.join(', '), masterName, botName);
                    await interaction.editReply({ content: `✅ ${praise}` });

                    try { await interaction.message.edit({ components: [] }); } catch (e) {}
                }
            }
        } catch (err) {
            console.error("[Fatal Interaction Error]", err);
        }
    },
};