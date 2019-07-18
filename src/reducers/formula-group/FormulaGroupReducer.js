import { FormulaGroupActionType } from 'my-constants/action-types';

let defaultState = {
	optFormulaGroup: [],
	optBanker: [],
    optFormula: [],

    formulaGroupList: [],
    bankerList: [],

    // Handle Formua List
    optFormulaPatternList: [],
    formulaPatternList: [],

    
    //Handle Modal Form Formula Group
    isOpenModal: false,
    //Handle Save Form Assign
	formSaveStatus: null,
	formSaveResponse: {},
    
    //Handle Modal Form Assign Formula Group - Formula
    isOpenModalAssign: false,
    

    //Handle Save Form Assign
	formAssignSaveStatus: null,
    formAssignSaveResponse: {},
    
    // Handle Modal Delete Formula
    isOpenModalDeleteFormula: false,
	paramsDeleteFormula: {},

	// Handle Modal Edit Formula
    isOpenModalEditFormula: false,
}

const FormulaGroupReducer = (state = defaultState, action) => {

    switch (action.type) {
        case FormulaGroupActionType.GET_FORMULA_GROUP:
            return {...state, formulaGroupList: action.formulaGroupList, bankerList: action.bankerList}
        case FormulaGroupActionType.DEL_FORMULA_GROUP:
            return {...state};
        case FormulaGroupActionType.DEL_FORMULA_GROUP_DETAIL:
            return {...state,};

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
            if (!state.isOpenModalAssign === false) return {...state, isOpenModalAssign: false, formAssignFormulaGroupSaveStatus: null, formAssignFormulaGroupSaveResponse: {} }
            return {...state, isOpenModalAssign: !state.isOpenModalAssign};
        }
        case FormulaGroupActionType.FORMULA_GROUP_TOGGLE_MODAL_EDIT_FORMULA:
            if(state.isOpenModalEditFormula === true){
                var isOpenModalEditFormula = !state.isOpenModalEditFormula
                return {...state, isOpenModalEditFormula: isOpenModalEditFormula, formSaveStatus: null, formSaveResponse: {}, formAssignFormulaGroupSaveStatus: null, formAssignFormulaGroupSaveResponse: {}}
            }
            return {...state, isOpenModalEditFormula: !state.isOpenModalEditFormula}

        case FormulaGroupActionType.FORMULA_GROUP_SAVE_FORM_ASSIGN: {
            return {...state, formAssignSaveStatus: action.formAssignSaveStatus, formAssignSaveResponse: action.formAssignSaveResponse}
        }
        case FormulaGroupActionType.FORMULA_GROUP_RESET_FORM_ASSIGN_RESPONSE: {
            return {...state, formAssignSaveStatus: null, formAssignSaveResponse: {}}
        }
        case FormulaGroupActionType.FORMULA_GROUP_TOGGLE_MODAL_FORM: {
            //Reset Store When Modal Close
            if (!state.isOpenModal === false) return {...state, isOpenModal: false, formSaveStatus: null, formSaveResponse: {} }
            return {...state, isOpenModal: !state.isOpenModal};
        }
        case FormulaGroupActionType.FORMULA_GROUP_SAVE_FORM: {
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse}
        }
        case FormulaGroupActionType.FORMULA_GROUP_RESET_FORM_RESPONSE: {
            return {...state, formSaveStatus: null, formSaveResponse: {}}
        }
        case FormulaGroupActionType.FORMULA_GROUP_TOGGLE_MODAL_DELETE_FORMULA: {
            // Handle Modal Delete Formula
            return {...state, isOpenModalDeleteFormula: !state.isOpenModalDeleteFormula, paramsDeleteFormula: action.paramsDeleteFormula}
        }
        default:
            return {...state};
    }
}

export default FormulaGroupReducer