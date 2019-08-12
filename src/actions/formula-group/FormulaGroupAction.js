import { FormulaGroupActionType } from 'my-constants/action-types'
import FormulaGroupService from 'my-services/formula-group/FormulaGroupService'
import { Helpers } from 'my-utils'
import _get from "lodash/get";

export const getFormulaGroup = () => {
    return (dispatch) => {
        return FormulaGroupService.getFormulaGroup().then(res => {
            if(res.status){
                var formulaGroupList = res.res.data.List;
                var bankerList = res.res.data.bankerList;
                dispatch({
                    type: FormulaGroupActionType.GET_FORMULA_GROUP,
                    formulaGroupList: formulaGroupList,
                    bankerList: bankerList
                })
            }
        })
    }
}

export const delFormulaGroup = (payload, isInitial = false) => {
    return (dispatch) => {
        if (!isInitial){
            dispatch({
                type: FormulaGroupActionType.DEL_FORMULA_GROUP,
                isDeleteLoading: true
            });
        }
        return FormulaGroupService.delFormulaGroup(payload).then( res => {

            dispatch({
                type: FormulaGroupActionType.DEL_FORMULA_GROUP,
                isDeleteLoading: false
            })
        })
    }
}


export const delFormulaGroupDetail = (payload, isInitial = false) => {
    return (dispatch) => {
        if (!isInitial){
            dispatch({
                type: FormulaGroupActionType.DEL_FORMULA_GROUP_DETAIL,
                isDeleteLoading: true
            });
        }
        return FormulaGroupService.delFormulaGroupDetail(payload).then(res => {

            dispatch({
                type: FormulaGroupActionType.DEL_FORMULA_GROUP_DETAIL,
                isDeleteLoading: false
            })
        })
    }
}

export const initFormulaGroup = () => {
    return (dispatch) => {
        return FormulaGroupService.getInitForm().then(res => {
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
        return FormulaGroupService.getFormulaGroupDetail().then(res => {
            if (res.status) {
                dispatch({
                    type: FormulaGroupActionType.FORMULA_GROUP_INIT_FORMULA_GROUP_DETAIL,
                    initFormData: res.res.data
                });
            }
        })
    }
}

export const initFormulaList = (banker_id, isInitial = false) => {
    return (dispatch) => {
        if(!isInitial){
            dispatch({
                type: FormulaGroupActionType.FORMULA_GROUP_INIT_FORMULA_LIST,
                isFetching: true,
            })
        }
        FormulaGroupService.loadFormulaList(banker_id).then(res => {
            if (res.status) {
                dispatch({
                    type: FormulaGroupActionType.FORMULA_GROUP_INIT_FORMULA_LIST,
                    initFormData: res.res.data,
                    isFetching: false
                });
            } else {
                dispatch({
                    type: FormulaGroupActionType.FORMULA_GROUP_INIT_FORMULA_LIST_FAIL,
                    payload: {
                        status: false,
                        error_description: _get(res, 'res.data.message', '')
                    },
                    isFetching: false
                })
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

export const toggleModalFormulaGroup = () => {
    return (dispatch) => {
        dispatch({
            type: FormulaGroupActionType.FORMULA_GROUP_TOGGLE_MODAL_FORM,
        })
    }
};


export const saveFormulaGroupAssign = (payload) => {
    return (dispatch) => {
        return FormulaGroupService.saveFormulaGroup(payload).then( async res => {
            dispatch({
                type: FormulaGroupActionType.FORMULA_GROUP_SAVE_FORM_ASSIGN,
                formAssignSaveStatus: res.status,
                formAssignSaveResponse: res.res
            })
            //Clear Message
            await Helpers.sleep(3000)
            dispatch(resetFormAssignSaveResponse())
        })
    }
};



export const saveFormulaGroupDetail = (payload) => {
    return (dispatch) => {
        return FormulaGroupService.saveFormulaGroupDetail(payload).then(async res => {
            dispatch({
                type: FormulaGroupActionType.FORMULA_GROUP_SAVE_FORM,
                formSaveStatus: res.status,
                formSaveResponse: res.res
            })
            //Clear Message
            await Helpers.sleep(3000)
            dispatch(resetFormSaveResponse())
        })
    }
};


export const resetFormAssignSaveResponse = (params) => {
    return (dispatch) => {
        dispatch({
            type: FormulaGroupActionType.FORMULA_GROUP_RESET_FORM_ASSIGN_RESPONSE,
        });
    }
}



export const resetFormSaveResponse = (params) => {
    return (dispatch) => {
        dispatch({
            type: FormulaGroupActionType.FORMULA_GROUP_RESET_FORM_RESPONSE,
        });
    }
}


export const toggleModalDeleteFormulaByFormulaGroup = (params) => {
    return (dispatch) => {
        dispatch({
            type: FormulaGroupActionType.FORMULA_GROUP_TOGGLE_MODAL_DELETE_FORMULA,
            paramsDeleteFormula: params
        });
    }
}

export const toggleModalEditFormulaGroup = (params) => {
    return (dispatch) => {
        dispatch({
            type: FormulaGroupActionType.FORMULA_GROUP_TOGGLE_MODAL_EDIT_FORMULA,
        })
    }
}

