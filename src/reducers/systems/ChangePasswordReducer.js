import { ChangePasswordActionType } from 'my-constants/action-types';

let defaultState = {
    isShowNotify: false,
    errors: {},
    status: false,
};

const ChangePasswordReducer = (state = defaultState, action) => {
    switch(action.type){
        case ChangePasswordActionType.CHANGE_PASSWORD_SUCCESS:
            return {...state, isShowNotify: true, status: true, errors: {}};
        case ChangePasswordActionType.CHANGE_PASSWORD_FAIL:
            return {...state, isShowNotify: true, status: false, errors: action.payload.errors};
        case ChangePasswordActionType.CHANGE_PASSWORD_TOGGLE_NOTIFY:
            return {...state, isShowNotify: action.isShowNotify};

        case ChangePasswordActionType.CHANGE_PASSWORD2_SUCCESS:
            return {...state, isShowNotify: true, status: true, errors: {}};
        case ChangePasswordActionType.CHANGE_PASSWORD2_FAIL:
            return {...state, isShowNotify: true, status: false, errors: action.payload.errors};

        default:
            return {...state};
    }
};

export default ChangePasswordReducer;