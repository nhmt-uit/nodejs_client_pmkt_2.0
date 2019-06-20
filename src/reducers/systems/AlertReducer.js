import { AlertActionType } from 'my-constants/action-types';

let defaultState = {
    payload: {},
}

const AlertReducer = (state = defaultState, action) => {
    switch (action.type) {
        case AlertActionType.GET_ALERT:
            return {...state, payload: action.payload};
        default:
            return {...state};
    }
}

export default AlertReducer