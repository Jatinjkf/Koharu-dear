const cron = require('node-cron');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const Item = require('../models/Item');
const UserConfig = require('../models/UserConfig');
const Config = require('../models/Config');
const ai = require('./ai');
const dashboardHelper = require('./dashboardHelper');
const { getISTDate } = require('./timeHelper');

let scheduledTask = null;

async function checkReminders(client) {
    try {
        const istNow = getISTDate();
        const nowMS = istNow.toMillis();
        
        // Reset missed items silently
        const yesterdayMS = nowMS - (24 * 60 * 60 * 1000);
        await Item.updateMany({ awaitingReview: true, nextReminder: { $lte: new Date(yesterdayMS) } }, { awaitingReview: false });

        const dueItems = await Item.find({ 
            nextReminder: { $lte: new Date(nowMS) }, 
            isArchived: false, 
            awaitingReview: false 
        });

        if (dueItems.length === 0) return;

        const config = await Config.findOne();
        if (!config || !config.quickAddChannelId) return;

        const channel = await client.channels.fetch(config.quickAddChannelId).catch(() => null);
        if (!channel) return;

        const userItems = {};
        for (const item of dueItems) {
            if (!userItems[item.userId]) userItems[item.userId] = [];
            userItems[item.userId].push(item);
        }

        const botName = config.botName || 'Koharu';

        for (const userId of Object.keys(userItems)) {
            const items = userItems[userId];
            const userConfig = await UserConfig.findOne({ userId });
            const masterName = userConfig ? userConfig.preferredName : null;

            const chunkSize = 10;
            for (let i = 0; i < items.length; i += chunkSize) {
                const chunk = items.slice(i, i + chunkSize);
                const status = await ai.getStatusMessage(botName);
                const embeds = [];
                
                for(const item of chunk) {
                    const url = await dashboardHelper.getFreshImageUrl(client, item);
                    embeds.push(new EmbedBuilder()
                        .setColor(0xFFB6C1)
                        .setImage(url)
                        .setFooter({ text: `❀ Item #${item.activeSeq}: ${item.name}` }));
                }

                embeds[0].setTitle(`📅 Daily Protocol for ${masterName || 'Master'}`).setDescription(`*${status}.*`);

                const doneButton = new ButtonBuilder()
                    .setCustomId(`batch_done_${userId}`)
                    .setLabel(`I have learned them all, ${botName} 🌸`)
                    .setStyle(ButtonStyle.Secondary);

                await channel.send({ content: `🔔 <@${userId}>`, embeds: embeds, components: [new ActionRowBuilder().addComponents(doneButton)] });

                for (const item of chunk) {
                    item.awaitingReview = true;
                    await item.save();
                }
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    } catch (err) { /* Silent fail to maintain elegance */ }
}

async function startScheduler(client) {
    if (scheduledTask) scheduledTask.stop();
    // Midnight IST
    scheduledTask = cron.schedule('0 0 * * *', () => checkReminders(client), { timezone: "Asia/Kolkata" });
}

module.exports = { start: startScheduler, reschedule: startScheduler, checkNow: checkReminders };