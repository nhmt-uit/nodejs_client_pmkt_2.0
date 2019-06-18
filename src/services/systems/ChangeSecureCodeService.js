import { AppConfig } from 'my-constants';
import { BaseService, HttpService } from 'my-utils/core';

class ChangeSecureCodeService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/change_security`;
    /*
    |--------------------------------------------------------------------------
    | @content: Save security code
    |--------------------------------------------------------------------------
    */
    saveSecureCode(payload){
        return HttpService.post(`${this.serviceUrl}/save`, payload);
    };
}

export default new ChangeSecureCodeService()