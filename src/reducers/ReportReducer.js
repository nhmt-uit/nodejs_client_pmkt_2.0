import { ReportActionType } from 'my-constants/action-types';

let defaultState = {
    errors: {},
    msg: {},
    cyclePage: {},
    isFetching: false,
    isFetchingReport: false,
};

const ReportReducer = (state = defaultState, action) => {
    switch(action.type){
        case ReportActionType.GET_CYCLE_PAGE:
            return {...state, isFetching: true};
        case ReportActionType.GET_CYCLE_PAGE_SUCCESS:
            return {...state, cyclePage: action.payload, errors: {}, isFetching: false};
        case ReportActionType.GET_CYCLE_PAGE_FAIL:
            return {...state, errors: action.payload, isFetching: false};

        case ReportActionType.CLOSE_CYCLE_SUCCESS:
            return {...state, cyclePage: action.payload, errors: {}};
        case ReportActionType.CLOSE_CYCLE_FAIL:
            return {...state, errors: action.payload};

        case ReportActionType.GET_REPORT:
            return {...state, isFetchingReport: true, errors: {}};
        case ReportActionType.GET_REPORT_SUCCESS:
            return {...state, ...action.payload, isFetchingReport: false, errors: {}};
        case ReportActionType.GET_REPORT_FAIL:
            return {...state, isFetchingReport: false, errors: action.payload};

        case ReportActionType.GET_REPORT_BY_BANKER_SUCCESS:
            return {...state, ...action.payload, errors: {}};
        case ReportActionType.GET_REPORT_BY_BANKER_FAIL:
            return {...state, errors: action.payload};

        case ReportActionType.GET_REPORT_BY_MEMBER_SUCCESS:
            return {...state, ...action.payload, errors: {}};
        case ReportActionType.GET_REPORT_BY_MEMBER_FAIL:
            return {...state, errors: action.payload};

        default:
            return {...state};
    }
};

export default ReportReducer;