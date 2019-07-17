import _get from 'lodash/get';

import { ReportActionType } from 'my-constants/action-types';
import { ReportService } from 'my-services/report';

/**
 * @description Get cycle page
 * @param {Object} pagination - include currentPage and itemPerPage
 * */
export const getCyclePage = (pagination) => {
    return dispatch => {
        dispatch({
            type: ReportActionType.GET_CYCLE_PAGE_SUCCESS,
            isFetching: true
        });

        return ReportService.getCyclePage(pagination)
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ReportActionType.GET_CYCLE_PAGE_SUCCESS,
                        payload: res.res || {},
                        isFetching: false
                    });
                } else {
                    dispatch({
                        type: ReportActionType.GET_CYCLE_PAGE_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                        isFetching: false
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
                    isFetching: false
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

/**
 * @description Money exchange
 * */
export const moneyExchange = (post) => {
    return dispatch => {
        dispatch({
            type: ReportActionType.MONEY_EXCHANGE,
        });

        return ReportService.moneyExchange(post)
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ReportActionType.MONEY_EXCHANGE_SUCCESS,
                        payload: res.res || {},
                    });
                } else {
                    dispatch({
                        type: ReportActionType.MONEY_EXCHANGE_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ReportActionType.MONEY_EXCHANGE_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

/**
 * @description Modifie money exchange id
 * */
export const changeMoneyExchangeIds = (id) => {
    return dispatch => {
        dispatch({
            type: ReportActionType.CHANGE_MONEY_EXCHANGE_IDS,
            payload: id,
        });
    }
};

/**
 * @description Modifie status button money exchange
 * */
export const changeStatusBtnMoneyExchange = (status) => {
    return dispatch => {
        dispatch({
            type: ReportActionType.CHANGE_STATUS_BTN_MONEY_EXCHANGE,
            payload: status,
        });
    }
};