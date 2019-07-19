import { AccountantAssignFormulaActionType } from 'my-constants/action-types'

let defaultState = {
	optAccount: [],
	optMember: [],
	optFormula: [],

	// Handle Form Assign
	formSaveStatus: null,
	formSaveResponse: {},

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
			return {...state, optAccount: action.optAccount}
		case AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_DATA_MEMBER:
			return {...state, optMember: action.optMember}
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