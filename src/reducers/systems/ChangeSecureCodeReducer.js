import { ChangeSecureCodeActionType } from 'my-constants/action-types';

let defaultState = {
    isShowNotify: false,
    errors: {},
    status: false,
};

const ChangeSecureCodeReducer = (state = defaultState, action) => {
    switch(action.type){
        case ChangeSecureCodeActionType.CHANGE_SECURE_CODE_SUCCESS:
            return {...state, isShowNotify: true, status: true, errors: {}};
        case ChangeSecureCodeActionType.CHANGE_SECURE_CODE_FAIL:
            return {...state, isShowNotify: true, status: false, errors: action.payload.errors};
        case ChangeSecureCodeActionType.TOGGLE_NOTIFY:
            return {...state, isShowNotify: action.isShowNotify};

        default:
            return {...state};
    }
};

export default ChangeSecureCodeReducer;