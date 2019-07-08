import { ConfigurationActionType } from 'my-constants/action-types';

import { get } from 'lodash';

let defaultState = {
    errors: {},
    response: {},
    accountant: [],
    company: [],
    currency: [],
};

const ConfigurationReducer = (state = defaultState, action) => {
    switch(action.type){
        case ConfigurationActionType.GET_ACCOUNTANT_CONFIG_SUCCESS:
            return {...state, accountant: get(action.payload, 'res.data.List', {}), errors: {}};
        case ConfigurationActionType.GET_ACCOUNTANT_CONFIG_FAIL:
            return {...state, errors: action.payload};

        case ConfigurationActionType.GET_COMPANY_CONFIG_SUCCESS:
            return {...state, company: get(action.payload, 'res.data.List', {}), errors: {}};
        case ConfigurationActionType.GET_COMPANY_CONFIG_FAIL:
            return {...state, errors: action.payload};

        case ConfigurationActionType.GET_CURRENCY_CONFIG_SUCCESS:
            return {...state, currency: get(action.payload, 'res.data.List', {}), errors: {}};
        case ConfigurationActionType.GET_CURRENCY_CONFIG_FAIL:
            return {...state, errors: action.payload};

        case ConfigurationActionType.SAVE_ACCOUNTANT_CONFIG_SUCCESS:
        case ConfigurationActionType.SAVE_COMPANY_CONFIG_SUCCESS:
        case ConfigurationActionType.SAVE_CURRENCY_CONFIG_SUCCESS:
            return {...state, response: get(action.payload, 'res.data', {}), errors: {}};

        case ConfigurationActionType.SAVE_CURRENCY_CONFIG_FAIL:
            return {...state, errors: action.payload};

        case ConfigurationActionType.GET_INIT_CURRENCY_SUCCESS:
            return {...state, init_currency: get(action.payload, 'res.data', {}), errors: {}};


        default:
            return {...state};
    }
};

export default ConfigurationReducer;