import { ReportActionType } from 'my-constants/action-types';

let defaultState = {
    errors: {},
    msg: {},
    cyclePage: {},
    isFetching: false,
    isFetchingReport: false,
    itemActive: '',
    reportType: 'cycle'
};

const ReportReducer = (state = defaultState, action) => {
    switch(action.type){
        case ReportActionType.GET_CYCLE_PAGE:
            return {...defaultState, isFetching: true};
        case ReportActionType.GET_CYCLE_PAGE_SUCCESS:
            return {...state, cyclePage: action.payload, errors: {}, isFetching: false};
        case ReportActionType.GET_CYCLE_PAGE_FAIL:
            return {...state, errors: action.payload, isFetching: false};

        case ReportActionType.CLOSE_CYCLE_SUCCESS:
            return {...state, cyclePage: action.payload, errors: {}};
        case ReportActionType.CLOSE_CYCLE_FAIL:
            return {...state, errors: action.payload};

        case ReportActionType.GET_REPORT:
            return {...state, isFetchingReport: true, reportType: 'cycle', errors: {}};
        case ReportActionType.GET_REPORT_SUCCESS:
            return {...state, ...action.payload.res, reportType: 'cycle', isFetchingReport: false, itemActive: action.payload.itemActive, errors: {}};
        case ReportActionType.GET_REPORT_FAIL:
            return {...state, isFetchingReport: false, reportType: 'cycle', errors: action.payload};

        case ReportActionType.GET_REPORT_BY_BANKER:
            return {...state, isFetchingReport: true, reportType: 'banker', errors: {}};
        case ReportActionType.GET_REPORT_BY_BANKER_SUCCESS:
            return {...state, ...action.payload.res, isFetchingReport: false, reportType: 'banker', itemActive: action.payload.itemActive, errors: {}};
        case ReportActionType.GET_REPORT_BY_BANKER_FAIL:
            return {...state, isFetchingReport: false, reportType: 'banker', errors: action.payload};

        case ReportActionType.GET_REPORT_BY_MEMBER:
            return {...state, isFetchingReport: true, reportType: 'member', errors: {}};
        case ReportActionType.GET_REPORT_BY_MEMBER_SUCCESS:
            return {...state, ...action.payload.res, isFetchingReport: false, reportType: 'member', itemActive: action.payload.itemActive, errors: {}};
        case ReportActionType.GET_REPORT_BY_MEMBER_FAIL:
            return {...state, isFetchingReport: false, reportType: 'member', errors: action.payload};

        default:
            return {...state};
    }
};

export default ReportReducer;