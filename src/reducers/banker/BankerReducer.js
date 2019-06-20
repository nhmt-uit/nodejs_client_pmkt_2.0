import { BankerActionType } from 'my-constants/action-types';

let defaultState = {
    payload: {},
}

const BankerReducer = (state = defaultState, action) => {

    switch (action.type) {
        case BankerActionType.GET_BANKER:
            return {...state, payload: action.payload};
        default:
            return {...state};
    }
}

export default BankerReducer