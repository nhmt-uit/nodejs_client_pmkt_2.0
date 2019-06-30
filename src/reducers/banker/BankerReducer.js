import { BankerActionType } from 'my-constants/action-types';

let defaultState = {
    payload: {},
    payloadByMember: {},
}

const BankerReducer = (state = defaultState, action) => {

    switch (action.type) {
        case BankerActionType.GET_BANKER:
            return {...state, payload: action.payload};
        case BankerActionType.GET_BANKER_BY_MEMBER:
            return {...state, payloadByMember: action.payload};
        default:
            return {...state};
    }
}

export default BankerReducer