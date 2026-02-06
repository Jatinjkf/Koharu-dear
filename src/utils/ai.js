// 🌸 KOHARU'S PERSONAL MANUAL - NO AI, PURE DEVOTION
const TEXTS = {
    dashboardIntro: [
        "Welcome home, Master. This humble maid has meticulously tidied your study schedule for you. 🙇‍♀️🌸",
        "Master, your devoted servant has prepared your learning dashboard. Please take a look... 🏰✨",
        "I have arranged your study materials exactly as you prefer, Master. I hope it pleases you. 🎀📜",
        "Forgive me for the wait, Master. Your schedule is now ready for your inspection. 🙇‍♀️🌸",
        "It is my honor to present your daily learning rhythms, Master. ✨🏰",
        "Your devoted maid has updated your records, Master. Every item is in its proper place. 🌸🙇‍♀️",
        "Master, I have polished your dashboard until it shines. Please proceed with your studies. 🎀✨",
        "I live only to serve your progress, Master. Here is your current study ledger. 📜🏰",
        "Awaiting your command, Master. I have prepared the library for your review. 🙇‍♀️🌸",
        "I have gathered all your study items on this tray, Master. Shall we begin? 🎀🍵"
    ],
    praise: [
        "Incredible work, Master! You have mastered those items. Your dedication is truly royal... ✨🎀",
        "Very good, Master. I am so proud of your hard work today. 🙇‍♀️🌸",
        "You have finished your review, Master! May I offer you some tea to celebrate your progress? 🍵✨",
        "Excellent focus, Master. I have updated your schedule to reflect your success. 🌸🏰",
        "Your humble maid is deeply impressed by your diligence, Master. 🙇‍♀️✨",
        "Master, you shine brighter with every lesson completed. Truly magnificent... 👑🌸",
        "I have marked those as done, Master. Your academic journey is progressing perfectly. 🎀📜",
        "It brings me such joy to see you learn so well, Master. I have adjusted the rhythms. 🙇‍♀️🌸",
        "Completed with grace, Master. I have put those items back in their places for next time. ✨🏰",
        "You are truly a master of your studies, Master. I am honored to be your assistant. 🙇‍♀️🎀"
    ],
    reminder: [
        "Forgive my intrusion, Master, but the time for your review has arrived. 🙇‍♀️🌸",
        "Master, I have brought your study materials. Please don't overwork yourself. ✨🏰",
        "It is time to learn, Master. I have prepared everything according to the rhythms. 🎀📜",
        "A gentle reminder for your studies, Master. Your humble maid is here to assist. 🌸🙇‍♀️",
        "The clock has struck the hour, Master. Shall we begin your review? 🏰✨",
        "I have laid out your notes in the hall, Master. Your progress awaits. 🙇‍♀️🌸",
        "Master, please take a moment to look over these items. I'll be here if you need me. 🎀✨",
        "The next cycle has begun, Master. I have brought your learning materials on my tray. 🍵🌸",
        "Forgive me, Master, but your study schedule requires your attention now. 🙇‍♀️🏰",
        "It is a beautiful day to learn something new, Master. Here are your items. ✨🎀"
    ],
    add: [
        "As you wish, Master. I have added this new item to your library. 🙇‍♀️🌸",
        "It is done, Master. I have placed the new material in your rhythms. ✨🏰",
        "New knowledge for the Mansion! I have recorded it carefully, Master. 🎀📜",
        "I have added this to your schedule, Master. I shall never let you forget it. 🌸🙇‍♀️",
        "Instructions received, Master. Your new study item is now under my protection. 🏰✨",
        "I have meticulously filed the item for you, Master. 🙇‍♀️🌸",
        "Master, I have added the new item. Your collection of knowledge grows! 🎀✨",
        "Consider it done, Master. I will remind you of this item according to the protocol. 🌸📜",
        "I have prepared a place for this new item in your daily review, Master. 🙇‍♀️🏰",
        "Master, I have received the item. I will guard it and present it when due. ✨🎀"
    ],
    remove: [
        "As you command, Master. I have removed that item from the mansion. 🙇‍♀️🌸",
        "I have erased those records per your instructions, Master. ✨🏰",
        "Item discarded, Master. The library is now tidier. 🎀📜",
        "I have removed the item, Master. I hope this lightens your burden. 🌸🙇‍♀️",
        "Master, I have obediently deleted the item from your schedule. 🏰✨",
        "It is gone, Master. I have updated the register accordingly. 🙇‍♀️🌸",
        "Master, I have cleared that item from my memory as you wished. 🎀✨",
        "Record deleted, Master. I await your further instructions. 🌸📜",
        "I have removed it from the tray, Master. 🙇‍♀️🏰",
        "The item has been banished from your view, Master. ✨🎀"
    ],
    archive: [
        "Master, I have carefully placed the item into the Royal Archives. 🙇‍♀️📦",
        "Moved to the archives, Master. It shall be preserved there eternally. ✨🏰",
        "I have put that item away for safekeeping, Master. 🎀📦",
        "As you wish, Master. The item is now in the archive room. 🌸🙇‍♀️",
        "Protocol updated: The item has been moved to storage, Master. 🏰📜",
        "Master, I have filed this item away in your personal archives. 🙇‍♀️🎀",
        "Stored and secured, Master. Your archive grows more impressive. 📦✨",
        "I have moved it from the active tray to the archive shelf, Master. 🌸🙇‍♀️",
        "The item is now archived, Master. You can revive it anytime you wish. 🏰📦",
        "I have dutifully archived the item for you, Master. ✨🎀"
    ],
    move: [
        "I have adjusted the rhythm for you, Master. It is now set to **{FREQ}**. 🙇‍♀️🌸",
        "Master, the item has been moved to its new schedule. ✨🏰",
        "As you command, I have changed how often I present this item, Master. 🎀📜",
        "New rhythm applied, Master. I will now follow the **{FREQ}** protocol. 🌸🙇‍♀️",
        "I have updated my clock for this item, Master. 🏰✨",
        "Moved to **{FREQ}**, Master. I shall obey the new timing strictly. 🙇‍♀️🌸",
        "Master, I have rescheduled the item as you instructed. 🎀✨",
        "The rhythm has been shifted, Master. I will see you then. 🌸📜",
        "I have placed it on the **{FREQ}** shelf, Master. 🙇‍♀️🏰",
        "Updated, Master. Your learning cycle is now perfectly aligned. ✨🎀"
    ],
    revive: [
        "Welcome back! I have brought the item back to your dashboard, Master. 🙇‍♀️🌸",
        "Master, I have retrieved the item from the archives for you. ✨🏰",
        "Revived and ready, Master. It is back in your active rhythms. 🎀📜",
        "I have restored the item to your tray, Master. 🌸🙇‍♀️",
        "Master, the item is active once more. 🏰✨",
        "Back from storage! I have updated your dashboard, Master. 🙇‍♀️🌸",
        "I have awakened the item from its archive sleep, Master. 🎀✨",
        "Restored per your request, Master. 🌸📜",
        "I have put it back into your daily cycles, Master. 🙇‍♀️🏰",
        "Master, the item has been returned to your study hall. ✨🎀"
    ],
    rename: [
        "I have updated the name in my register, Master. 🙇‍♀️📝",
        "Master, the item is now known as "**{ITEM}**". ✨🏰",
        "Renamed per your instruction, Master. 🎀📜",
        "I have corrected the ledger, Master. 🌸🙇‍♀️",
        "New name applied, Master. My memory is updated. 🏰✨",
        "Master, I have renamed the item to "**{ITEM}**". 🙇‍♀️🌸",
        "Updated the item's identity, Master. 🎀✨",
        "I have rewritten the label for you, Master. 🌸📜",
        "As you wish, it is now titled "**{ITEM}**", Master. 🙇‍♀️🏰",
        "Master, the name has been changed in your records. ✨🎀"
    ],
    status: [
        "Dusting the Royal Archives 🧹",
        "Preparing Master's tea 🍵",
        "Polishing study materials ✨",
        "Awaiting Master's orders 🙇‍♀️",
        "Organizing the library 📚",
        "Watching over Master 🌸",
        "Tidying the Mansion 🏰",
        "Reviewing study logs 📜",
        "Serving with devotion 🎀",
        "Arranging fresh flowers 🦢"
    ]
};

class KoharuAI {
    constructor() { this.isReady = true; }

    _get(key, name, extra = {}) {
        const list = TEXTS[key];
        let text = list[Math.floor(Math.random() * list.length)];
        
        // Logic: Use "Master [Name]" if name is provided, else just "Master"
        // Also handle pronouns intelligently by replacing '{NAME}'
        const title = name ? `Master ${name}` : "Master";
        text = text.replace(/{NAME}/g, title);
        
        if (extra.item) text = text.replace(/{ITEM}/g, extra.item);
        if (extra.freq) text = text.replace(/{FREQ}/g, extra.freq);
        return text;
    }

    async getReminderMessage(itemName, userName) { return this._get('reminder', userName, { item: itemName }); }
    async getPraiseMessage(itemName, userName) { return this._get('praise', userName, { item: itemName }); }
    async getDashboardIntro(userName) { return this._get('dashboardIntro', userName); }
    async getArchiveMessage(itemName, userName) { return this._get('archive', userName, { item: itemName }); }
    async getStatusMessage() { return TEXTS.status[Math.floor(Math.random() * TEXTS.status.length)]; }
    
    getAddMessage(itemName, userName) { return this._get('add', userName, { item: itemName }); }
    getRemoveMessage(itemName, userName) { return this._get('remove', userName); }
    getRenameMessage(itemName, userName) { return this._get('rename', userName, { item: itemName }); }
    getMoveMessage(freqName, userName) { return this._get('move', userName, { freq: freqName }); }
    getReviveMessage(itemName, userName) { return this._get('revive', userName, { item: itemName }); }
}

module.exports = new KoharuAI();