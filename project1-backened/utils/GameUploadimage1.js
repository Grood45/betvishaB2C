const express = require('express');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data'); // Import FormData

const app = express();
const PORT = 3000;

const uploadGameImages = async () => {
  try {
    const directoryPath = "utils/RTGResized";
    const files = fs.readdirSync(directoryPath);
    const urls = [];
    
    for (const filename of files) {
      const formData = new FormData();
      formData.append("post_img", fs.createReadStream(`${directoryPath}/${filename}`)); // Append file stream
      console.log(formData, "form data");

      const response = await axios.post("https://project85api.jeeto68.online/api/payment/image-url", formData, {
        headers: {
          ...formData.getHeaders() // Include headers required by FormData
        }
      });
      const { url } = response.data;
      console.log(response.data, "data");
      urls.push(url);
    }
    // Write the array of URLs to a JSON file
    fs.writeFileSync('urls.json', JSON.stringify(urls, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

module.exports = { uploadGameImages };
