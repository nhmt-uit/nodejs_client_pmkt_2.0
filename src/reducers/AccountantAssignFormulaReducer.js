import uuidv4 from 'uuid/v4'
import { map as _map, isEmpty as _isEmpty, get as _get, uniq as _uniq, difference as _difference, cloneDeep as _cloneDeep, has as _has } from 'lodash'

import { AccountantAssignFormulaActionType } from 'my-constants/action-types'

let defaultState = {
	optAccount: [],
	optMember: [],
	optFormula: [],

	// Handle Form Assign
	formSaveStatus: null,
	formSaveResponse: {},

	// Handle list formula by account
	listFormulaDetail: [],
}

export const AccountantAssignFormulaReducer = (state = defaultState, action) => {
	switch(action.type){
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
			return {...state, listFormulaDetail: action.listFormulaDetail}
		default:
			return {...state}
	}
}


export default AccountantAssignFormulaReducer;