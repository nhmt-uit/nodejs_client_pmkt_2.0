import { AppConfig } from 'my-constants';
import { BaseService, HttpService } from 'my-utils/core';

class ConfigurationService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;
    /*
    |--------------------------------------------------------------------------
    | @content: Get accountant configuration
    |--------------------------------------------------------------------------
    */
    getAccoutantConfig(){
        return HttpService.post(`${this.serviceUrl}/accountant_config`);
    };

    /*
    |--------------------------------------------------------------------------
    | @content: Get company configuration
    |--------------------------------------------------------------------------
    */
    getCompanyConfig(){
        return HttpService.post(`${this.serviceUrl}/company_config`);
    };

    /*
    |--------------------------------------------------------------------------
    | @content: Get currency configuration
    |--------------------------------------------------------------------------
    */
    getCurrencyConfig(){
        return HttpService.post(`${this.serviceUrl}/currency`);
    };

    /*
    |--------------------------------------------------------------------------
    | @content: Save currency configuration
    |--------------------------------------------------------------------------
    */
    saveCurrencyConfig(post){
        return HttpService.post(`${this.serviceUrl}/currency/save`, post);
    };
}

export default new ConfigurationService()