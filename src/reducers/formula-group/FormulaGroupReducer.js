import { FormulaGroupActionType } from 'my-constants/action-types';

let defaultState = {
	optFormulaGroup: [],
	optBanker: [],
    optFormula: [],

    // Handel Formua List
    optFormulaPatternList: [],
    formulaPatternList: [],
    
    //Handle Modal Form Member
    isOpenModalAssign: false,

    //Handel Save Form Assign
	formSaveStatus: null,
	formSaveResponse: {},
}

const FormulaGroupReducer = (state = defaultState, action) => {

    switch (action.type) {
        case FormulaGroupActionType.FORMULA_RESET_STORE: {
            return {...defaultState}
        }
        case FormulaGroupActionType.FORMULA_GROUP_INIT_FORMULA_GROUP: {
            if (action.initFormData) {
                //Map Opt Banker
                let newOptBanker = action.initFormData.bankerList.map(item => {
                    item.value = item.id
                    item.label = item.name.toUpperCase()
                    return item
                })
                //Map Opt Formula
                let newOptFormula = action.initFormData.formulaPatternList.map(item => {
                    item.value = item.id
                    item.label = item.tenct.toUpperCase()
                    return item
                })
                return {...state, optBanker: newOptBanker, optFormula: newOptFormula }
            }
            return {...state}
        }
        case FormulaGroupActionType.FORMULA_GROUP_INIT_FORMULA_GROUP_DETAIL: {
            if (action.initFormData) {
                //Map Opt Formula Group
                let newOptFormulaGroup = action.initFormData.List.map(item => {
                    item.value = item.id
                    item.label = item.name.toUpperCase()
                    return item
                })
                return {...state, optFormulaGroup: newOptFormulaGroup }
            }
            return {...state}
        }
        case FormulaGroupActionType.FORMULA_GROUP_INIT_FORMULA_LIST: {
            if (action.initFormData) {
                //Map Opt Selectable Formula
                let newOptFormulaPatternList = action.initFormData.formulaPatternListSelect.map(item => {
                    item.value = item.id
                    item.label = item.tenct.toUpperCase()
                    return item
                })
                return {...state, formulaPatternList: action.initFormData.selectedFormulaPatternList, optFormulaPatternList: newOptFormulaPatternList }
            }
            return {...state}
        }
        case FormulaGroupActionType.FORMULA_GROUP_TOGGLE_MODAL_FORM_ASSIGN: {
            //Reset Store When Modal Close
            if (!state.isOpenModalAssign === false) return {...defaultState}
            return {...state, isOpenModalAssign: !state.isOpenModalAssign};
        }
        case FormulaGroupActionType.FORMULA_TOGGLE_MODAL_FORM: {
            //Reset Store When Modal Close
			if (!state.isOpenModal === false) return {...defaultState}
            return {...state, isOpenModal: !state.isOpenModal};
        }
        case FormulaGroupActionType.FORMULA_SAVE_FORM: {
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse}
        }
        default:
            return {...state};
    }
}

export default FormulaGroupReducer