
import providerData from '../utils/casinoProvider.json'
const FindGameTypeIdByName = (gameType) => {
    const gameTypeValues = {
        100: "Casino Lobby",
        101: "Baccarat",
        102: "Blackjack",
        103: "Roulette",
        104: "Dragon Tiger",
        105: "Sicbo",
        106: "Bull Bull",
        107: "Poker",
        108: "Dice",
        109: "Game Show",
        200: "Games Lobby",
        201: "Slots",
        202: "Arcade Games",
        203: "Fishing Games",
        204: "Table Games",
        205: "Scratchcards",
        206: "Virtual Games",
        207: "Lottery Games",
        208: "Other Games",
        300: "Sportsbook"
    };
  
    return gameTypeValues[gameType] || null;
  };
  const  getGameProvider=(id)=>{
      return providerData.all_providers_name[id]||"Casino"
    }
    function formatDate(inputDate) {
      const date = new Date(inputDate);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns zero-based months
      const year = date.getFullYear().toString();
    
      return `${day}/${month}/${year}`;
    }
        function convertToUniversalTime(time12h) {
          // Check if the input is undefined or not in the expected format
          if (!time12h || typeof time12h !== 'string' || !time12h.includes(':')) {
              return "Invalid time format";
          }
      
          // Split the time string into hours, minutes, seconds, and AM/PM indicator
          const [time, period] = time12h.split(' ');
      
          // Split hours, minutes, and seconds
          const [hours, minutes, seconds] = time.split(':').map(Number);
      
          // Convert hours to 24-hour format
          let hours24 = hours % 12;
          hours24 += (period && period.toUpperCase() === 'PM') ? 12 : 0;
          
          // Convert midnight (12:00:00 AM) to 24-hour format (00:00:00)
          if (hours === 12 && (!period || period.toUpperCase() === 'AM')) {
              hours24 = 0;
          }
      
          // Return the time in 24-hour format
          return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
  
      const checkPermission = (permissions, key) => {
        const permission = permissions?.find((permission) => permission.name === key);
        return permission ? permission.value : false;
      };
  
     const parseData=(string)=>{
        try {
          return JSON.parse(string).en.replace(/_/g, '  '); 
        } catch (error) {
          return string.replace(/_/g, '  ');
        }
      }
    
  
  export {FindGameTypeIdByName,getGameProvider,formatDate,convertToUniversalTime,checkPermission,parseData}
