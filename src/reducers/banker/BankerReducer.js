import { BankerActionType } from 'my-constants/action-types';

let defaultState = {
    payload: {},
    bankerList: {},
}

const BankerReducer = (state = defaultState, action) => {

    switch (action.type) {
        case BankerActionType.GET_BANKER:
            return {...state, payload: action.payload};
        case BankerActionType.GET_BANKER_BY_MEMBER:
            return {...state, bankerList: action.bankerList};
        default:
            return {...state};
    }
}

export default BankerReducer