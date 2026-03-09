import { retrieveUserDetails, saveUserDetails } from "../middleware/localstorageconfig";
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

const retrieveData = retrieveUserDetails("adminauth");
const adminData = retrieveUserDetails("adminData");
const settingsData = retrieveUserDetails("settingsData");

const initialState = {
  isLoggedIn: retrieveData?.token || "",
  user: adminData.data || {},
  usernameToken: retrieveData?.usernameToken || "",
  adminLayer: adminData?.adminLayer || [],
  error: null,
  message: "",
  isAuthenticated: adminData ? true : false,
  loading: false,
  settings: settingsData||{},
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
        user: action.payload,
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
      case GET_SINGLE_USER:
      return {
        ...state,
        singleUserData: action.payload,

      };
    
      case GET_SETTING_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case GET_SETTING_SUCCESS:
        return {
          ...state,
          settings: action.payload,
          loading: false,
          error: null,
        };
      case GET_SETTING_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
    default:
      return state;
  }
};
