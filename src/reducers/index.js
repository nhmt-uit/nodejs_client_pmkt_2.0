import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// System Reducers
import LanguageReducer from './systems/LanguageReducer';
import AuthReducer from './systems/AuthReducer';
import { AccountantReducer, AccountantScanReducer, AccountantToggleReducer } from './AccountantReducer';
import NotificationReducer from './systems/NotificationReducer';
import ChangePasswordReducer from './systems/ChangePasswordReducer';
import BankerReducer from './banker/BankerReducer'

const appReducers = combineReducers({
    // Redux form reducer
    form: formReducer,
    banker: BankerReducer,
    // System reducers
    LanguageReducer,
    AuthReducer,

    // Accountant Reducer
    AccountantReducer, AccountantScanReducer, AccountantToggleReducer,
    NotificationReducer,
    ChangePasswordReducer
});

export default appReducers;