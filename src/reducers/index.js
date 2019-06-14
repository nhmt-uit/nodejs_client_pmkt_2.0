import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// System Reducers
import LanguageReducer from './systems/LanguageReducer';
import AuthReducer from './systems/AuthReducer';
import NotificationReducer from './systems/NotificationReducer';

const appReducers = combineReducers({
    // Redux form reducer
    form: formReducer,

    // System reducers
    LanguageReducer,
    AuthReducer,
    NotificationReducer
});

export default appReducers;