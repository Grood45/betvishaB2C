const Promotion = require("../../models/promotion.model");

async function GetPromotion(query) {
  // Get current date and time
  const currentDate = new Date();
  // Format the current date to match the datetime format in the database
  const formattedCurrentDate = formatDate(currentDate);
  // Fetch active promotions for new user bonus with current date and time within start and end dates
  return await Promotion.findOne({
    ...query,
    start_date: { $lte: formattedCurrentDate },
    end_date: { $gte: formattedCurrentDate },
    status: true,
  });
}

// Helper function to format date to 'YYYY-MM-DD HH:mm:ss' format
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // Append AM/PM to the formatted date
  const ampm = hours >= 12 ? "PM" : "AM";
  return `${formattedDate} ${ampm}`;
}

module.exports = { GetPromotion };
