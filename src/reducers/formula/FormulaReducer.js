import { FormulaActionType } from 'my-constants/action-types';

let defaultState = {
    //Handle Modal Form Member
    isOpenModal: false,

    //Handel Save Form
	formSaveStatus: null,
    formSaveResponse: {},
    List: [],
    banker: {},
    isFetching: false,
    error: null,
}

const FormulaReducer = (state = defaultState, action) => {

    switch (action.type) {
        case FormulaActionType.FORMULA_RESET_STORE:
            return {...defaultState}
        case FormulaActionType.GET_MEMBER:
            return {...state, member: action.payload};
        case FormulaActionType.FORMULA_TOGGLE_MODAL_FORM:
            //Reset Store When Modal Close
			if (!state.isOpenModal === false) return {...defaultState}
            return {...state, isOpenModal: !state.isOpenModal};
        case FormulaActionType.FORMULA_SAVE_FORM:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse}

        case FormulaActionType.GET_FORMULA:
            return {...state, isFetching: true, error: null}
        case FormulaActionType.GET_FORMULA_SUCCESS:
            return {...state, ...action.payload, isFetching: false, error: null}
        case FormulaActionType.GET_FORMULA_FAIL:
            return {...state, isFetching: false, error: action.payload}
            
        default:
            return {...state};
    }
}

export default FormulaReducer