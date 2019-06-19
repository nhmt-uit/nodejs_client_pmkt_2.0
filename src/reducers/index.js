import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// System Reducers
import LanguageReducer from './systems/LanguageReducer';
import AuthReducer from './systems/AuthReducer';
import AccountantReducer from './AccountantReducer';
import NotificationReducer from './systems/NotificationReducer';
import ChangePasswordReducer from './systems/ChangePasswordReducer';
import BankerReducer from './banker/BankerReducer'
import ChangeSecureCodeReducer from './systems/ChangeSecureCodeReducer'

const appReducers = combineReducers({
    // Redux form reducer
    form: formReducer,
    banker: BankerReducer,
    // System reducers
    LanguageReducer,
    AuthReducer,

    // Accountant Reducer
    AccountantReducer,
    NotificationReducer,
    ChangePasswordReducer,
    ChangeSecureCodeReducer
});

export default appReducers;