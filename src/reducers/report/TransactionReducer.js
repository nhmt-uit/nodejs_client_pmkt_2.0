import { TransactionActionType } from 'my-constants/action-types';

let defaultState = {
    payload: {},
    optCycle: [],
    optMoney: [],
    reportDetail: {},
}

const TransactionReducer = (state = defaultState, action) => {
    switch (action.type) {
        case TransactionActionType.GET_ALL_TRANSACTION:
            return {...state, payload: action.payload};

        case TransactionActionType.GET_CYCLE:
            return {...state, optCycle: action.optCycle};

        case TransactionActionType.GET_TYPE_OF_MONEY:
            return {...state, optMoney: action.optMoney};

        case TransactionActionType.SAVE_TRANSACTION:
            return {...state};

        case TransactionActionType.DEL_TRANSACTION:
            return {...state};

        case TransactionActionType.GET_DETAIL_REPORT:
            return {...state, reportDetail: action.payload};

        default:
            return {...state};
    }
}

export default TransactionReducer