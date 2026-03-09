function GetCurrentTime() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const parts = formatter.formatToParts(now);

  const year = parts.find(part => part.type === 'year').value;
  const month = parts.find(part => part.type === 'month').value;
  const day = parts.find(part => part.type === 'day').value;
  const hours = parts.find(part => part.type === 'hour').value;
  const minutes = parts.find(part => part.type === 'minute').value;
  const seconds = parts.find(part => part.type === 'second').value;
  const ampm = parts.find(part => part.type === 'dayPeriod').value;

  const currentTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
  return currentTime;
}

module.exports = { GetCurrentTime };
