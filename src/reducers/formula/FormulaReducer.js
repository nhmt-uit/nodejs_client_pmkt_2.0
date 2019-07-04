import { FormulaActionType } from 'my-constants/action-types';

let defaultState = {
	initFormData: {},
	optBanker: [],
    optFormulaType: [],
    optCurrency: [],
    
    //Handle Modal Form Member
    isOpenModal: false,

    //Handel Save Form
	formSaveStatus: null,
	formSaveResponse: {},
}

const FormulaReducer = (state = defaultState, action) => {

    switch (action.type) {
        case FormulaActionType.FORMULA_RESET_STORE:
            return {...defaultState}
        case FormulaActionType.GET_MEMBER:
            return {...state, member: action.payload};
        case FormulaActionType.FORMULA_INIT_FORM_DATA:
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
        case FormulaActionType.FORMULA_TOGGLE_MODAL_FORM:
            //Reset Store When Modal Close
			if (!state.isOpenModal === false) return {...defaultState}
            return {...state, isOpenModal: !state.isOpenModal};
        case FormulaActionType.FORMULA_SAVE_FORM:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse}
        default:
            return {...state};
    }
}

export default FormulaReducer