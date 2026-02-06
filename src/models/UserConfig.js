const mongoose = require('mongoose');

const userConfigSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    preferredName: { type: String, default: 'Master' },
    lastDashboardMessageId: { type: String, default: null },
    lastDashboardChannelId: { type: String, default: null }
});

module.exports = mongoose.model('UserConfig', userConfigSchema);