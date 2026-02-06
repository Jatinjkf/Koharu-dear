const { Events } = require('discord.js');
const Config = require('../models/Config');
const Item = require('../models/Item');
const Frequency = require('../models/Frequency');
const UserConfig = require('../models/UserConfig');
const { updateDashboard } = require('../utils/dashboardHelper');
const { getFutureMidnightIST } = require('../utils/timeHelper');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot || !message.guild) return;

        const config = await Config.findOne();
        if (!config || message.channel.id !== config.quickAddChannelId) return;

        const attachments = message.attachments.filter(a => a.contentType?.startsWith('image/'));
        if (attachments.size === 0) return;

        const userConfig = await UserConfig.findOne({ userId: message.author.id });
        const masterName = userConfig ? userConfig.preferredName : 'Master';

        if (attachments.size > 1) {
            const reply = await message.reply(`My deepest apologies, ${masterName}. I can only process one study item at a time. 🙇‍♀️`);
            setTimeout(() => {
                message.delete().catch(() => {});
                reply.delete().catch(() => {});
            }, 10000);
            return;
        }

        const attachment = attachments.first();
        const storageChannel = message.guild.channels.cache.get(config.storageChannelId);
        if (!storageChannel) return;

        let freq = await Frequency.findOne({ isDefault: true }) || await Frequency.findOne() || { name: 'Daily', duration: 86400000 };
        const userId = message.author.id;

        try {
            const sentMsg = await storageChannel.send({ 
                content: `Quick Add: User ${message.author.tag} (${userId})`, 
                files: [attachment.url] 
            });

            const lastItem = await Item.findOne({ userId, isArchived: false }).sort({ activeSeq: -1 });
            const nextSeq = lastActive ? lastActive.activeSeq + 1 : 1;
            
            const days = Math.round(freq.duration / 86400000);
            const nextDate = getFutureMidnightIST(days);

            const itemName = message.content.trim() || `Item ${nextSeq}`;

            const newItem = new Item({
                userId,
                name: itemName,
                imageUrl: sentMsg.attachments.first().url,
                storageMessageId: sentMsg.id,
                storageChannelId: storageChannel.id,
                frequencyName: freq.name,
                frequencyDuration: freq.duration,
                nextReminder: nextDate,
                activeSeq: nextSeq
            });
            await newItem.save();

            const reply = await message.reply(`✅ Saved "**${itemName}**" to your ${freq.name} list, ${masterName}.`);
            await updateDashboard(message.client, userId);

            setTimeout(() => {
                message.delete().catch(() => {});
                reply.delete().catch(() => {});
            }, 60000);
        } catch (e) {
            console.error("[Quick Add] Error:", e);
        }
    }
};