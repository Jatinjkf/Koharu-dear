const { REST, Routes } = require('discord.js');
const Config = require('../models/Config');
const Frequency = require('../models/Frequency');
const ai = require('../utils/ai');
const scheduler = require('../utils/scheduler');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log("---------------------------------------");
        console.log(`🌸 [SUCCESS] ${client.user.tag} HAS AWAKENED!`);
        console.log("---------------------------------------");

        // 1. Initial status
        client.user.setActivity('over the Mansion', { type: 3 }); // Type 3 = Watching

        // 2. Initialize protocols
        try {
            // Default Config
            let config = await Config.findOne();
            if (!config) {
                config = await Config.create({ guildId: 'GLOBAL' }); // Primary config
                console.log('[Database] Primary protocols established.');
            }

            // Default Rhythms
            const freqCount = await Frequency.countDocuments();
            if (freqCount === 0) {
                const day = 24 * 3600000;
                await Frequency.create([
                    { name: "Daily", duration: day, isDefault: true },
                    { name: "Weekly", duration: 7 * day }
                ]);
                console.log('[Database] Default study rhythms memorized.');
            }
        } catch (e) { console.error("[Database] Initialization failed:", e.message); }

        // 3. Start Scheduler
        try {
            await scheduler.start(client);
        } catch (e) { console.error("[Scheduler] Start failed:", e.message); }

        // 4. Synchronize Commands
        // We only register commands once to avoid 'Multiple Commands' issue.
        const commands = [];
        client.commands.forEach(cmd => commands.push(cmd.data.toJSON()));
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        try {
            console.log('[System] Verifying command protocols...');
            // Registering GLOBAL commands (Instant update for new installs, but takes time to propagate to existing servers)
            // If you only have one server, using guild commands is faster.
            if (process.env.GUILD_ID) {
                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                    { body: commands },
                );
                console.log('[System] Mansion-specific commands synchronized.');
            } else {
                await rest.put(
                    Routes.applicationCommands(process.env.CLIENT_ID),
                    { body: commands },
                );
                console.log('[System] Global commands synchronized.');
            }
        } catch (error) {
            console.error('[System] Sync failed:', error.message);
        }

        // 5. Dynamic Status Loop
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

        // 6. Morning Rounds (Check for missed tasks)
        setTimeout(() => {
            scheduler.checkNow(client);
        }, 15000);
    },
};