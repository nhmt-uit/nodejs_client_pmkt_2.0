import { FormulaActionType } from 'my-constants/action-types'

const defaultState = {
    List: [],
    banker: {},
    isFetching: false,
    error: null,
};

export const FormulaReducer = (state = defaultState, action) => {
	switch(action.type){
		case FormulaActionType.GET_FORMULA:
			return {...state, isFetching: true, error: null}
		case FormulaActionType.GET_FORMULA_SUCCESS:
			return {...state, ...action.payload, isFetching: false, error: null}
		case FormulaActionType.GET_FORMULA_FAIL:
            return {...state, isFetching: false, error: action.payload}
            
		default:
			return {...state}
	}
}

export default FormulaReducer;