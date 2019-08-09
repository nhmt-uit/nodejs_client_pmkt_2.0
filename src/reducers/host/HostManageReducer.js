import { HostManageActionType } from 'my-constants/action-types'

let defaultState = {
    bankerList: {},
    optBanker: {},
    dataList: {},
    formSaveStatus: null,
    formSaveResponse: {},
}

const HostManageReducer = (state = defaultState, action) => {
    switch (action.type) {
        case HostManageActionType.GET_HOST_MANAGE:
            return {...state, bankerList: action.bankerList, dataList: action.dataList, optBanker: action.optBanker};
        case HostManageActionType.DEL_HOST_MANAGE:
            return {...state};
        case HostManageActionType.SAVE_HOST_MANAGE:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse};
        case HostManageActionType.RESET_FORM_SAVE_RESPONSE:
            return {...state, formSaveStatus: null, formSaveResponse: {} };
        default:
            return {...state}
    }
}

export default HostManageReducer