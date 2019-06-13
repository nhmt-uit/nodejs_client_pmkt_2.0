<<<<<<< HEAD


import { AuthActionType } from 'my-constants/action-types';

import AuthService from 'my-services/systems/AuthService'
import { CookieService } from 'my-utils/core';


=======
import Cookies from 'universal-cookie';
import _get from 'lodash/get';

import { AuthActionType } from 'my-constants/action-types';
import { AuthService, LanguageService } from 'my-services/systems';

const cookies = new Cookies();

>>>>>>> 6e612766651dd6f781ed928ca802ec31f03e1ac9
export const login = (lang_code) => {
    return (dispatch) => {
        return AuthService.login(lang_code).then(res => {
            CookieService.set('access_token', res.access_token);
            CookieService.set('expires_in', res.expires_in);
            CookieService.set('refresh_token', res.refresh_token);
            CookieService.set('token_type', res.token_type);
            CookieService.set('isLogin', '1');

            dispatch({
                type: AuthActionType.AUTH_LOGIN_SUCCESS,
                payload: res
            });
        }).catch (error => {
            dispatch({
                type: AuthActionType.AUTH_LOGIN_FAIL,
                payload: _get(error, 'response.data', {
                    status: false,
                    error_description: error.stack,
                }),
            })
        })
    }
};

export const getSecure = _ => {
    return (dispatch) => {
        return AuthService.getSecure()
            .then(res => {
                if (res.status && _get(res, 'res.valid', true)) {
                    dispatch({
                        type: AuthActionType.AUTH_GET_SECURE_SUCCESS,
                        payload: res,
                    });
                } else {
                    dispatch({
                        type: AuthActionType.AUTH_GET_SECURE_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.errorLogin', '')
                        },
                    });
                }
            }).catch(e => {
                if (e.response.status === 500) {
                    cookies.set('isCheckSecure', true, { path: '/' });

                    dispatch({
                        type: AuthActionType.AUTH_CHECK_SECURE_SUCCESS,
                        payload: {},
                    });
                } else {
                    dispatch({
                        type: AuthActionType.AUTH_GET_SECURE_FAIL,
                        payload: {
                            status: false,
                            error_description: e.stack
                        },
                    });
                }
            });
    };
};

export const checkSecure = (secureCode) => {
    return (dispatch) => {
        return AuthService.checkSecure(secureCode)
            .then(res => {
                if (res.status && _get(res, 'res.valid', true)) {
                    cookies.set('isCheckSecure', true, { path: '/' });
                    dispatch({
                        type: AuthActionType.AUTH_CHECK_SECURE_SUCCESS,
                        payload: res,
                    });
                } else {
                    cookies.remove('isLogin', { path: '/' });
                    cookies.remove('access_token', { path: '/' });
                    dispatch({
                        type: AuthActionType.AUTH_CHECK_SECURE_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.errorLogin', '')
                        },
                    });
                }
            }).catch(e => {
                dispatch({
                    type: AuthActionType.AUTH_CHECK_SECURE_FAIL,
                    payload: {
                        status: false,
                        error_description: e.stack
                    },
                });
            });
    };
};
