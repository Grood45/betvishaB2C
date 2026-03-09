import { retrieveUserDetails, saveUserDetails } from "../middleware/localstorageconfig";
import {
  GET_ADMIN_SUCCESS,
  UPDATE_ADMIN_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  GET_ADMIN_REQUEST,
  GET_ADMIN_FAILURE,
  UPDATE_ADMIN_REQUEST,
  UPDATE_ADMIN_FAILURE
} from "./actionTypes";

const retrieveData = retrieveUserDetails("adminauth");
const adminData = retrieveUserDetails("adminData");

const initialState = {
  isLoggedIn: retrieveData?.token || "",
  user: adminData.data || {},
  usernameToken: retrieveData?.usernameToken || "",
  adminLayer: adminData?.adminLayer || [],
  error: null,
  message: "",
  isAuthenticated: adminData ? true : false,
  loading: false
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
    case GET_ADMIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_ADMIN_SUCCESS:
      const updatedData1={...adminData,data:action.payload}
      // saveUserDetails("adminData",updatedData1)
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case GET_ADMIN_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case UPDATE_ADMIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UPDATE_ADMIN_SUCCESS:
      const updatedData={...adminData,data:action.payload}
      saveUserDetails("adminData",updatedData)
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    case UPDATE_ADMIN_FAILURE:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};
