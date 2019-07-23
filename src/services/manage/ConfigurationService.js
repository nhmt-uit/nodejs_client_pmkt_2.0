import { AppConfig } from 'my-constants';
import { BaseService, HttpService } from 'my-utils/core';

class ConfigurationService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;
    /*
    |--------------------------------------------------------------------------
    | @content: Get accountant configuration
    |--------------------------------------------------------------------------
    */
    getAccountantConfig(){
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
    | @content: Save company configuration
    |--------------------------------------------------------------------------
    */
    saveCompanyConfig(post){
        return HttpService.post(`${this.serviceUrl}/company_config/save`, post)
    }

    /*
    |--------------------------------------------------------------------------
    | @content: Save currency configuration
    |--------------------------------------------------------------------------
    */
    saveCurrencyConfig(post){
        return HttpService.post(`${this.serviceUrl}/currency/save`, post);
    };

    /*
    |--------------------------------------------------------------------------
    | @content: Save accountant configuration
    |--------------------------------------------------------------------------
    */
    saveAccountantConfig(post){
        return HttpService.post(`${this.serviceUrl}/accountant_config/save`, post);
    };

    /*
   |--------------------------------------------------------------------------
   | @content: Get init currency configuration
   |--------------------------------------------------------------------------
   */
    getInitCurrency(){
        return HttpService.post(`${this.serviceUrl}/currency/init`);
    };

    /*
  |--------------------------------------------------------------------------
  | @content: Validator currency configuration
  |--------------------------------------------------------------------------
  */
    validatorCurrency(post){
        return HttpService.post(`${this.serviceUrl}/currency/validator`, post);
    };

    /*
 |--------------------------------------------------------------------------
 | @content: Save custom filter configuration
 |--------------------------------------------------------------------------
 */
    saveCurrencyCustomFilter(post){
        return HttpService.post(`${this.serviceUrl}/currency/save_custom_filter`, post);
    };
}

export default new ConfigurationService()