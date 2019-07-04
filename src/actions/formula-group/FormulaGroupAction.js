import { FormulaGroupActionType } from 'my-constants/action-types'
import FormulaGroupService from 'my-services/formula-group/FormulaGroupService'

export const requestInitFormData = () => {
    return (dispatch) => {
        FormulaGroupService.getInitForm().then(res => {
            if (res.status) {
                dispatch({
                    type: FormulaGroupActionType.FORMULA_GROUP_INIT_FORM_DATA,
                    initFormData: res.res.data
                });
            }
        })
    }
}

export const resetStoreFormula = () => {
    return (dispatch) => {
        dispatch({
            type: FormulaGroupActionType.FORMULA_GROUP_RESET_STORE,
        })
    }
};

export const toggleModalAssignFormulaGroup = () => {
    return (dispatch) => {
        dispatch({
            type: FormulaGroupActionType.FORMULA_GROUP_TOGGLE_MODAL_FORM_ASSIGN,
        })
    }
};

export const toggleModalFormula = () => {
    return (dispatch) => {
        dispatch({
            type: FormulaGroupActionType.FORMULA_GROUP_TOGGLE_MODAL_FORM,
        })
    }
};


export const saveFormula = (payload) => {
    return (dispatch) => {
        FormulaGroupService.saveFormula(payload).then(res => {
            dispatch({
                type: FormulaGroupActionType.FORMULA_GROUP_SAVE_FORM,
                formSaveStatus: res.status,
                formSaveResponse: res.res
            })
        })
    }
};