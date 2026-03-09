// reducer.js

import { UPDATE_THEME, SET_SIDEBAR_VISIBILITY,SET_SIDEBAR_OPEN_ALWAYS } from './actionTypes';

const initialState = {
    color: "",
    bg:"#6b7280",
    hoverColor:"#4b5563",
    hover:"#4b5563",
    border: "#6b7280",
    iconColor:"#6b7280",
    primaryBg:"#fff",
    secondaryBg:"#E9ECEF",
    font: "",  
  sidebarVisible: false,
  sidebarVisibleAlways:false,
};
const preferrdTheme = JSON.parse(localStorage.getItem('saveTheme'));

const newState=preferrdTheme||initialState
const themeReducer = (state = newState, action) => {
  switch(action.type) {
    case UPDATE_THEME:
      return {
        ...state,
         
          ...state.theme,
          ...action.payload
        
      };
    case SET_SIDEBAR_VISIBILITY:
      return {
        ...state,
        sidebarVisible: action.payload
      };
      case SET_SIDEBAR_OPEN_ALWAYS:
        return {
          ...state,
          sidebarVisibleAlways: action.payload
        };
    default:
      return state;
  }
};          

        
         

export default themeReducer;
