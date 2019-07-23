import { isEmpty as _isEmpty } from 'lodash'

import { ReportActionType } from 'my-constants/action-types';

let defaultState = {
    errors: {},
    msg: {},
    cyclePage: {},
    isFetching: false,
    isFetchingReport: false,
    itemActive: '',
    reportType: 'cycle',
    isFetchingMoneyExchange: false,
    moneyExchangeIds: [],
    btnMoneyExchangeClicked: false,
};

const ReportReducer = (state = defaultState, action) => {
    switch(action.type){
        case ReportActionType.GET_CYCLE_PAGE_INITIAL:
            return {...defaultState, isFetching: true};
        case ReportActionType.GET_CYCLE_PAGE_SUCCESS:
            if(!_isEmpty(action.payload)) {
                return {...state, cyclePage: action.payload, errors: {}, isFetching: action.isFetching};
            }
            return {...state, isFetching: action.isFetching};
        case ReportActionType.GET_CYCLE_PAGE_FAIL:
            return {...state, errors: action.payload, isFetching: action.isFetching};

        case ReportActionType.CLOSE_CYCLE_SUCCESS:
            return {...state, moneyExchangeIds: [], cyclePage: action.payload, errors: {}};
        case ReportActionType.CLOSE_CYCLE_FAIL:
            return {...state, moneyExchangeIds: [], errors: action.payload};

        case ReportActionType.GET_REPORT:
            return {...state, moneyExchangeIds: [], isFetchingReport: true, statusBtnMoneyExchange: false, reportType: 'cycle', errors: {}};
        case ReportActionType.GET_REPORT_SUCCESS:
            return {...state, ...action.payload.res, reportType: 'cycle', isFetchingReport: false, itemActive: action.payload.itemActive, errors: {}};
        case ReportActionType.GET_REPORT_FAIL:
            return {...state, isFetchingReport: false, reportType: 'cycle', errors: action.payload};

        case ReportActionType.GET_REPORT_BY_BANKER:
            return {...state, moneyExchangeIds: [], isFetchingReport: true, reportType: 'banker', statusBtnMoneyExchange: false, errors: {}};
        case ReportActionType.GET_REPORT_BY_BANKER_SUCCESS:
            return {...state, ...action.payload.res, isFetchingReport: false, reportType: 'banker', itemActive: action.payload.itemActive, errors: {}};
        case ReportActionType.GET_REPORT_BY_BANKER_FAIL:
            return {...state, isFetchingReport: false, reportType: 'banker', errors: action.payload};

        case ReportActionType.GET_REPORT_BY_MEMBER:
            return {...state, moneyExchangeIds: [], isFetchingReport: true, reportType: 'member', statusBtnMoneyExchange: false, errors: {}};
        case ReportActionType.GET_REPORT_BY_MEMBER_SUCCESS:
            return {...state, ...action.payload.res, isFetchingReport: false, reportType: 'member', itemActive: action.payload.itemActive, errors: {}};
        case ReportActionType.GET_REPORT_BY_MEMBER_FAIL:
            return {...state, isFetchingReport: false, reportType: 'member', errors: action.payload};

        case ReportActionType.MONEY_EXCHANGE:
            return {...state, isFetchingMoneyExchange: true, errors: {}};
        case ReportActionType.MONEY_EXCHANGE_SUCCESS:
            return {...state, moneyExchangeIds: [], isFetchingMoneyExchange: false, errors: {}};
        case ReportActionType.MONEY_EXCHANGE_FAIL:
            return {...state, moneyExchangeIds: [], isFetchingMoneyExchange: false, errors: action.payload};

        case ReportActionType.CHANGE_MONEY_EXCHANGE_IDS:
            let newMoneyExchangeIds = [...state.moneyExchangeIds];

            if (newMoneyExchangeIds.includes(action.payload)) {
                newMoneyExchangeIds.splice(newMoneyExchangeIds.indexOf(action.payload), 1);
            } else {
                newMoneyExchangeIds.push(action.payload);
            }
            
            return { ...state, moneyExchangeIds: newMoneyExchangeIds };

        case ReportActionType.CHANGE_STATUS_BTN_MONEY_EXCHANGE:
            return { ...state, moneyExchangeIds: [], statusBtnMoneyExchange: action.payload };

        default:
            return {...state};
    }
};

export default ReportReducer;