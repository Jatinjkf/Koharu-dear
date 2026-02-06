const { REST, Routes } = require('discord.js');
const Config = require('../models/Config');
const Frequency = require('../models/Frequency');
const Item = require('../models/Item');
const ai = require('../utils/ai');
const scheduler = require('../utils/scheduler');
const { getFutureMidnightIST } = require('../utils/timeHelper');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log("---------------------------------------");
        console.log(`🌸 [SUCCESS] ${client.user.tag} HAS AWAKENED!`);
        console.log("---------------------------------------");

        client.user.setActivity('over the Mansion', { type: 3 });

        // 1. Mansion Protocols & Time Alignment
        try {
            let config = await Config.findOne();
            if (!config) {
                config = await Config.create({ botName: 'Koharu' });
                console.log('[Database] Protocols established.');
            }

            const freqCount = await Frequency.countDocuments();
            if (freqCount === 0) {
                const day = 24 * 3600000;
                await Frequency.create([
                    { name: "Daily", duration: day, isDefault: true },
                    { name: "Weekly", duration: 7 * day }
                ]);
                console.log('[Database] Default study rhythms memorized.');
            }

            // --- NEW: TIME ALIGNMENT PROTOCOL ---
            // Find all active items and ensure they are snapped to exactly 00:00 IST
            const items = await Item.find({ isArchived: false });
            let fixCount = 0;
            for (const item of items) {
                const correctTime = getFutureMidnightIST(0); // Snap to Today's Midnight
                // If it's already due, snap it to Today's Midnight so it triggers NOW
                if (item.nextReminder.getHours() !== 0 || item.nextReminder.getMinutes() !== 0) {
                    item.nextReminder = getFutureMidnightIST(0);
                    await item.save();
                    fixCount++;
                }
            }
            if (fixCount > 0) console.log(`[System] Recalibrated ${fixCount} items to Midnight IST.`);

        } catch (e) { console.error("[Database] Init error:", e.message); }

        // 2. Start Scheduler
        await scheduler.start(client);

        // 3. Command Cleanup
        const commands = [];
        client.commands.forEach(cmd => commands.push(cmd.data.toJSON()));
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        (async () => {
            try {
                await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
                if (process.env.GUILD_ID) {
                    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
                } else {
                    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
                }
            } catch (error) { console.error('[System] Sync failed:', error.message); }
        })();

        // 4. Status Loop
        const updateStatus = async () => {
             try {
                 const conf = await Config.findOne();
                 const botName = conf ? conf.botName : 'Koharu';
                 const statusText = await ai.getStatusMessage(botName);
                 client.user.setActivity(statusText, { type: 4 });
             } catch (e) {}
        };
        updateStatus();
        setInterval(updateStatus, 3 * 60 * 60 * 1000); 

        // 5. Morning Rounds (Check for missed tasks immediately)
        setTimeout(() => {
            scheduler.checkNow(client);
        }, 15000);
    },
};