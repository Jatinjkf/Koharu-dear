const { DateTime } = require('luxon');

/**
 * Returns current time in Asia/Kolkata
 */
function getISTDate() {
    return DateTime.now().setZone('Asia/Kolkata');
}

/**
 * Returns Midnight of a future day in IST.
 * Force-calculates to exactly 00:00:00 IST.
 */
function getFutureMidnightIST(daysToAdd = 0) {
    // 1. Get Today in IST
    let dt = DateTime.now().setZone('Asia/Kolkata');
    
    // 2. Add days and snap to start of day (00:00:00 IST)
    dt = dt.plus({ days: daysToAdd }).startOf('day');
    
    // 3. Convert to JS Date ensuring we don't drift back to UTC in a confusing way
    return new Date(dt.toMillis());
}

module.exports = { getISTDate, getFutureMidnightIST };