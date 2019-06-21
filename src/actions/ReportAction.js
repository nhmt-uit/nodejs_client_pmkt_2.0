import _get from 'lodash/get';

import { ReportActionType } from 'my-constants/action-types';
import { ReportService } from 'my-services';

export const getCyclePage = (pagination) => {
    return dispatch => {
        dispatch({
            type: ReportActionType.GET_CYCLE_PAGE,
        });

        return ReportService.getCyclePage(pagination)
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ReportActionType.GET_CYCLE_PAGE_SUCCESS,
                        payload: res.res || {},
                    });
                } else {
                    dispatch({
                        type: ReportActionType.GET_CYCLE_PAGE_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ReportActionType.GET_CYCLE_PAGE_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

export const closeCycle = (chuky) => {
    return dispatch => {
        return ReportService.closeCycle(chuky)
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ReportActionType.CLOSE_CYCLE_SUCCESS,
                        payload: res.res || {},
                    });
                } else {
                    dispatch({
                        type: ReportActionType.CLOSE_CYCLE_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ReportActionType.CLOSE_CYCLE_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};