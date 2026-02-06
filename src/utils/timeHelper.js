const { DateTime } = require('luxon');

/**
 * Returns current time in Asia/Kolkata
 */
function getISTDate() {
    return DateTime.now().setZone('Asia/Kolkata');
}

/**
 * Returns Midnight of a future day in IST.
 * @param {number} daysToAdd Number of days to add from today.
 */
function getFutureMidnightIST(daysToAdd = 0) {
    // 1. Get today in IST
    let dt = DateTime.now().setZone('Asia/Kolkata');
    
    // 2. Add days
    dt = dt.plus({ days: daysToAdd });
    
    // 3. Snap to 00:00:00
    return dt.startOf('day').toJSDate();
}

module.exports = { getISTDate, getFutureMidnightIST };