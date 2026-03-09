import { CHOOSE_WEBSITE, GET_PROVIDER_GROUP_NAME, SET_ACTIVE_SIDEBAR_OPTION ,SET_COUPON_CODE,SET_LOGIN_FORM} from "./actionTypes";

// Define initial state
const initialState = {
  selectedWebsite: null,
  providerGroupName:"",
  sidebarActionOption:"1",
  couponCode:""  ,
  loginForm:false,
};

// Reducer function
export const websiteReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHOOSE_WEBSITE:
      return {
        ...state,
        selectedWebsite: action.payload,
      };
      case GET_PROVIDER_GROUP_NAME:
        return {
          ...state,
          providerGroupName:action.payload
        };
        case SET_ACTIVE_SIDEBAR_OPTION:
          return {
            ...state,
            sidebarActionOption:action.payload
          };
          case SET_COUPON_CODE:
            return {
              ...state,
              couponCode:action.payload
            };
            case SET_LOGIN_FORM:
              return {
                ...state,
                loginForm:action.payload
              };
    default:
      return state;
  }
};
