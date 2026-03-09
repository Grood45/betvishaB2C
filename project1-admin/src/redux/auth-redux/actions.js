import {
  GET_ADMIN_FAILURE,
  GET_ADMIN_REQUEST,
  GET_ADMIN_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  UPDATE_ADMIN_FAILURE,
  UPDATE_ADMIN_REQUEST,
  UPDATE_ADMIN_SUCCESS,
} from "./actionTypes";

// Action creators
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

// Action creator for getting admin information
export const getAdminRequest = () => ({
  type: GET_ADMIN_REQUEST
});

export const getAdminSuccess = (adminData) => ({
  type: GET_ADMIN_SUCCESS,
  payload: adminData
});

export const getAdminFailure = (error) => ({
  type: GET_ADMIN_FAILURE,
  payload: error
});

// Action creator for updating admin information
export const updateAdminRequest = () => ({
  type: UPDATE_ADMIN_REQUEST,
});

export const updateAdminSuccess = (updatedAdminData) => ({
  type: UPDATE_ADMIN_SUCCESS,
  payload: updatedAdminData
});

export const updateAdminFailure = (error) => ({
  type: UPDATE_ADMIN_FAILURE,
  payload: error
});
