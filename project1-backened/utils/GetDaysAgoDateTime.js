function GetDaysAgoDateTime(days) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - days);
  
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    };
  
    let formattedDate = sevenDaysAgo.toLocaleString('en-US', options).replace(',', '');
    formattedDate = formattedDate.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
    
    return formattedDate;
  }


  module.exports={GetDaysAgoDateTime}