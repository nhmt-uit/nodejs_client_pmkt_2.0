import Cookies from 'universal-cookie';

import { AuthActionType } from 'my-constants/action-types';
import AuthService from 'my-services/systems/AuthService'

const cookies = new Cookies();
export const login = (lang_code) => {
    return (dispatch) => {
        return AuthService.login(lang_code).then(res => {
            cookies.set('access_token', res.access_token, {path: "/"});
            cookies.set('expires_in', res.expires_in, {path: "/"});
            cookies.set('refresh_token', res.refresh_token, {path: "/"});
            cookies.set('token_type', res.token_type, {path: "/"});
            cookies.set('isLogin', '1', {path: "/"});

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
