import { InfoUserActionType } from 'my-constants/action-types';

let defaultState = {
    lang_code : "en",
    payload: {},
};

const InfoUserReducer = (state = defaultState, action) => {
    switch(action.type) {
        case InfoUserActionType.GET_INFO_USER:
            return {...state, payload: action.payload, lang_code: "en"};
        default:
            return {...state};
    }
};

export default InfoUserReducer;