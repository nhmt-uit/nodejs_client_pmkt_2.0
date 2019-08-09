import { UserActionType } from 'my-constants/action-types';

let defaultState = {
    lstUser: [],
    isFetchingUser: false,
};

const UserReducer = (state = defaultState, action) => {
    switch (action.type) {
        /* =============== GET SUB USERS ============= */
        case UserActionType.GET_USERS:
            return {...state, isFetchingUser: true};
        case UserActionType.GET_USERS_SUCCESS:
            return {...state, lstUser: action.lstUser, isFetchingUser: false};
        case UserActionType.GET_USERS_FAIL:
            return {...state, isFetchingUser: false};

        case UserActionType.CLEAR_USERS:
            return defaultState;

        default:
            return {...state};
    }
};

export default UserReducer