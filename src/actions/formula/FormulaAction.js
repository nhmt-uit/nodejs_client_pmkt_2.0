import { FormulaActionType } from 'my-constants/action-types'
import MemberService from 'my-services/member/MemberService'
import { FormulaService } from 'my-services/formula';

import { get as _get } from 'lodash';


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

export const getFormula = () => {
    return (dispatch) => {
        dispatch({
            type: FormulaActionType.GET_FORMULA
        });

        return FormulaService.getFormula().then(res => {
            if (res.status) {
                dispatch({
                    type: FormulaActionType.GET_FORMULA_SUCCESS,
                    payload: _get(res, 'res.data', {})
                });
            } else {
                dispatch({
                    type: FormulaActionType.GET_FORMULA_FAIL,
                    payload: {
                        status: false,
                        error_description: _get(res, 'res.data.message', '')
                    },
                });
            }
        }).catch(e => {
            dispatch({
                type: FormulaActionType.GET_FORMULA_FAIL,
                payload: _get(e, 'response.data', {
                    status: false,
                    error_description: e.stack,
                }),
            });
        });
    }
}