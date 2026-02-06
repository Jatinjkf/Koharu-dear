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
        if (!grouped[item.frequencyName]) {
            grouped[item.frequencyName] = { name: item.frequencyName, duration: item.frequencyDuration, items: [] };
        }
        grouped[item.frequencyName].items.push(item);
    });

    const sortedCategories = Object.values(grouped).sort((a, b) => a.duration - b.duration);

    for (const cat of sortedCategories) {
        const list = cat.items.map(i => `❀ **${i.name}** \`[#${i.activeSeq}]\``).join('\n');
        const partitionName = `─── 🌸 ✧ ${cat.name.toUpperCase()} ✧ 🌸 ───`;
        embed.addFields({ name: partitionName, value: list + '\n\u200b' });
    }

    return embed;
}

async function updateDashboard(client, userId) {
    // Small delay to let DB settle (Extended for Master's convenience)
    await new Promise(r => setTimeout(r, 2000));

    try {
        let userConfig = await UserConfig.findOne({ userId });
        if (!userConfig) userConfig = await UserConfig.create({ userId });

        const Config = require('../models/Config');
        const config = await Config.findOne();
        if (!config || !config.quickAddChannelId) {
            console.warn("[Dashboard] No quickAddChannelId found in config.");
            return;
        }

        // FORCE FETCH CHANNEL (Crucial for cloud)
        const channel = await client.channels.fetch(config.quickAddChannelId).catch(() => null);
        if (!channel) {
            console.warn(`[Dashboard] Could not fetch channel ${config.quickAddChannelId}`);
            return;
        }

        const embed = await generateDashboardEmbed(client, userId);
        const channelChanged = userConfig.lastDashboardChannelId !== config.quickAddChannelId;

        let messageFound = false;
        if (!channelChanged && userConfig.lastDashboardMessageId) {
            try {
                const lastMsg = await channel.messages.fetch(userConfig.lastDashboardMessageId);
                if (lastMsg) {
                    await lastMsg.edit({ content: `📜 **${userConfig.preferredName || 'Master'}'s Living Journal**`, embeds: [embed] });
                    messageFound = true;
                    console.log(`[Dashboard] Updated existing message for ${userId}`);
                }
            } catch (e) {
                console.log(`[Dashboard] Old message not found, will send new one.`);
            }
        }

        if (!messageFound) {
            const newMsg = await channel.send({ content: `📜 **${userConfig.preferredName || 'Master'}'s Living Journal**`, embeds: [embed] });
            userConfig.lastDashboardMessageId = newMsg.id;
            userConfig.lastDashboardChannelId = config.quickAddChannelId;
            await userConfig.save();
            console.log(`[Dashboard] Sent new message for ${userId}`);
        }

    } catch (err) { console.error("[Dashboard Update Error]:", err); }
}

module.exports = { generateDashboardEmbed, updateDashboard, getFreshImageUrl };