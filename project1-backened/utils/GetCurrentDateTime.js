const { DateTime } = require('luxon');

function GetCurrentDateTime() {
  // Get the current time in Asia/Kolkata time zone
  const now = DateTime.now().setZone('Asia/Kolkata');

  // Format the date and time in 'YYYY-MM-DDTHH:MM:SS' format
  return now.toFormat("yyyy-LL-dd'T'HH:mm:ss");
}

module.exports = { GetCurrentDateTime };
