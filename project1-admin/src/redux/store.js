import { createStore, combineReducers } from 'redux';
import themeReducer from './reducer';
import { websiteReducer } from './switch-web/reducer';
import { authReducer } from './auth-redux/reducer';


// Combine reducers
const rootReducer = combineReducers({
  theme: themeReducer,
  websiteReducer: websiteReducer,
  authReducer: authReducer
});



// Create Redux store
// correct the code of these selecter and then comment out the above (combine reducer)
const store = createStore(rootReducer);

export default store;