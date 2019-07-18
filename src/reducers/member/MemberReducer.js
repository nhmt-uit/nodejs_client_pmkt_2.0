import { isEmpty as _isEmpty } from 'lodash'
import { MemberActionType } from 'my-constants/action-types';

let defaultState = {
    //DetectLoading
    isInitListMember: false,
    isInitListMemberDetail: false,
    isInitDeleteMember: false,
    isInitDeleteMemberDetail: false,
    //
    member: {},
    optMember: [],

    // Handle List
    selectedItemList: {},

    // Handle List Formula By Banker
    bankerList: [],
    formulaByMemberList: [],

    //Handle Modal Form Member
    isOpenModal: false,
    selectedItem: {},
    
    //Handle Modal Form Member
    typeModal: 'single',
    isOpenModalDelete: false,
	formDeleteStatus: null,
    formDeleteResponse: null,
    
    //Handle Modal Form Member
    isOpenModalDeleteDetail: false,
	formDeleteDetailStatus: null,
	formDeleteDetailResponse: null,

    //Handel Save Form
	formSaveStatus: null,
	formSaveResponse: {},
}

const MemberReducer = (state = defaultState, action) => {

    switch (action.type) {
        case MemberActionType.MEMBER_RESET_STORE:
            return {...defaultState}
        case MemberActionType.GET_MEMBER:
            if(!_isEmpty(action.payload)) {
                return {...state, isInitListMember: action.isInitListMember, member: action.payload, optMember: action.optMember};
            }
            return {...state, isInitListMember: action.isInitListMember}
        case MemberActionType.MEMBER_TOGGLE_MODAL_FORM:
            //Reset Store When Modal Close
			if (!state.isOpenModal === false) return {...state, isOpenModal: false, formSaveStatus: null, formSaveResponse: {}, selectedItem: {}}
            return {...state, isOpenModal: !state.isOpenModal, selectedItem: action.selectedItem};
        case MemberActionType.MEMBER_TOGGLE_MODAL_DELETE:
            //Reset Store When Modal Close
			if (!state.isOpenModalDelete === false) return {...state, isOpenModalDelete: false, formDeleteStatus: null, formDeleteResponse: {}, selectedItem: {}}
            return {...state, isOpenModalDelete: !state.isOpenModalDelete, selectedItem: action.selectedItem};
        case MemberActionType.MEMBER_SAVE_FORM:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse}
        case MemberActionType.MEMBER_DELETE_MEMBER:
            return {...state, isInitDeleteMember: action.isInitDeleteMember, formDeleteStatus: action.formDeleteStatus, formDeleteResponse: action.formDeleteResponse}
        case MemberActionType.GET_FORMULA_BY_MEMBER:
            if(!_isEmpty(action.payload)) {
                let newBankerList = action.payload.listBanker
                let newFormulaByMemberList = action.payload.memberDetail
                return {...state, isInitListMemberDetail: action.isInitListMemberDetail, bankerList: newBankerList, formulaByMemberList: newFormulaByMemberList, selectedItemList: action.selectedItemList}
            }
            return {...state, isInitListMemberDetail: action.isInitListMemberDetail}

        case MemberActionType.MEMBER_RESET_FORM_RESPONSE_FORMULA:
            return {...state, formSaveStatus: null, formSaveResponse: {}}

        case MemberActionType.MEMBER_TOGGLE_MODAL_DELETE_DETAIL:
            //Reset Store When Modal Close
            if (!state.isOpenModalDeleteDetail === false) return {...state, typeModal: 'single', isOpenModalDeleteDetail: false, formDeleteDetailStatus: null, formDeleteDetailResponse: {}, selectedItemDetail: {}}
            return {...state, typeModal: action.typeModal, isOpenModalDeleteDetail: !state.isOpenModalDeleteDetail, selectedItemDetail: action.selectedItemDetail};
        case MemberActionType.MEMBER_DELETE_MEMBER_FORMULA:
            return {...state, isInitDeleteMemberDetail: action.isInitDeleteMemberDetail, formDeleteDetailStatus: action.formDeleteDetailStatus, formDeleteDetailResponse: action.formDeleteDetailResponse}
        default:
            return {...state};
    }
}

export default MemberReducer