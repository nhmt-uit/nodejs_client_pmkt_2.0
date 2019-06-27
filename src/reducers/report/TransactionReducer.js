import { TransactionActionType } from 'my-constants/action-types';

let defaultState = {
    payload: {},
    cycle: {},
    money: {},
}

const TransactionReducer = (state = defaultState, action) => {
    console.log("state",state)
    console.log("action",action)
    switch (action.type) {
        case TransactionActionType.GET_ALL_TRANSACTION:
            return {...state, payload: action.payload};

        case TransactionActionType.GET_CYCLE:
            return {...state, cycle: action.payload};

        case TransactionActionType.GET_TYPE_OF_MONEY:
            return {...state, money: action.payload};

        case TransactionActionType.SAVE_TRANSACTION:
            return {...state};

        default:
            return {...state};
    }
}

export default TransactionReducer