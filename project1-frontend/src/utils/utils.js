function formatDateTime(dateString) {
    const date = new Date(dateString);

    // Format day and month with leading zero if needed
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    // Get hours and minutes and format them with leading zero if needed
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, make it 12

    // Format hours with leading zero if needed
    const formattedHours = String(hours).padStart(2, '0');

    // Combine date and time into the desired format
    const formattedDate = `${day}-${month}-${year}, ${formattedHours}:${minutes}${ampm}`;

    return formattedDate;
}

const inputDate = "2024-09-01T11:26:43";
console.log(formatDateTime(inputDate));


export default formatDateTime