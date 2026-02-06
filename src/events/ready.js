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

        client.user.setActivity('over the Mansion', { type: 3 });

        // 1. Initialize DB protocols
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
        } catch (e) { console.error("[Database] Init error:", e.message); }

        // 2. Start Scheduler
        await scheduler.start(client);

        // 3. THE CLEANUP: Wiping ghost commands
        const commands = [];
        client.commands.forEach(cmd => commands.push(cmd.data.toJSON()));
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

        (async () => {
            try {
                console.log('[System] Wiping ghost protocols (cleaning duplicate commands)...');
                
                // A. Wipe GLOBAL
                await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
                
                // B. Wipe & Register GUILD (If ID provided)
                if (process.env.GUILD_ID) {
                    await rest.put(
                        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                        { body: commands }
                    );
                    console.log('[System] Duplicates erased. Mansion-only commands active.');
                } else {
                    // Fallback to Global if no guild ID
                    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
                    console.log('[System] Duplicates erased. Global commands active.');
                }
            } catch (error) {
                console.error('[System] Cleanup failed:', error.message);
            }
        })();

        // 4. Dynamic Status
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

        // 5. Initial Check
        setTimeout(() => {
            scheduler.checkNow(client);
        }, 15000);
    },
};