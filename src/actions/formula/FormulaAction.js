import { FormulaActionType } from 'my-constants/action-types'
import MemberService from 'my-services/member/MemberService'


export const resetStoreFormula = () => {
    return (dispatch) => {
        dispatch({
            type: FormulaActionType.FORMULA_RESET_STORE,
        })
    }
};

export const toggleModalFormula = () => {
    return (dispatch) => {
        dispatch({
            type: FormulaActionType.FORMULA_TOGGLE_MODAL_FORM,
        })
    }
};


export const saveFormula = (payload) => {
    return (dispatch) => {
        MemberService.createMember(payload).then(res => {
            dispatch({
                type: FormulaActionType.FORMULA_SAVE_FORM,
                formSaveStatus: res.status,
                formSaveResponse: res.res
            })
        })
    }
};