const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String, required: true }, 
    storageMessageId: { type: String },
    storageChannelId: { type: String },
    
    frequencyName: { type: String, required: true },
    frequencyDuration: { type: Number, required: true },
    nextReminder: { type: Date, required: true },
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    
    activeSeq: { type: Number, default: null }, 
    archiveSeq: { type: Number, default: null }, 
    
    lastReminderMessageId: { type: String, default: null },
    awaitingReview: { type: Boolean, default: false }
});

module.exports = mongoose.model('Item', itemSchema);