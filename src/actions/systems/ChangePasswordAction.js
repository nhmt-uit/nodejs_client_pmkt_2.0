import { get as _get } from 'lodash';

import { ChangePasswordActionType } from 'my-constants/action-types';
import { ChangePasswordService } from 'my-services/systems';

export const savePassword = (password) => {
    return (dispatch) => {
        return ChangePasswordService.savePassword(password).then(res => {
            if (_get(res, 'status',false)) {
                dispatch({
                    type: ChangePasswordActionType.CHANGE_PASSWORD_SUCCESS,
                    payload: res
                });
            } else {
                dispatch({
                    type: ChangePasswordActionType.CHANGE_PASSWORD_FAIL,
                    payload: {
                        errors: {
                            status: true,
                            error_description: _get(res, 'res.data.message', 'Change password fail'),
                        },
                    },
                });
            }

        }).catch (error => {
            dispatch({
                type: ChangePasswordActionType.CHANGE_PASSWORD_FAIL,
                payload: {
                    errors: {
                        status: true,
                        error_description: _get(error, 'response.data.error_description', 'Change password fail'),
                    },
                }
            })
        })
    }
};

export const savePassword2 = (password) => {
    return (dispatch) => {console.log(ChangePasswordActionType.CHANGE_PASSWORD2_FAIL);
        return ChangePasswordService.savePassword2(password).then(res => {
            if (_get(res, 'status',false)) {
                dispatch({
                    type: ChangePasswordActionType.CHANGE_PASSWORD2_SUCCESS,
                    payload: res
                });
            } else {
                dispatch({
                    type: ChangePasswordActionType.CHANGE_PASSWORD2_FAIL,
                    payload: {
                        errors: {
                            status: true,
                            error_description: _get(res, 'res.data.message', 'Chang password fail'),
                        },
                    },
                });
            }
        }).catch (error => {
            dispatch({
                type: ChangePasswordActionType.CHANGE_PASSWORD2_FAIL,
                payload: {
                    errors: {
                        status: true,
                        error_description: _get(error, 'response.data.error_description', 'Change password fail'),
                    },
                }
            })
        })
    }
};


export const toggleNotify = value => {
    return (dispatch) => {
        dispatch({
            type: ChangePasswordActionType.CHANGE_PASSWORD_TOGGLE_NOTIFY,
            isShowNotify: value
        });
    }
};