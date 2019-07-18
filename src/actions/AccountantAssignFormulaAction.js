import { isEmpty as _isEmpty } from 'lodash'

import { AccountantAssignFormulaActionType } from 'my-constants/action-types';
import { AccountService } from 'my-services/account'
import { MemberService } from 'my-services/member'
import { FormulaService } from 'my-services/formula'
import { FormulaGroupService } from 'my-services/formula-group'
import { Helpers } from 'my-utils'


export const resetData = params => {
    return (dispatch) => {
        dispatch({
            type: AccountantAssignFormulaActionType.ASSIGN_FORMULA_RESET_DATA_ACCOUNT,
        });
    }
}

export const initAccount = (params) => {
    return (dispatch) => {
        AccountService.getAccount().then(res => {
            if (res.status) {
                const optAccount = res.res.data.bankerAccountMap
                // Dispatch data to reducer
                dispatch({
                    type: AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_DATA_ACCOUNT,
                    optAccount: optAccount
                });
            }
        })
    }
}

export const initMember = (params) => {
    return (dispatch) => {
        MemberService.getMember().then(res => {
            if (res.status) {
                const optMember = res.res.data.List.map(item => {
                    return {value: item.id, label: item.fullname.toUpperCase()}
                })

                // Dispatch data to reducer
                dispatch({
                    type: AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_DATA_MEMBER,
                    optMember: optMember
                });
            }
        })
    }
}

export const initFormula = (params) => {
    return (dispatch) => {
        return FormulaService.getFormula().then(res => {
            if (res.status) {
                let listData = res.res.data.List
                const optFormula = listData.map(item => {
                    return {value: item.id, label: item.tenct.toUpperCase(), bankerId: item.banker_id}
                })

                // Dispatch data to reducer
                dispatch({
                    type: AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_DATA_FORMULA,
                    optFormula: optFormula,
                });
            }
        })
    }
}

export const initFormulaGroup = (params) => {
   
    return (dispatch) => {
        FormulaGroupService.getFormulaGroup().then(res => {
            if (res.status) {
                let listData = res.res.data.List
                const optFormula = listData.map(item => {
                    let bankerId = !_isEmpty(item.child) ? item.child[0].banker.id : null
                    let bankerIds = !_isEmpty(item.child) ? item.child.map(child => child.banker.id) : null
                    return {value: item.id, label: item.name.toUpperCase(), bankerId: bankerId, bankerIds: bankerIds}
                })

                // Dispatch data to reducer
                dispatch({
                    type: AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_DATA_FORMULA,
                    optFormula: optFormula,
                });
            }
        })
    }
}

export const onChangeFormulaType = (type) => {
    return (dispatch) => {
        if (type === 1) dispatch(initFormula())
        if (type === 2) dispatch(initFormulaGroup())
    }
}

export const saveFormulaAccount = (params) => {
    return (dispatch) => {
        FormulaService.saveFormulaAccount(params).then(async res => {
            // Dispatch data to reducer
            dispatch({
                type: AccountantAssignFormulaActionType.ASSIGN_FORMULA_SAVE_DATA_FORMULA,
                formSaveStatus: res.status,
                formSaveResponse: res.res.data,
            });

            //Clear Message
            await Helpers.sleep(3000)
            dispatch(resetFormSaveResponse())
        })
    }
}

export const resetFormSaveResponse = (params) => {
    return (dispatch) => {
        dispatch({
            type: AccountantAssignFormulaActionType.ASSIGN_FORMULA_RESET_FORM_RESPONSE_FORMULA,
        });
    }
}


export const initFormulaByAccount = account_id => {
    return (dispatch) => {
        FormulaService.getFormulaByAccountId(account_id).then(res => {
            if (res.status) {
                // Dispatch data to reducer
                dispatch({
                    type: AccountantAssignFormulaActionType.ASSIGN_FORMULA_INIT_LIST_DATA_BY_ACCOUNT,
                    selectedAccountId: account_id,
                    listFormulaDetail: res.res.data.data,
                });
            }
        })
    }
    
}


export const toggleModalDeleteFormulaByAccount = params => {
    return (dispatch) => {
        dispatch({
            type: AccountantAssignFormulaActionType.ASSIGN_FORMULA_TOGGLE_MODAL_DELETE_FORMULA,
            paramsDeleteFormulaByAccount: params,
        });
    }
}

