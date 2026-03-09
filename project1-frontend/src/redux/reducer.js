// reducer.js

import { UPDATE_THEME, SET_SIDEBAR_VISIBILITY,SET_SIDEBAR_OPEN_ALWAYS, SET_ACTIVE_VARIABLE } from './actionTypes';


const initialState = {
  bgColor1:"#ffffff",
  bgGray: '#f2f2f2',
  bgGray100:"#8e979a",
  bgYellow: '#FFAA01',
  starBg: '#efa707',
  PrimaryText:"#000000",
  secondaryText:"#ffaa00",
  gray50:"#707070",
   hoverColor:"#ffaa00",
   greenBtn:"#33df72",
   redBtn:"#ec1c2b",
   blackBtn:"#000",
   borderLang:"#d9dee4",
   whiteText:"#ffffff",
   activeTabsBorder:"#ffaa00",
   warning:"#ec1c2b",
   progressBar:"#d9dee4",
   SnapiconBg: "#fffc00",
   fbiconBg: "#3b5998",
   whatsappiconBg: "#00b900",
   telegramiconBg: "#08c",
   instaiconBg: "#3f729b",
   twittericonBg: "#55acee",
   twittericonbg :"#000000"
  //  ClickActiveColor:"green"
};

const themeReducer = (state = initialState, action) => {
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
        case SET_ACTIVE_VARIABLE:
          return {
            ...state,
            activeVariable: action.payload
          };
    
    default:
      return state;
  }
};          

        
         

export default themeReducer;
