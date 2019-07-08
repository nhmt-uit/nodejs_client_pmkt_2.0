import _get from 'lodash/get';

import { ConfigurationActionType } from 'my-constants/action-types';
import { ConfigurationService } from 'my-services/manage';

export const getAccountantConfig = () => {
    return dispatch => {
        return ConfigurationService.getAccoutantConfig()
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ConfigurationActionType.GET_ACCOUNTANT_CONFIG_SUCCESS,
                        payload: res,
                    });
                } else {
                    dispatch({
                        type: ConfigurationActionType.GET_ACCOUNTANT_CONFIG_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ConfigurationActionType.GET_ACCOUNTANT_CONFIG_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

export const getCompanyConfig = () => {
    return dispatch => {
        return ConfigurationService.getCompanyConfig()
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ConfigurationActionType.GET_COMPANY_CONFIG_SUCCESS,
                        payload: res,
                    });
                } else {
                    dispatch({
                        type: ConfigurationActionType.GET_COMPANY_CONFIG_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ConfigurationActionType.GET_COMPANY_CONFIG_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

export const getCurrencyConfig = () => {
    return dispatch => {
        return ConfigurationService.getCurrencyConfig()
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ConfigurationActionType.GET_CURRENCY_CONFIG_SUCCESS,
                        payload: res,
                    });
                } else {
                    dispatch({
                        type: ConfigurationActionType.GET_CURRENCY_CONFIG_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ConfigurationActionType.GET_CURRENCY_CONFIG_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

export const saveCurrencyConfig = (post) => {
    return dispatch => {
        return ConfigurationService.saveCurrencyConfig(post)
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ConfigurationActionType.SAVE_CURRENCY_CONFIG_SUCCESS,
                        payload: res,
                    });
                } else {
                    dispatch({
                        type: ConfigurationActionType.SAVE_CURRENCY_CONFIG_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ConfigurationActionType.SAVE_CURRENCY_CONFIG_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

export const getInitCurrency = () => {
    return dispatch => {
        return ConfigurationService.getInitCurrency()
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ConfigurationActionType.GET_INIT_CURRENCY_SUCCESS,
                        payload: res,
                    });
                } else {
                    dispatch({
                        type: ConfigurationActionType.GET_INIT_CURRENCY_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ConfigurationActionType.GET_INIT_CURRENCY_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

export const saveCurrencyCustomFilter = (post) => {
    return dispatch => {
        return ConfigurationService.saveCurrencyCustomFilter(post)
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: ConfigurationActionType.SAVE_CURRENCY_CUSTOM_FILTER_SUCCESS,
                        payload: res,
                    });
                } else {
                    dispatch({
                        type: ConfigurationActionType.SAVE_CURRENCY_CUSTOM_FILTER_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: ConfigurationActionType.SAVE_CURRENCY_CUSTOM_FILTER_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};