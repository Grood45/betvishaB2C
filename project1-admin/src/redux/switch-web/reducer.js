import { CHOOSE_WEBSITE, SITE_DETAILS } from "./actionTypes";

// Define initial state
const initialState = {
  selectedWebsite: null,
  siteDetails:[]
};

// Reducer function
export const websiteReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHOOSE_WEBSITE:
      return {
        ...state,
        selectedWebsite: action.payload,
      };
      case SITE_DETAILS:
        return {
          ...state,
          siteDetails:action.payload
        }
    default:
      return state;
  }
};
