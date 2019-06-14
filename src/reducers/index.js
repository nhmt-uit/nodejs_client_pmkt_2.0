import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// System Reducers
import LanguageReducer from './systems/LanguageReducer';
import AuthReducer from './systems/AuthReducer';
<<<<<<< HEAD
import AccountantReducer from './AccountantReducer';
=======
import NotificationReducer from './systems/NotificationReducer';
>>>>>>> d685959cb443b8d7a194a032b42d836cb26586b6

const appReducers = combineReducers({
    // Redux form reducer
    form: formReducer,

    // System reducers
    LanguageReducer,
    AuthReducer,
<<<<<<< HEAD

    // Accountant Reducer
    AccountantReducer
=======
    NotificationReducer
>>>>>>> d685959cb443b8d7a194a032b42d836cb26586b6
});

export default appReducers;