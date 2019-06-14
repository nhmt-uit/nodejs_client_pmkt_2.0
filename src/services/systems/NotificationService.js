import { AppConfig } from 'my-constants';
import { BaseService, HttpService } from 'my-utils/core';

class NotificationService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/friend`;
    /*
    |--------------------------------------------------------------------------
    | @content: Get msg
    |--------------------------------------------------------------------------
    */
    getMsg(){
        return HttpService.post(`${this.serviceUrl}/get_msg`);
    };

    /*
    |--------------------------------------------------------------------------
    | @content: Get friend
    |--------------------------------------------------------------------------
    */
    getFriend(){
        return HttpService.post(`${this.serviceUrl}/get_friend`);
    };
}

export default new NotificationService()