
// actions.js
import { UPDATE_THEME ,SET_SIDEBAR_VISIBILITY,SET_SIDEBAR_OPEN_ALWAYS,SET_ACTIVE_VARIABLE } from './actionTypes';

export const updateTheme = (theme) => ({
  type: UPDATE_THEME,
  payload: theme
});


export const setSidebarVisibility = (isVisible) => ({
  type: SET_SIDEBAR_VISIBILITY,
  payload: isVisible
});

export const setSidebarAlwaysOpen = (Visible) => ({
  type: SET_SIDEBAR_OPEN_ALWAYS,
  payload: Visible
});

export const setActiveVariable = (activeVariable) => {
  return {
    type: SET_ACTIVE_VARIABLE,
    payload: activeVariable
  };
};