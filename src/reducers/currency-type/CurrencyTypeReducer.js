import { CurrencyTypeActionType } from 'my-constants/action-types';

let defaultState = {
    lstCurrencyType: [],
    isFetchingCurrency: false,
    error: null,
};

const CurrencyTypeReducer = (state = defaultState, action) => {
    switch (action.type) {
        case CurrencyTypeActionType.GET_CURRENCY_TYPE:
            return {...state, isFetchingCurrency: true, error: null};
        case CurrencyTypeActionType.GET_CURRENCY_TYPE_SUCCESS:
            return {...state, lstCurrencyType: action.lstCurrencyType, isFetchingCurrency: false, error: null};
        case CurrencyTypeActionType.GET_CURRENCY_TYPE_FAIL:
            return {...state, isFetchingCurrency: false, error: action.payload};

        default:
            return {...state};
    }
};

export default CurrencyTypeReducer