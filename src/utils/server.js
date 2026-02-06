const express = require('express');
const path = require('path');
const Config = require('../models/Config');
const Frequency = require('../models/Frequency');
const UserConfig = require('../models/UserConfig');
const Item = require('../models/Item');
const parseDuration = require('./timeParser');
const scheduler = require('./scheduler');
const { ChannelType } = require('discord.js');

module.exports = (client) => {
    const app = express();
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../../public')));

    app.get('/', (req, res) => res.send("🌸 Koharu is serving her Master."));

    const gatekeeper = (req, res, next) => {
        if (req.headers['x-admin-password'] !== (process.env.ADMIN_PASSWORD || 'koharu')) return res.status(403).json({ error: "Denied" });
        next();
    };

    // --- API ROUTES ---

    app.get('/api/channels', gatekeeper, async (req, res) => {
        try {
            const guild = client.guilds.cache.first();
            if (!guild) return res.json([]);
            const channels = await guild.channels.fetch();
            const textChannels = channels.filter(c => c && c.type === ChannelType.GuildText).map(c => ({ id: c.id, name: c.name }));
            res.json(textChannels);
        } catch (e) { res.json([]); }
    });

    app.get('/api/config', gatekeeper, async (req, res) => {
        const config = await Config.findOne();
        res.json(config || {});
    });

    app.post('/api/config', gatekeeper, async (req, res) => {
        const { storageChannelId, quickAddChannelId, reminderHour, botName } = req.body;
        let config = await Config.findOne();
        if (!config) config = new Config();
        config.storageChannelId = storageChannelId;
        config.quickAddChannelId = quickAddChannelId;
        if (botName) config.botName = botName;
        if (reminderHour !== undefined) config.reminderTime = `0 ${reminderHour} * * *`;
        await config.save();
        scheduler.reschedule(client);
        res.json({ success: true });
    });

    app.get('/api/frequencies', gatekeeper, async (req, res) => res.json(await Frequency.find()));

    app.post('/api/frequencies', gatekeeper, async (req, res) => {
        const ms = parseDuration(req.body.duration);
        await Frequency.create({ name: req.body.name, duration: ms });
        res.json({ success: true });
    });

    app.post('/api/frequencies/defaults', gatekeeper, async (req, res) => {
        const day = 24 * 3600000;
        const defaults = [{ name: "Daily", duration: day, isDefault: true }, { name: "Weekly", duration: 7 * day }];
        for (const def of defaults) { await Frequency.findOneAndUpdate({ name: def.name }, def, { upsert: true }); }
        res.json({ success: true });
    });

    app.delete('/api/frequencies/:id', gatekeeper, async (req, res) => {
        const freq = await Frequency.findById(req.params.id);
        if (freq && await Item.findOne({ frequencyName: freq.name })) return res.status(400).json({ error: "Rhythm in use." });
        await Frequency.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    });

    app.get('/api/users', gatekeeper, async (req, res) => res.json(await UserConfig.find()));
    app.post('/api/users', gatekeeper, async (req, res) => {
        await UserConfig.findOneAndUpdate({ userId: req.body.userId }, { preferredName: req.body.name }, { upsert: true });
        res.json({ success: true });
    });

    app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../../public/admin.html')));
    app.listen(process.env.PORT || 3000, () => console.log("[WebUI] Ready."));
};