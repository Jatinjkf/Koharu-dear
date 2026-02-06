const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    botName: { type: String, default: 'Koharu' },
    storageChannelId: { type: String, default: null }, 
    quickAddChannelId: { type: String, default: null }, 
    reminderTime: { type: String, default: '0 0 * * *' },
    adminPassword: { type: String, default: 'koharu' }
});

module.exports = mongoose.model('Config', configSchema);