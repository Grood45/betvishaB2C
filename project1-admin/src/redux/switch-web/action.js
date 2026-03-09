import { CHOOSE_WEBSITE } from "./actionTypes";
import { SITE_DETAILS } from "./actionTypes";


// Action creator

export const chooseWebsite = (website) => ({
    type: CHOOSE_WEBSITE,
    payload: website
  });


  export const detailsOfSite = (details) => ({
    type: SITE_DETAILS,
    payload: details
  });
