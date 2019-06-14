import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

// System Reducers
import LanguageReducer from './systems/LanguageReducer';
import AuthReducer from './systems/AuthReducer';
import BankerReducer from './banker/BankerReducer'
import InfoUserReducer from "./infoUser/InfoUserReducer";

const appReducers = combineReducers({
    // Redux form reducer
    form: formReducer,
    banker: BankerReducer,
    user: InfoUserReducer,
    // System reducers
    LanguageReducer,
    AuthReducer
});

export default appReducers;