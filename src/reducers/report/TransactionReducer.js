import { TransactionActionType } from 'my-constants/action-types';

let defaultState = {
    listTransaction: [],
    currencies: [],
    optCycle: [],
    optMoney: [],
    currencyMap: [],
    result: [],
    total: [],
}

const TransactionReducer = (state = defaultState, action) => {
    switch (action.type) {
        case TransactionActionType.GET_ALL_TRANSACTION:
            return {...state, currencies: action.currencies, listTransaction: action.listTransaction};

        case TransactionActionType.GET_CYCLE:
            return {...state, optCycle: action.optCycle};

        case TransactionActionType.GET_TYPE_OF_MONEY:
            return {...state, optMoney: action.optMoney};

        case TransactionActionType.SAVE_TRANSACTION:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse};

        case TransactionActionType.RESET_FORM_SAVE_RESPONSE_TRANSACTION:
                return {...state, formSaveStatus: null, formSaveResponse: {}}

        case TransactionActionType.DEL_TRANSACTION:
            return {...state};

        case TransactionActionType.GET_DETAIL_REPORT:
            return {...state, currencyMap: action.currencyMap, result: action.result, total: action.total};

        default:
            return {...state};
    }
}

export default TransactionReducer