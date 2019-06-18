import { get as _get } from 'lodash';

import { ChangeSecureCodeActionType } from 'my-constants/action-types';
import { ChangeSecureCodeService } from 'my-services/systems';

export const saveSecureCode = (secure) => {
    return (dispatch) => {
        return ChangeSecureCodeService.saveSecureCode(secure).then(res => {
            if (_get(res, 'status',false)) {
                dispatch({
                    type: ChangeSecureCodeActionType.CHANGE_SECURE_CODE_SUCCESS,
                    payload: res
                });
            } else {
                dispatch({
                    type: ChangeSecureCodeActionType.CHANGE_SECURE_CODE_FAIL,
                    payload: {
                        errors: {
                            status: true,
                            error_description: _get(res, 'res.data.message', 'Chang secure code fail'),
                        },
                    },
                });
            }
        }).catch (error => {
            dispatch({
                type: ChangeSecureCodeActionType.CHANGE_SECURE_CODE_FAIL,
                payload: {
                    errors: {
                        status: true,
                        error_description: _get(error, 'response.data.error_description', 'Change secure code fail'),
                    },
                }
            })
        })
    }
};

export const toggleNotify = value => {
    return (dispatch) => {
        dispatch({
            type: ChangeSecureCodeActionType.TOGGLE_NOTIFY,
            isShowNotify: value
        });
    }
};