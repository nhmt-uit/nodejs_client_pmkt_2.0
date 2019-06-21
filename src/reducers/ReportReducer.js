import { ReportActionType } from 'my-constants/action-types';

let defaultState = {
    errors: {},
    msg: {},
    cyclePage: {},
    isFetching: false,
};

const ReportReducer = (state = defaultState, action) => {
    switch(action.type){
        case ReportActionType.GET_CYCLE_PAGE:
            return {...state, isFetching: false};
        case ReportActionType.GET_CYCLE_PAGE_SUCCESS:
            return {...state, cyclePage: action.payload, errors: {}, isFetching: false};
        case ReportActionType.GET_CYCLE_PAGE_FAIL:
            return {...state, errors: action.payload, isFetching: false};

        default:
            return {...state};
    }
};

export default ReportReducer;