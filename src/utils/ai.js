// 🌸 KOHARU'S PERSONAL MANUAL - EXPANDED DEVOTION
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
        "I have gathered all your study items on this tray, Master. Shall we begin? 🎀🍵",
        // NEW: Clumsy Variations
        "Master! W-welcome home! I nearly tripped while polishing your ledger, but it is ready now! 🙇‍♀️💦",
        "Master, I have tidied the hall... mostly! Please ignore that little ink smudge on the corner... 🎀🙇‍♀️",
        "Here is your schedule, Master! I hope I haven't mixed up the pages again... 📜🌸",
        "Master, I have been waiting for you! I even straightened every single fleur-de-lis on the tray! ✨🙇‍♀️",
        "Master, your study ledger is ready! I spent three hours just making sure the borders were even... 🏰🎀",
        " मास्टर, I hope the library isn't too chilly... I have prepared your study list to keep you busy! 🙇‍♀️🌸",
        "Master, look! I organized the items by color! ...Oh, you wanted them by frequency? I'll fix it! 🙇‍♀️💦",
        "I have brought the journal, Master. My hands were shaking a little because I was so excited to see you! 🎀✨",
        "Master, your humble maid has arrived! Please, take this ledger and let me know if I can do more. 🙇‍♀️🌸",
        "Everything is ready, Master. I even dusted the dust that I dusted earlier! 🧹✨"
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
        "You are truly a master of your studies, Master. I am honored to be your assistant. 🙇‍♀️🎀",
        // NEW: Clumsy Variations
        "Master! You finished so fast! I was still preparing the victory tea... please wait a second! 🍵💦",
        "Yay! Master is so smart! I accidentally clapped my hands too loud and scared the birds... 🌸🙇‍♀️",
        "Master, your progress is so beautiful it almost made me drop my tray! Truly inspiring... ✨🎀",
        "Well done, Master! I have recorded your victory. I won't smudge the ink this time, I promise! 🙇‍♀️✒️",
        "Master, you are simply amazing! I wish I could learn half as fast as you do... 🙇‍♀️🌸",
        "Master, I'm so proud! I'm going to tell the whole mansion how hard you worked today! 🏰✨",
        "Done! Master, you're so cool when you're focused... oh! Did I say that out loud? 🙇‍♀️💦",
        "Perfect marks, Master! I've already prepared your favorite chair for a well-deserved rest. 🎀🙇‍♀️",
        "Master, you make it look so easy! I'll make sure to double-check the rhythms now. 🌸✨",
        "Master, seeing you succeed is the greatest reward for this humble maid. 🙇‍♀️🎀"
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
        "It is a beautiful day to learn something new, Master. Here are your items. ✨🎀",
        // NEW: Clumsy Variations
        "Master! I am so sorry to disturb you, but the clock made a very loud noise... it is time! 🙇‍♀️💦",
        "Master, I have brought the tray! ...Wait, where did I put the sugar? Oh, here it is! And here are your notes! 🍵🌸",
        "Master, it is time for your review! I've been polishing the images just for you! ✨🙇‍♀️",
        "Master, please don't be mad, but the rhythms say it's time to study again! 🙇‍♀️🌸",
        "Master, I've brought your items. I promise I didn't get any tea stains on them this time! 🍵🎀",
        "Master! Your learning materials are ready! I'll stand right here and wait for you. 🙇‍♀️✨",
        "Master, the sun has reached the perfect angle for studying! Shall we begin? ☀️🌸",
        "Master, forgive my clumsiness, but I almost forgot to bring these to you! Here they are! 🙇‍♀️💦",
        "Time for review, Master! I've fluffed your pillows so you can study in comfort. 🎀🏰",
        "Master, your humble servant is here with the daily materials. Please, take a look. 🙇‍♀️🌸"
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
        "Master, I have received the item. I will guard it and present it when due. ✨🎀",
        // NEW: Clumsy Variations
        "Master, I've added it! I even used my special pink ink for the entry! 🙇‍♀️✒️",
        "Added! Master, this item looks very difficult... you are so brave for learning it! 🌸✨",
        "I have put it in the book, Master! I checked three times to make sure I didn't skip a line. 🙇‍♀️📜",
        "Master, the new item is saved! I'll make sure it's the first thing I show you tomorrow! 🏰🎀",
        "Master, I've filed the item! I hope I put it on the right shelf... let me check again! 🙇‍♀️💦",
        "Got it, Master! I've placed a little blossom next to its name in my registry. 🌸🙇‍♀️",
        "Master, I have obediently added your new note. I will keep it safe from dust! 🧹✨",
        "Master, it is recorded! My heart beats faster every time we add a new lesson. 🎀🙇‍♀️",
        "New item added! Master, your brain must be getting so heavy with all this knowledge! 🧠✨",
        "I have added it, Master! I'll keep the rhythm clock wound up just for this. ⏰🌸"
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
        "The item has been banished from your view, Master. ✨🎀",
        // NEW: Clumsy Variations
        "Master, it's gone! I even swept up the bits of paper left behind! 🧹🌸",
        "Removed! I'll try to forget it immediately so I don't get confused, Master! 🙇‍♀️💦",
        "Master, the deed is done. The item is no longer in my ledger. 🙇‍♀️📜",
        "Master, I have deleted it! I felt a little sad saying goodbye to it, but I obey! 🌸🙇‍♀️",
        "Master, I have cleared the space. Now there's more room for new tea sets! 🍵✨",
        "Master, it has been removed. I hope I didn't delete the wrong one... no, it's correct! 🙇‍♀️💦",
        "Master, I've erased the entry. The page is clean and white again! 🎀✨",
        "Master, your wish is my command. The item has been escorted out. 🏰🙇‍♀️",
        "Master, I've tidied that away. The library is looking much better now! 🧹🌸",
        "Master, it is gone! I'll make sure to update the dashboard right away. 🙇‍♀️✨"
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
        "I have dutifully archived the item for you, Master. ✨🎀",
        // NEW: Clumsy Variations
        "Master, I've put it in a box! I even tied it with a very pretty bow! 🎀📦",
        "Master, it's in the archives now! I promise not to let any spiders near it! 🕷️🚫",
        "Master, I've moved it to the attic... I mean, the Royal Archives! 🙇‍♀️🏰",
        "Archived! Master, I hope you don't miss it too much while it's away. 🌸📦",
        "Master, I've stored it safely. I'll keep the key around my neck! 🙇‍♀️🔑",
        "Master, it's in the long-term vault now. I've labeled it with your name! ✨📦",
        "Master, I have archived it. I'll make sure to dust the box every week! 🧹🎀",
        "Master, it is done. The item is now sleeping in the archive room. 😴📦",
        "Master, I've filed it away. It's safe and sound, just like your humble maid. 🙇‍♀️🌸",
        "Master, I've archived the item. Please let me know if you ever need it back! 📦✨"
    ],
    move: [
        "I have adjusted the rhythm for you, Master. It is now set to **{FREQ}**. 🙇‍♀️🌸",
        "Master, the item has been moved to its new schedule. ✨🏰",
        "As you command, I have changed how often I present this item, Master. 🎀📜",
        "New rhythm applied, Master. I will now follow the **{FREQ}** protocol. 🌸🙇‍♀️",
        "I have updated my clock for this item, Master. 🏰✨",
        "Moved to **{FREQ}**, Master. I shall obey the new timing strictly. 🙇‍♀️🌸",
        "Master, I have rescheduled the item as you instructed. 🎀✨",
        "The rhythm has been shifted, {NAME}. I will see you then. 🌸📜",
        "I have placed it on the **{FREQ}** shelf, Master. 🙇‍♀️🏰",
        "Updated, Master. Your learning cycle is now perfectly aligned. ✨🎀",
        // NEW: Clumsy Variations
        "Master, I've moved it! I hope I didn't break the clock while turning the gears... 🙇‍♀️💦",
        "Moved! Master, this new rhythm sounds like a very exciting dance! 💃🌸",
        "Master, I've rescheduled it! I'll make sure to wake up extra early for the next one! 🙇‍♀️✨",
        "Master, the item has a new home on the **{FREQ}** shelf! 🏰🎀",
        "Master, I've adjusted the clock. I had to use a very tiny screwdriver! 🙇‍♀️🔧",
        "Master, it is moved! I hope the item likes its new schedule... 🌸🙇‍♀️",
        "Master, I've changed the timing. I'll be sure to mark it in my master book! 📖✨",
        "Master, the protocol has shifted. I'll be waiting for you at the new time! 🙇‍♀️🏰",
        "Master, I've moved it. I promise not to get confused by the new dates! 🙇‍♀️💦",
        "Master, the rhythm is updated. Everything is in perfect harmony now! ✨🎀"
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
        "Master, the item has been returned to your study hall. ✨🎀",
        // NEW: Clumsy Variations
        "Master, I've brought it back! I had to dig through three boxes, but I found it! 🙇‍♀️📦",
        "Revived! Master, it looks like it missed you while it was in the archive! 🌸🙇‍♀️",
        "Master, look who's back! I've polished it until it looks brand new! ✨🎀",
        "Master, I've restored the item. I hope I didn't bring back any dust with it... 🙇‍♀️💦",
        "Master, it's active again! I've already cleared a spot on the tray for it! 🍵🌸",
        "Master, back from the dead! ...I mean, the archives! 🙇‍♀️🏰",
        "Master, I've revived it! I'll make sure it gets plenty of attention now! 🎀✨",
        "Master, it's back in the hall. I've updated the dashboard to show its return! 📜🌸",
        "Master, I've retrieved it. It was hiding behind a pile of old lace! 🙇‍♀️🎀",
        "Master, the item is restored. I'm so happy to see it back in action! ✨🙇‍♀️"
    ],
    rename: [
        "I have updated the name in my register, Master. 🙇‍♀️📝",
        "Master, the item is now known as **{ITEM}**. ✨🏰",
        "Renamed per your instruction, Master. 🎀📜",
        "I have corrected the ledger, Master. 🌸🙇‍♀️",
        "New name applied, Master. My memory is updated. 🏰✨",
        "Master, I have renamed the item to **{ITEM}**. 🙇‍♀️🌸",
        "Updated the item's identity, Master. 🎀✨",
        "I have rewritten the label for you, Master. 🌸📜",
        "As you wish, it is now titled **{ITEM}**, Master. 🙇‍♀️🏰",
        "Master, the name has been changed in your records. ✨🎀",
        // NEW: Clumsy Variations
        "Master, I've changed the name! I hope I spelled it correctly this time... 🙇‍♀️💦",
        "Master, it's now called **{ITEM}**! What a very clever name you chose! 🌸✨",
        "Master, I've updated the label. I used my best cursive handwriting! 🙇‍♀️✒️",
        "Master, the new title is recorded! I'll make sure everyone in the mansion knows! 🏰🎀",
        "Master, I've renamed it. I had to use a lot of white-out on the old entry... 🙇‍♀️💦",
        "Master, it's updated! I've put a little gold star next to the new name! ✨🌟",
        "Master, the ledger is corrected. It's much easier to read now! 📜🌸",
        "Master, I've changed the identity. It feels like a brand new item! 🙇‍♀️✨",
        "Master, the name is new! I'll try not to call it by the old one by mistake! 🙇‍♀️💦",
        "Master, renamed and ready! I've already updated the dashboard for you! 🎀✨"
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
        "Arranging fresh flowers 🦢",
        "Looking for Master's favorite pen ✒️",
        "Straightening the rugs 🏰",
        "Polishing the silver spoons ✨",
        "Singing a soft song while working 🎶",
        "Watering the garden roses 🌹",
        "Baking treats for Master 🍪",
        "Ironing Master's clothes 🎀",
        "Reading study guides 📖",
        "Dreaming of serving Master better 🙇‍♀️",
        "Counting Master's many victories 🏆"
    ]
};

class KoharuAI {
    constructor() { this.isReady = true; }

    _get(key, name, extra = {}) {
        const list = TEXTS[key];
        let text = list[Math.floor(Math.random() * list.length)];
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