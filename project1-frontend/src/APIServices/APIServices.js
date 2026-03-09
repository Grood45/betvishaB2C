import axios from 'axios';
import { saveUserDetails } from '../redux/middleware/localstorageconfig';

const baseURL = import.meta.env.VITE_API_URL;


const axiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// UserLogin API function with site_auth_key
export const userLogin = async (username, password) => {
    try {
        const response = await axiosInstance.post('/api/user/user-login', {
            username,
            password,
            site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY // Adding site_auth_key to the request payload
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// GetSingleUser API function
export const getSingleUser = async (token, usernameToken, modelQuery) => {
    try {
        const response = await axiosInstance.get('/api/user/get-single-user', {
            headers: {
                token,
                usernametoken: usernameToken
            },
            params: {
                site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY
            }
        });
        return response?.data;
    } catch (error) {
        throw error.response.data;
    }
};

// UpdateSingleUser API function
export const updateSingleUser = async (token, usernameToken, modelQuery, userData) => {
    try {
        const response = await axiosInstance.patch('/api/user/update-single-user', userData, {
            headers: {
                token,
                usernametoken: usernameToken
            },
            params: {
                modelQuery
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// RegisterUser API function
export const registerUser = async (userData) => {
    try {
        const response = await axiosInstance.post('/api/user/register-user', {
            ...userData,
            site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};


// ChangePassword API function
export const changePassword = async (token, usernameToken, oldPassword, newPassword) => {
    try {
        const response = await axiosInstance.patch('/api/user/user-change-password', {
            oldPassword,
            newPassword
        }, {
            headers: {
                token,
                usernametoken: usernameToken
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
// SendOTP API function
export const sendOTP = async (identifier) => {
    try {
        // Determine the key to use based on the identifier type
        const payload = identifier.email
            ? { email: identifier.email, site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY }
            : { phone: identifier.phone, site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY };

        const response = await axiosInstance.post('/api/user/send-reset-otp', payload);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// VerifyOTPAndResetPassword API function
export const verifyOTPAndResetPassword = async (email, userEnteredOTP, newPassword) => {
    try {
        const response = await axiosInstance.post('/api/user/verify-otp-and-reset', {
            email,
            userEnteredOTP,
            newPassword,
            site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY 
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// GetSetting API function
export const getSetting = async () => {
    try {
        const response = await axiosInstance.get('/api/setting/get-setting/342h2b4j2bn2', {
            params: {
                site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY ,
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};


// Define the updateBankDetails API function
export const updateBankDetails = async (token, usernameToken, bankDetails) => {
    try {
        const response = await axiosInstance.patch('/api/user/update-bank-details', bankDetails, {
            headers: {
                token,
                usernametoken: usernameToken
            },
            params: {
                site_auth_key: import.meta.env.VITE_API_SITE_AUTH_KEY 
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
