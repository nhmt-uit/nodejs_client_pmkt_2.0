import { AppConfig } from 'my-constants';
import { BaseService, HttpService } from 'my-utils/core';
import CookieService from 'my-utils/core/CookieService';


class AuthService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/oauth2`;
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
        }
        // Merge object
        payload = {...payload, ...obj}
        return HttpService.post(`${this.serviceUrl}/token`, payload)
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
}

export default new AuthService()