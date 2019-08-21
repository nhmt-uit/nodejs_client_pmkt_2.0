import { AccountSubActionType } from 'my-constants/action-types';

let defaultState = {
    isOpenEditModal: false,
    isOpenModal: false,
    memberSub: {},
    suffixesMember: {},
    formSaveStatus: null,
    formSaveResponse: {},
    isDeleteLoading: false,
}

const AccountSubReducer = (state = defaultState, action) => {

    switch (action.type) {
        case AccountSubActionType.GET_MEMBER_SUB:
            return {...state, memberSub: action.memberSub};
        case AccountSubActionType.GET_SUFFIXES_MEMBER:
            return {...state, suffixesMember: action.suffixesMember}
        case AccountSubActionType.DEL_MEMBER_SUB:
            return {...state, isDeleteLoading: action.isDeleteLoading};
        case AccountSubActionType.CREATE_MEMBER_SUB:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse};
        case AccountSubActionType.RESET_FORM_SAVE_ACCOUNT_SUB:
            return {...state, formSaveStatus: null, formSaveResponse: {}};
        case AccountSubActionType.MEMBER_SUB_TOGGLE_MODAL_FORM:
            //Reset Store When Modal Close
            if (state.isOpenModal === true){
                var isOpenModal = !state.isOpenModal
                return {...state, isOpenModal: isOpenModal, formSaveStatus: null};
            }
            return {...state, isOpenModal: !state.isOpenModal};
        case AccountSubActionType.MEMBER_SUB_TOGGLE_MODAL_EDIT_FORM:
            if (state.isOpenEditModal === true){
                var isOpenEditModal = !state.isOpenEditModal
                return {...state, isOpenEditModal: isOpenEditModal, formSaveStatus: null};
            }
            return {...state, isOpenEditModal: !state.isOpenEditModal};
        default:
            return {...state};
    }
}

export default AccountSubReducer