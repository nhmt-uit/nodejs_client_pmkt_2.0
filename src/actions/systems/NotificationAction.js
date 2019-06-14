import _get from 'lodash/get';

import { NotificationActionType } from 'my-constants/action-types';
import { NotificationService } from 'my-services/systems';

export const getMsg = () => {
    return dispatch => {
        return NotificationService.getMsg()
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: NotificationActionType.GET_MSG_SUCCESS,
                        payload: res,
                    });
                } else {
                    dispatch({
                        type: NotificationActionType.GET_MSG_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: NotificationActionType.GET_MSG_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

export const getFriend = () => {
    return dispatch => {
        return NotificationService.getFriend()
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: NotificationActionType.GET_FRIEND_SUCCESS,
                        payload: res,
                    });
                } else {
                    dispatch({
                        type: NotificationActionType.GET_FRIEND_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: NotificationActionType.GET_FRIEND_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};
