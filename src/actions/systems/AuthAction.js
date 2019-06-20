import _get from 'lodash/get';

import { AuthActionType } from 'my-constants/action-types';
import { AuthService, LanguageService } from 'my-services/systems';
import { CookieService } from 'my-utils/core';
import { AppConfig } from 'my-constants';
import { RoutesService } from 'my-routes';

export const login = (user) => {
    return (dispatch) => {
        return AuthService.login(user).then(resLogin => {
            CookieService.set('access_token', resLogin.access_token);

            LanguageService.getLanguage(AppConfig.DEFAULT_LANG)
                .then(data => {
                    const userInfo = data.data.userInfo;

                    const isLogin = userInfo.isLogin;
                    const isReset = userInfo.isReset;
                    const isCheckSecure = userInfo.isCheckSecure;
                    const isAdmin = userInfo.isAdmin;
                    const roles = userInfo.roles || 0;
                    const rolesMaster = userInfo.rolesMaster || 0;
                    const username = userInfo.username || '';
                    const hasSpecialFeature = userInfo.hasSpecialFeature;
                    const hasReportDetailFeature = userInfo.hasReportDetailFeature;
                    const status = userInfo.status || 0;
                    const needChangeSecurePassword = userInfo.needChangeSecurePassword || 0;

                    CookieService.set('isLogin', isLogin ? '1' : '0');
                    CookieService.set('isReset', isReset ? '1' : '0');
                    CookieService.set('isCheckSecure', isCheckSecure ? '1' : '0');
                    CookieService.set('isAdmin', isAdmin ? '1' : '0');
                    CookieService.set('roles', roles);
                    CookieService.set('expires', userInfo.ep);
                    CookieService.set('rolesMaster', rolesMaster);
                    CookieService.set('username', username);
                    CookieService.set('hasSpecialFeature', hasSpecialFeature ? '1' : '0');
                    CookieService.set('hasReportDetailFeature', hasReportDetailFeature ? '1' : '0');
                    CookieService.set('status', status );
                    CookieService.set('needChangeSecurePassword', needChangeSecurePassword ? '1' : '0' );

                    CookieService.set('expires_in', resLogin.expires_in);
                    CookieService.set('refresh_token', resLogin.refresh_token);
                    CookieService.set('token_type', resLogin.token_type);
                    CookieService.set('isLogin', '1');
                }).then(_ => {
                dispatch({
                    type: AuthActionType.AUTH_LOGIN_SUCCESS,
                    payload: resLogin
                });
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
                    CookieService.set('isCheckSecure', true);

                    dispatch({
                        type: AuthActionType.AUTH_CHECK_SECURE_SUCCESS,
                        payload: {},
                    });
                } else {
                    dispatch({
                        type: AuthActionType.AUTH_GET_SECURE_FAIL,
                        payload: _get(e, 'response.data', {
                            status: false,
                            error_description: e.stack,
                        }),
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
                    CookieService.set('isCheckSecure', true);
                    dispatch({
                        type: AuthActionType.AUTH_CHECK_SECURE_SUCCESS,
                        payload: res,
                    });
                } else {
                    CookieService.remove('isLogin');
                    CookieService.remove('access_token');
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
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            });
    };
};

export const resetSecurePassword = (post) => {
    return dispatch => {
        return AuthService.resetSecurePassword(post)
            .then(res => {
                if (res.status) {
                    CookieService.set('byPassDashboard', true);

                    setTimeout(() => {
                        dispatch({
                            type: AuthActionType.RESET_SECURE_PASSWORD_SUCCESS,
                            payload: res,
                        });
                    }, 1000);
                } else {
                    dispatch({
                        type: AuthActionType.RESET_SECURE_PASSWORD_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            })
            .catch(e => {
                dispatch({
                    type: AuthActionType.RESET_SECURE_PASSWORD_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            })
    }
};

export const logout = () => {
    return dispatch => {
        return AuthService.logout()
            .then((res) => {
                dispatch({
                    type: AuthActionType.LOGOUT_SUCCESS,
                    payload: res,
                });

                window.location = RoutesService.getPath('ADMIN', 'DASHBOARD');
            })
            .catch(e => {
                dispatch({
                    type: AuthActionType.LOGOUT_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            });
    }
};
