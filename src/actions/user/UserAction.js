import { UserActionType } from 'my-constants/action-types'

import { get as _get } from 'lodash';
import { UserService } from 'my-services/user'

export const getUsers = () => {
    return (dispatch) => {
        dispatch({
            type: UserActionType.GET_USERS
        });

        return UserService.getUsers()
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: UserActionType.GET_USERS_SUCCESS,
                        lstUser: _get(res, 'res.data', [])
                    });
                } else {
                    dispatch({
                        type: UserActionType.GET_USERS_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            }).catch(e => {
                dispatch({
                    type: UserActionType.GET_USERS_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            });
    }
};

export const clearUsers = () => {
    return dispatch => dispatch({ type: UserActionType.CLEAR_USERS });
};