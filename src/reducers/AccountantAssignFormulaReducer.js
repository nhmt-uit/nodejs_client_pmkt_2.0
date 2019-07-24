import { AccountantAssignFormulaActionType } from 'my-constants/action-types'

let defaultState = {
	optAccount: [],
	optMember: [],
	optFormula: [],

	// Handle Form Assign
	formSaveStatus: null,
	formSaveResponse: {},

	isFetchingInitMember: false,
	isFetchingInitAccount: false,

	// Handle list formula by account
	selectedAccountId: null,
	listFormulaDetail: [],
	isOpenModalDeleteFormulaByAccount: false,
	paramsDeleteFormulaByAccount: {}

}

export const AccountantAssignFormulaReducer = (state = defaultState, action) => {
	switch(action.type){
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_RESET_DATA_ACCOUNT:
			return {...defaultState}
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_DATA_ACCOUNT:
			return {...state, isFetchingInitAccount: true}
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_DATA_ACCOUNT_SUCCESS:
			return {...state, isFetchingInitAccount: false, optAccount: action.optAccount,}
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_DATA_MEMBER:
			return {...state, isFetchingInitMember: true, }
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_DATA_MEMBER_SUCCESS:
			return {...state, optMember: action.optMember, isFetchingInitMember: false, }
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_DATA_FORMULA:
			return {...state, optFormula: action.optFormula}
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_SAVE_DATA_FORMULA:
			return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse}
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_RESET_FORM_RESPONSE_FORMULA:
			return {...state, formSaveStatus: null, formSaveResponse: {}}
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_LIST_DATA_BY_ACCOUNT:
			return {...state, selectedAccountId: action.selectedAccountId, listFormulaDetail: action.listFormulaDetail}
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_TOGGLE_MODAL_DELETE_FORMULA:
			return {...state, isOpenModalDeleteFormulaByAccount: !state.isOpenModalDeleteFormulaByAccount, paramsDeleteFormulaByAccount: action.paramsDeleteFormulaByAccount}
		default:
			return {...state}
	}
}


export default AccountantAssignFormulaReducer;