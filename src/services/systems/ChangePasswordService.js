import { AppConfig } from 'my-constants';
import { BaseService, HttpService } from 'my-utils/core';

class ChangePasswordService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/change_password`;
    /*
    |--------------------------------------------------------------------------
    | @content: save password
    |--------------------------------------------------------------------------
    */
    savePassword(payload){
        return HttpService.post(`${this.serviceUrl}/save`, payload);
    };

    /*
    |--------------------------------------------------------------------------
    | @content: save password
    |--------------------------------------------------------------------------
    */
    savePassword2(payload){
        return HttpService.post(`${this.serviceUrl}/save2`, payload);
    };
}

export default new ChangePasswordService()