import { SubStatusActionType } from 'my-constants/action-types'

import { get as _get } from 'lodash';
import { SubStatusService } from 'my-services/sub-status'

export const getSubUsers = () => {
    return (dispatch) => {
        dispatch({
            type: SubStatusActionType.GET_SUB_USERS
        });

        return SubStatusService.getSubUsers()
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: SubStatusActionType.GET_SUB_USERS_SUCCESS,
                        lstSub: _get(res, 'res.data', {})
                    });
                } else {
                    dispatch({
                        type: SubStatusActionType.GET_SUB_USERS_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            }).catch(e => {
                dispatch({
                    type: SubStatusActionType.GET_SUB_USERS_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            });
    }
};

export const getSubActive = (item) => {
    return async dispatch => {
        const res = await SubStatusService.getSubActive({ id: item.id });

        if (res.status) {
            dispatch({
                type: SubStatusActionType.GET_SUB_ACTIVE_SUCCESS,
                lstChild: _get(res, 'res.data', []),
                item,
            });
        }
    }
};

export const getSubLocked = (item) => {
    return async dispatch => {
        const res = await SubStatusService.getSubLocked({ id: item.id });

        if (res.status) {
            dispatch({
                type: SubStatusActionType.GET_SUB_LOCKED_SUCCESS,
                lstChild: _get(res, 'res.data', []),
                item,
            });
        }
    }
};

export const toggleModal = selectedItem => {
    return dispatch => dispatch({
        type: SubStatusActionType.TOGGLE_MODAL,
        selectedItem: selectedItem || {},
    })
};

export const clearSubUsers = () => {
    return dispatch => dispatch({
        type: SubStatusActionType.CLEAR_SUB_USERS,
    })
};
