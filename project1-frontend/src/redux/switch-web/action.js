import { CHOOSE_WEBSITE, GET_PROVIDER_GROUP_NAME ,SET_ACTIVE_SIDEBAR_OPTION,SET_COUPON_CODE,SET_LOGIN_FORM} from "./actionTypes";

// Action creator
const chooseWebsite = (website) => ({ type: CHOOSE_WEBSITE, payload: website });


export const getProviderGroupName = (data) => ({
    type: GET_PROVIDER_GROUP_NAME,
    payload: data,
  });

  export const setSideBarOption = (data) => ({
    type: SET_ACTIVE_SIDEBAR_OPTION,
    payload: data,
  });

  export const setCouponCode = (coupon) => ({
    type: SET_COUPON_CODE,
    payload: coupon,
  });

  export const setLoginForm = (value) => ({
    type: SET_LOGIN_FORM,
    payload: value,
  });