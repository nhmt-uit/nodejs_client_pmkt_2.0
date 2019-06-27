import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// System Reducers
import LanguageReducer from './systems/LanguageReducer';
import AuthReducer from './systems/AuthReducer';
import AccountantReducer from './AccountantReducer';
import NotificationReducer from './systems/NotificationReducer';
import BankerReducer from './banker/BankerReducer'
import ConfigurationReducer from './manage/ConfigurationReducer'

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
    ConfigurationReducer
});

export default appReducers;