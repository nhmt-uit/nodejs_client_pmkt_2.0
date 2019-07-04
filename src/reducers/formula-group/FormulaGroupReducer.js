import { FormulaGroupActionType } from 'my-constants/action-types';

let defaultState = {
	initFormData: {},
	optBanker: [],
    optFormulaType: [],
    optCurrency: [],
    
    //Handle Modal Form Member
    isOpenModalAssign: false,

    //Handel Save Form Assign
	formSaveStatus: null,
	formSaveResponse: {},
}

const FormulaGroupReducer = (state = defaultState, action) => {

    switch (action.type) {
        case FormulaGroupActionType.FORMULA_RESET_STORE:
            return {...defaultState}
        case FormulaGroupActionType.GET_MEMBER:
            return {...state, member: action.payload};
        case FormulaGroupActionType.FORMULA_INIT_FORM_DATA:
            if (action.initFormData) {
                //Map Opt Banker
                let newOptBanker = action.initFormData.bankerList.map(item => {
                    item.value = item.id
                    item.label = item.name.toUpperCase()
                    return item
                })
                //Map Opt Formula Type
                let newOptFormulaType  = []
                for (let x in action.initFormData.formatList) {
                    newOptFormulaType = newOptFormulaType.concat(action.initFormData.formatList[x].map(item => {
                        item.value = item.id
                        item.label = item.name.toUpperCase()
                        return item
                    }))
                }
                //Map Opt Currency
                let newOptCurrency = action.initFormData.currencyList.map(item => {
                    item.value = item.id
                    item.label = item.name.toUpperCase()
                    return item
                })

                return {...state, initFormData: action.initFormData, optBanker: newOptBanker, optFormulaType: newOptFormulaType, optCurrency: newOptCurrency}
            }
            return {...state}
        case FormulaGroupActionType.FORMULA_GROUP_TOGGLE_MODAL_FORM_ASSIGN:
            //Reset Store When Modal Close
            if (!state.isOpenModalAssign === false) return {...defaultState}
            return {...state, isOpenModalAssign: !state.isOpenModalAssign};
        case FormulaGroupActionType.FORMULA_TOGGLE_MODAL_FORM:
            //Reset Store When Modal Close
			if (!state.isOpenModal === false) return {...defaultState}
            return {...state, isOpenModal: !state.isOpenModal};
        case FormulaGroupActionType.FORMULA_SAVE_FORM:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse}
        default:
            return {...state};
    }
}

export default FormulaGroupReducer