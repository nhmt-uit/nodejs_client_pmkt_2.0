import _get from 'lodash/get';

import { ReportActionType } from 'my-constants/action-types';
import { ReportService } from 'my-services';

/**
 * @description Get cycle page
 * @param {Object} pagination - include currentPage and itemPerPage
 * */
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

/**
 * @description Close cycle
 * @param {Object} chuky - include {String} chuky_id
 * */
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

/**
 * @description Get report
 * @param {Object} post - include {String} chuky_id
 * @param {Object} itemActive - include cycle or account or banker
 * */
export const getReport = (post, itemActive) => {
    return dispatch => {
        dispatch({
            type: ReportActionType.GET_REPORT,
        });

        return ReportService.getReport(post)
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ReportActionType.GET_REPORT_SUCCESS,
                        payload: { res: res.res, itemActive } || {},
                    });
                } else {
                    dispatch({
                        type: ReportActionType.GET_REPORT_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ReportActionType.GET_REPORT_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

/**
 * @description Get report by banker
 * @param {Object} post - include {String} chuky_id, {String} banker_id
 * */
export const getReportByBanker = (post, itemActive) => {
    return dispatch => {
        dispatch({
            type: ReportActionType.GET_REPORT_BY_BANKER,
        });

        return ReportService.getReportByBanker(post)
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ReportActionType.GET_REPORT_BY_BANKER_SUCCESS,
                        payload: { res: res.res, itemActive } || {},
                    });
                } else {
                    dispatch({
                        type: ReportActionType.GET_REPORT_BY_BANKER_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ReportActionType.GET_REPORT_BY_BANKER_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

/**
 * @description Get report by member
 * @param {Object} post - include {String} chuky_id, {String} member_name
 * */
export const getReportByMember = (post, itemActive) => {
    return dispatch => {
        dispatch({
            type: ReportActionType.GET_REPORT_BY_MEMBER,
        });

        return ReportService.getReportByMember(post)
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ReportActionType.GET_REPORT_BY_MEMBER_SUCCESS,
                        payload: { res: res.res, itemActive } || {},
                    });
                } else {
                    dispatch({
                        type: ReportActionType.GET_REPORT_BY_MEMBER_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ReportActionType.GET_REPORT_BY_MEMBER_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};