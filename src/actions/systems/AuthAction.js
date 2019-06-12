

import { AuthActionType } from 'my-constants/action-types';

import AuthService from 'my-services/systems/AuthService'
import { CookieService } from 'my-utils/core';


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
            })
        }).catch (error => {
            dispatch({
                type: AuthActionType.AUTH_LOGIN_FAIL,
                payload: error.response.data
            })
        })
    }
}
