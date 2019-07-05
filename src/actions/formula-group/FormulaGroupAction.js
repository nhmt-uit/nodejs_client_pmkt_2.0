import { FormulaGroupActionType } from 'my-constants/action-types'
import FormulaGroupService from 'my-services/formula-group/FormulaGroupService'

export const initFormulaGroup = () => {
    return (dispatch) => {
        FormulaGroupService.getInitForm().then(res => {
            if (res.status) {
                dispatch({
                    type: FormulaGroupActionType.FORMULA_GROUP_INIT_FORMULA_GROUP,
                    initFormData: res.res.data
                });
            }
        })
    }
}

export const initFormulaGroupDetail = () => {
    return (dispatch) => {
        FormulaGroupService.getFormulaGroupDetail().then(res => {
            if (res.status) {
                dispatch({
                    type: FormulaGroupActionType.FORMULA_GROUP_INIT_FORMULA_GROUP_DETAIL,
                    initFormData: res.res.data
                });
            }
        })
    }
}

export const initFormulaList = (banker_id) => {
    return (dispatch) => {
        FormulaGroupService.loadFormulaList(banker_id).then(res => {
            if (res.status) {
                dispatch({
                    type: FormulaGroupActionType.FORMULA_GROUP_INIT_FORMULA_LIST,
                    initFormData: res.res.data
                });
            }
        })
    }
}

export const resetStoreFormulaGroup = () => {
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