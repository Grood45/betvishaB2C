import axios from "axios";
// import { getCookie } from "@/app/redux-arch/adminauth/auth.slice";
import { retrieveUserDetails } from "../redux/middleware/localstorageconfig";
const getHeaders = () => {
  const adminauthCookie = retrieveUserDetails("adminauth");
  // console.log(adminauthCookie,"adminAuthcookie")
  if (adminauthCookie) {
    return {
      token: adminauthCookie.token,
      usernametoken: adminauthCookie.usernametoken,
    };
  }
  return {};
};

// Function to send a POST request
export const sendPostRequest = async (url, data) => {
  try {
    const response = await axios.post(url, data, {
      headers: getHeaders(),
    });
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error sending POST request:", error);
    throw error.response;
  }
};

// Function to fetch a GET request
export const fetchGetRequest = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: getHeaders(),
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching GET request:", error);
    throw error;
  }
};

// Function to send a PUT request
export const sendPatchRequest = async (url, data) => {
  try {
    const response = await axios.patch(url, data, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error sending PATCH request:", error);
    throw error;
  }
};

// Function to send a DELETE request
export const sendDeleteRequest = async (url) => {
  try {
    const response = await axios.delete(url, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error sending DELETE request:", error);
    throw error;
  }
};



export const formatDate=(dateString)=>{
  const date = new Date(dateString);

  const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
  };

  const formattedDate = date.toLocaleString('en-US', options);

  // Swap month and day to get the desired format: dd-mm-yyyy
  const [month, day, year] = formattedDate.split(",")[0].split("/");
  const time = formattedDate.split(",")[1].trim();

  return `${day}-${month}-${year} ${time}`;
}