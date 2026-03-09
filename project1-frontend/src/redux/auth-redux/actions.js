// auth-redux/actions.js
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  GET_SETTING_REQUEST,
  GET_SETTING_SUCCESS,
  GET_SETTING_FAILURE,
  GET_SINGLE_USER
} from "./actionTypes";


import { retrieveUserDetails, saveUserDetails } from "../middleware/localstorageconfig";

const retrieveData = retrieveUserDetails("adminauth");
const adminData = retrieveUserDetails("adminData");
const settingsData = retrieveUserDetails("settingsData");


export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData,
});
export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});
export const logout = () => ({ type: LOGOUT });

export const getSettingRequest = () => ({ type: GET_SETTING_REQUEST });
export const getSettingSuccess = (settingsData) => {
  saveUserDetails("settingsData", settingsData); // Save settings data to local storage
  return {
    type: GET_SETTING_SUCCESS,
    payload: settingsData,
  };
};
export const getSettingFailure = (error) => ({
  type: GET_SETTING_FAILURE,
  payload: error,
});

export const singleUserDetails = (data) => ({
  type: GET_SINGLE_USER,
  payload: data,
});

const initialState = {
  isLoggedIn: retrieveData?.token || "",
  user: adminData.data || {},
  usernameToken: retrieveData?.usernameToken || "",
  adminLayer: adminData?.adminLayer || [],
  error: null,
  message: "",
  isAuthenticated: adminData ? true : false,
  loading: false,
  settings: settingsData || {},
  singleUserData:{}

};


export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        error: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.data,
        error: null
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        error: null
      };

    default:
      return state;
  }
};
