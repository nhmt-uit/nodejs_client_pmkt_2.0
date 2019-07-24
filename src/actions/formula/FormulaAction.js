import { FormulaActionType } from 'my-constants/action-types'

import { get as _get } from 'lodash';
import FormulaService from 'my-services/formula/FormulaService'

export const requestInitFormData = () => {
    return (dispatch) => {
        FormulaService.getInitForm().then(res => {
            if (res.status) {
                dispatch({
                    type: FormulaActionType.FORMULA_INIT_FORM_DATA,
                    initFormData: res.res.data
                });
            }
        })
    }
}

export const resetStoreFormula = () => {
    return (dispatch) => {
        dispatch({
            type: FormulaActionType.FORMULA_RESET_STORE,
        })
    }
};

export const toggleModalFormula = params => {
    return (dispatch) => {
        dispatch({
            type: FormulaActionType.FORMULA_TOGGLE_MODAL_FORM,
            selectedItem: _get(params, 'selectedItem', {}),
        })
    }
};

export const saveFormula = (payload) => {
    return (dispatch) => {
        FormulaService.saveFormula(payload).then(res => {
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

export const setFormulaSelected = formula => {
    return dispatch => dispatch({
        type: FormulaActionType.SET_FORMULA_SELECTED,
        payload: formula
    });
};

export const getLinkFormulaDetail = id => {
    return dispatch => {
        dispatch({
            type: FormulaActionType.GET_LINK_FORMULA_DETAIL,
        });

        return FormulaService.getLinkFormulaDetail(id)
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: FormulaActionType.GET_LINK_FORMULA_DETAIL_SUCCESS,
                        lstAccountDetail: _get(res, 'res.data.List.accountDetail', []),
                    });
                } else {
                    dispatch({
                        type: FormulaActionType.GET_LINK_FORMULA_DETAIL_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            }).catch(e => {
                dispatch({
                    type: FormulaActionType.GET_LINK_FORMULA_DETAIL_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            });
    }
};