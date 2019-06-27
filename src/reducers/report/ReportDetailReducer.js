import {ReportDetailActionType} from 'my-constants/action-types';

let defaultState = {
    payload: {},
}

const ReportDetailReducer = (state = defaultState, action) => {

    switch (action.type) {
        case ReportDetailActionType.GET_REPORT_DETAIL:
            return {...state, payload: action.payload};
        default:
            return {...state};
    }
}

export default ReportDetailReducer