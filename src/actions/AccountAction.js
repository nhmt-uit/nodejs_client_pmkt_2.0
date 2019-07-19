import {get as _get} from 'lodash'
import { AccountActionType } from 'my-constants/action-types';
import { AccountService } from 'my-services/account'
import { Helpers } from 'my-utils'
import {BookService} from 'my-services/book';

export const getAccount = () => {
    return dispatch => {
        dispatch({
            type: AccountActionType.GET_ACCOUNT
        });

        return AccountService.getAccount()
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: AccountActionType.GET_ACCOUNT_SUCCESS,
                        payload: _get(res, 'res.data.List', []),
                    });
                } else {
                    dispatch({
                        type: AccountActionType.GET_ACCOUNT_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            }).catch(e => {
                dispatch({
                    type: AccountActionType.GET_ACCOUNT_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            });
    }
};

export const requestInitFormData = (bankerAccount) => {
    return (dispatch) => {
        AccountService.initForm(_get(bankerAccount, 'id')).then(res => {
            if (res.status) {
                dispatch({
                    type: AccountActionType.ACCOUNT_INIT_FORM_DATA,
                    initFormData: res.res.data,
                    bankerAccount: bankerAccount
                });
            }
        })
    }
};

export const resetStoreAccount = () => {
    return (dispatch) => {
        dispatch({
            type: AccountActionType.ACCOUNT_RESET_STORE,
        })
    }
};

export const toggleModalAccount = (params) => {
    return (dispatch) => {
        dispatch({
            type: AccountActionType.ACCOUNT_TOGGLE_MODAL_FORM,
            selectedItem: _get(params, 'selectedItem', {}),
            isModalLinkFormula: _get(params, 'isModalLinkFormula', false),
        })
    }
};

export const toggleModalDeleteAccount = (params) => {
    return (dispatch) => {
        dispatch({
            type: AccountActionType.ACCOUNT_TOGGLE_MODAL_DELETE,
            selectedItem: _get(params, 'selectedItem', {})
        })
    }
};


export const saveAccount = (payload) => {
    return (dispatch) => {
        dispatch({
            type: AccountActionType.ACCOUNT_SAVE_FORM_DATA,
            isInitSaveFormData: true
        })
        AccountService.saveAccount(payload).then(async res => {
            dispatch({
                type: AccountActionType.ACCOUNT_SAVE_FORM_DATA,
                formSaveStatus: res.status,
                formSaveResponse: res.res,
                isInitSaveFormData: false
            })

            //Clear Message
            await Helpers.sleep(3000)
            dispatch(resetFormSaveResponse())
        })
    }
};

export const deleteAccount = (payload) => {
    return (dispatch) => {
        AccountService.deleteAccount(payload.id).then(res => {
            dispatch({
                type: AccountActionType.ACCOUNT_DELETE_ITEM,
                formDeleteStatus: res.status,
                formDeleteResponse: res.res
            })
        })
    }
};

export const resetFormSaveResponse = (params) => {
    return (dispatch) => {
        dispatch({
            type: AccountActionType.ACCOUNT_RESET_FORM_RESPONSE,
        });
    }
};

export const getTab = () => {
    return (dispatch) => {
        return BookService.getTab().then(res => {
            if (res.status) {
                dispatch({
                    type: AccountActionType.GET_TAB_SUCCESS,
                    payload: _get(res, 'res.data', [])
                });
            } else {
                dispatch({
                    type: AccountActionType.GET_TAB_FAIL,
                    payload: {
                        status: false,
                        error_description: _get(res, 'res.data.message', '')
                    },
                });
            }
        }).catch(e => {
            dispatch({
                type: AccountActionType.GET_TAB_FAIL,
                payload: _get(e, 'response.data', {
                    status: false,
                    error_description: e.stack,
                }),
            });
        });
    }
};