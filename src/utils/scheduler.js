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
    console.log(`[Scheduler] Midnight Review IST: ${getISTDate().toFormat('yyyy-MM-dd')}`);
    try {
        const now = getISTDate().toJSDate();
        
        // Anti-Deadlock (24h safety)
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        await Item.updateMany({ awaitingReview: true, nextReminder: { $lte: yesterday } }, { awaitingReview: false });

        // Find items due ON or BEFORE now
        const dueItems = await Item.find({ nextReminder: { $lte: now }, isArchived: false, awaitingReview: false });
        if (dueItems.length === 0) {
            console.log("[Scheduler] No items due for this cycle.");
            return;
        }

        const userItems = {};
        for (const item of dueItems) {
            if (!userItems[item.userId]) userItems[item.userId] = [];
            userItems[item.userId].push(item);
        }

        const config = await Config.findOne();
        if (!config || !config.quickAddChannelId) return;
        const channel = client.channels.cache.get(config.quickAddChannelId);
        if (!channel) return;

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
                    item.lastReminderMessageId = null; // Reset for tray logic if needed
                    await item.save();
                }
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    } catch (err) { console.error('[Scheduler Error]:', err); }
}

async function startScheduler(client) {
    if (scheduledTask) scheduledTask.stop();
    
    // STRICT PROTOCOL: Always Midnight IST
    const cronTime = '0 0 * * *';
    console.log(`[Scheduler] Eternal Midnight Protocol active ("${cronTime}" IST)`);
    scheduledTask = cron.schedule(cronTime, () => checkReminders(client), { timezone: "Asia/Kolkata" });
}

module.exports = { start: startScheduler, reschedule: startScheduler, checkNow: checkReminders };