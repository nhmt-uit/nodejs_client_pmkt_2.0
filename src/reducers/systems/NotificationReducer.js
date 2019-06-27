import { NotificationActionType } from 'my-constants/action-types';

import { get } from 'lodash';

let defaultState = {
    errors: {},
    msg: {},
    friend: {},
};

const NotificationReducer = (state = defaultState, action) => {
    switch(action.type){
        case NotificationActionType.GET_MSG_SUCCESS:
            return {...state, msg: get(action.payload, 'res.data.List', {}), errors: {}};
        case NotificationActionType.GET_MSG_FAIL:
            return {...state, errors: action.payload};

        case NotificationActionType.GET_FRIEND_SUCCESS:
            return {...state, friend: action.payload, errors: {}};
        case NotificationActionType.GET_FRIEND_FAIL:
            return {...state, errors: action.payload};

        default:
            return {...state};
    }
};

export default NotificationReducer;