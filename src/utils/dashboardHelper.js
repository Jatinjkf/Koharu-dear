const { EmbedBuilder } = require('discord.js');
const Item = require('../models/Item');
const UserConfig = require('../models/UserConfig');
const ai = require('./ai');

function isUrlExpired(url) {
    if (!url) return true;
    try {
        const urlObj = new URL(url);
        const ex = urlObj.searchParams.get('ex');
        if (!ex) return false;
        const expiry = parseInt(ex, 16) * 1000;
        return Date.now() > (expiry - 3600000);
    } catch (e) { return true; }
}

async function getFreshImageUrl(client, item) {
    if (!isUrlExpired(item.imageUrl)) return item.imageUrl;
    if (!item.storageMessageId || !item.storageChannelId) return item.imageUrl;
    try {
        const channel = await client.channels.fetch(item.storageChannelId);
        const msg = await channel.messages.fetch(item.storageMessageId);
        const newUrl = msg.attachments.first().url;
        item.imageUrl = newUrl;
        await item.save();
        return newUrl;
    } catch (e) { return item.imageUrl; }
}

async function generateDashboardEmbed(client, userId) {
    // Protocol: Only filter by userId, as there is only one Mansion
    const items = await Item.find({ userId, isArchived: false }).sort({ activeSeq: 1 });
    const userConfig = await UserConfig.findOne({ userId });
    const displayName = userConfig ? userConfig.preferredName : null;

    const Config = require('../models/Config');
    const guildConfig = await Config.findOne(); 
    const botName = guildConfig ? guildConfig.botName : 'Koharu';

    const greeting = await ai.getDashboardIntro(displayName);

    const embed = new EmbedBuilder()
        .setColor(0xFFB6C1)
        .setTitle(`📚 ${botName}'s Dashboard`)
        .setDescription(greeting)
        .setTimestamp();

    if (items.length === 0) {
        embed.setDescription(`*The study hall is empty, ${displayName || 'Master'}. 🙇‍♀️*`);
        return embed;
    }

    const grouped = {};
    items.forEach(item => {
        if (!grouped[item.frequencyName]) grouped[item.frequencyName] = [];
        grouped[item.frequencyName].push(item);
    });

    for (const [freq, groupItems] of Object.entries(grouped)) {
        const list = groupItems.map(i => {
            const time = Math.floor(i.nextReminder.getTime() / 1000);
            return `❀ **${i.name}** \`[#${i.activeSeq}]\`\n└ *Next: <t:${time}:R>*`;
        }).join('\n');
        const partitionName = `─── 🌸 ✧ ${freq.toUpperCase()} ✧ 🌸 ───`;
        embed.addFields({ name: partitionName, value: list + '\n\u200b' });
    }

    return embed;
}

async function updateDashboard(client, userId) {
    try {
        let userConfig = await UserConfig.findOne({ userId });
        if (!userConfig) userConfig = await UserConfig.create({ userId });

        const Config = require('../models/Config');
        const config = await Config.findOne();
        if (!config || !config.quickAddChannelId) return;

        const channel = client.channels.cache.get(config.quickAddChannelId);
        if (!channel) return;

        const embed = await generateDashboardEmbed(client, userId);
        const channelChanged = userConfig.lastDashboardChannelId !== config.quickAddChannelId;

        let messageFound = false;
        if (!channelChanged && userConfig.lastDashboardMessageId) {
            try {
                const lastMsg = await channel.messages.fetch(userConfig.lastDashboardMessageId);
                if (lastMsg) {
                    await lastMsg.edit({ content: `📜 **${userConfig.preferredName || 'Master'}'s Living Journal**`, embeds: [embed] });
                    messageFound = true;
                }
            } catch (e) {}
        }

        if (!messageFound) {
            const newMsg = await channel.send({ content: `📜 **${userConfig.preferredName || 'Master'}'s Living Journal**`, embeds: [embed] });
            userConfig.lastDashboardMessageId = newMsg.id;
            userConfig.lastDashboardChannelId = config.quickAddChannelId;
            await userConfig.save();
        }

    } catch (err) { console.error("[Dashboard Update] Error:", err); }
}

module.exports = { generateDashboardEmbed, updateDashboard, getFreshImageUrl };