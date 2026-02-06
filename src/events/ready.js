const { REST, Routes } = require('discord.js');
const Config = require('../models/Config');
const Frequency = require('../models/Frequency');
const ai = require('../utils/ai');
const scheduler = require('../utils/scheduler');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`🌸 [Success] ${client.user.tag} has awakened to serve.`);

        // 1. Mansion Protocols initialization
        try {
            let config = await Config.findOne();
            if (!config) await Config.create({ botName: 'Koharu' });

            const freqCount = await Frequency.countDocuments();
            if (freqCount === 0) {
                const day = 24 * 3600000;
                await Frequency.create([
                    { name: "Daily", duration: day, isDefault: true },
                    { name: "Weekly", duration: 7 * day }
                ]);
            }
        } catch (e) {}

        // 2. Start Scheduler
        await scheduler.start(client);

        // 3. Command Synchronization (Mansion-only)
        const commands = [];
        client.commands.forEach(cmd => commands.push(cmd.data.toJSON()));
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        try {
            await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
            if (process.env.GUILD_ID) {
                await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
            } else {
                await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
            }
        } catch (error) {}

        // 4. Dynamic Status Loop
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
        }, 10000);
    },
};