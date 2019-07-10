import { AccountSubActionType } from 'my-constants/action-types';

let defaultState = {
    isOpenModal: false,
    memberSub: {},
    suffixesMember: {},
    formSaveStatus: null,
    formSaveResponse: {},
}

const AccountSubReducer = (state = defaultState, action) => {

    switch (action.type) {
        case AccountSubActionType.GET_MEMBER_SUB:
            return {...state, memberSub: action.payload};
        case AccountSubActionType.GET_SUFFIXES_MEMBER:
            return {...state, suffixesMember: action.suffixesMember}
        case AccountSubActionType.DEL_MEMBER_SUB:
            return {...state,};
        case AccountSubActionType.CREATE_MEMBER_SUB:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse};
        case AccountSubActionType.RESET_FORM_SAVE_ACCOUNT_SUB:
            return {...state, formSaveStatus: null, formSaveResponse: {}};
        case AccountSubActionType.MEMBER_SUB_TOGGLE_MODAL_FORM:
            //Reset Store When Modal Close
            // if (!state.isOpenModal === false) return {isOpenModal: false}
            return {...state, isOpenModal: !state.isOpenModal};
        default:
            return {...state};
    }
}

export default AccountSubReducer