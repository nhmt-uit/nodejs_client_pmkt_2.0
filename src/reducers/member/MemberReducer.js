import { MemberActionType } from 'my-constants/action-types';

let defaultState = {
    member: {},

    //Handle Modal Form Member
    isOpenModal: false,
    isModalProcessSuccess: false,

    //Handel Save Form
	formSaveStatus: null,
	formSaveResponse: {},
}

const MemberReducer = (state = defaultState, action) => {

    switch (action.type) {
        case MemberActionType.MEMBER_RESET_STORE:
            return {...defaultState}
        case MemberActionType.GET_MEMBER:
            return {...state, member: action.payload};
        case MemberActionType.MEMBER_TOGGLE_MODAL_FORM:
            return {...state, isOpenModal: !state.isOpenModal, formSaveStatus: null, formSaveResponse: {}};
        case MemberActionType.MEMBER_SAVE_FORM:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse}
        default:
            return {...state};
    }
}

export default MemberReducer