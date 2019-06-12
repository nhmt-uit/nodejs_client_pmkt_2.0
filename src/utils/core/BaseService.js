import { AppConfig } from 'my-constants';
import { HttpService } from 'my-utils/core';

class BaseService {
    serviceUrl = AppConfig.API_URL;

    /*
    |--------------------------------------------------------------------------
    | @content: set value for serviceUrl variable
    | @param: url: string
    |--------------------------------------------------------------------------
    */
    setServiceUrl(url) {
        this.serviceUrl = url;
    }

    /*
    |--------------------------------------------------------------------------
    | @content: get cancel token axios
    |--------------------------------------------------------------------------
    */
    getCancelTokenSource(){
        return HttpService.getCancelTokenSource();
    }

    /*
    |--------------------------------------------------------------------------
    | @content: get one record data
    | @method: get
    | @param: id: primary key
    |            cancelToken: object
    |--------------------------------------------------------------------------
    */
    findByID(id, cancelToken = {}) {
        return HttpService.get(this.serviceUrl + id, {}, cancelToken);
    }

    /*
    |--------------------------------------------------------------------------
    | @content: get all record data
    | @method: get
    | @param: data: object
    |            + queryString: query string url
    |         cancelToken: object
    |--------------------------------------------------------------------------
    */
    findAll(options = {}, cancelToken = {}) {
        return HttpService.get(this.serviceUrl, options, cancelToken);
    }

    /*
    |--------------------------------------------------------------------------
    | @content: update record
    | @method: post
    | @param: data: object
    |         cancelToken: object
    |--------------------------------------------------------------------------
    */
    create(data = [], cancelToken = {}) {
        return HttpService.post(this.serviceUrl, data, cancelToken);
    }

    /*
    |--------------------------------------------------------------------------
    | @content: update record
    | @method: put
    | @param: id: primary key
    |           + data: object
    |         cancelToken: object
    |--------------------------------------------------------------------------
    */
    update(id, data = [], cancelToken = {}) {
        return HttpService.put(this.serviceUrl + id, data, cancelToken);
    }


    /*
    |--------------------------------------------------------------------------
    | @content: delete record
    | @method: delete
    | @param: id: primary key
    |           + queryString: query string url
    |         cancelToken: object
    |--------------------------------------------------------------------------
    */
    delete(id, queryParams = [], cancelToken = {}) {
        return HttpService.delete(this.serviceUrl + id, queryParams, cancelToken);
    }
}

export default BaseService;
