import { AppConfig } from 'my-constants';
import { BaseService, HttpService } from 'my-utils/core';
import CookieService from 'my-utils/core/CookieService';

class AuthService extends BaseService {
    serviceUrl = AppConfig.API_URL;
    /*
    |--------------------------------------------------------------------------
    | @content: authentication username & password
    | @param: username
    |           password
    |--------------------------------------------------------------------------
    */
    login(payload){
        let obj = {
            client_secret : AppConfig.API_CLIENT_SECRET,
            client_id: 1,
            grant_type: "password"
        };
        // Merge object
        payload = {...payload, ...obj};
        return HttpService.post(`${this.serviceUrl}/oauth2/token`, payload);
    };

    /*
    |--------------------------------------------------------------------------
    | @content: authentication username & password
    | @param: username
    |           password
    |--------------------------------------------------------------------------
    */
    refreshToken(){
        const payload = {
            client_secret : AppConfig.API_CLIENT_SECRET,
            client_id: 1,
            grant_type: "refresh_token",
            refresh_token: CookieService.get('refresh_token'),
        };
        return HttpService.post(`${this.serviceUrl}/oauth2/token`, payload).then(res => {
            CookieService.set('access_token', res.access_token);
            CookieService.set('expires_in', res.expires_in);
            CookieService.set('refresh_token', res.refresh_token);
            CookieService.set('token_type', res.token_type);
        })
    };

    /*
    |--------------------------------------------------------------------------
    | @content: Get secure code
    |--------------------------------------------------------------------------
    */
    getSecure() {
        return HttpService.post(`${this.serviceUrl}/secure/get`);
    };

    /*
    |--------------------------------------------------------------------------
    | @content: Check secure code
    | @param: {
    |   value1: Number
    |   value2: Number
    | }
    |--------------------------------------------------------------------------
    */
    checkSecure(payload) {
        return HttpService.post(`${this.serviceUrl}/secure/check`, payload);
    }
    
    /*
    |--------------------------------------------------------------------------
    | @content: Reset secure password
    |--------------------------------------------------------------------------
    */
    resetSecurePassword(post) {
        return HttpService.post(`${this.serviceUrl}/reset_secure_password`, post)
    }

    /*
    |--------------------------------------------------------------------------
    | @content: Get username
    |--------------------------------------------------------------------------
    */
    getUsername() {
        return CookieService.get("username")
    }

    /*
    |--------------------------------------------------------------------------
    | @content: Get expires
    |--------------------------------------------------------------------------
    */
    getExpires() {
        return CookieService.get("expires")
    }

    /*
    |--------------------------------------------------------------------------
    | Get refresh token
    |--------------------------------------------------------------------------
    */
    getRefreshToken() {
        return CookieService.get("refresh_token")
    }

    /*
    |--------------------------------------------------------------------------
    | Get access token
    |--------------------------------------------------------------------------
    */
    getAccessToken() {
        return CookieService.get("access_token")
    }

    /*
    |--------------------------------------------------------------------------
    | Logout user
    |--------------------------------------------------------------------------
    */
    logout() {
        CookieService.removeAll();

        return HttpService.post(`${this.serviceUrl}/signout`)
    }
}

export default new AuthService()