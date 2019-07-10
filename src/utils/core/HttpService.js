import axios from 'axios';
import { isEmpty as _isEmpty, get as _get } from 'lodash';
import qs from 'qs';

import { Helpers } from 'my-utils';
import CookieService from 'my-utils/core/CookieService';

class HttpService {
    constructor() {
        let config = {
            withCredentials: false, //reject authen token
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        //Inital Service
        this.service = axios.create(config);
        this.service.interceptors.request.use(this.handleRequest, this.handleError);
        this.service.interceptors.response.use(this.handleSuccess, this.handleError);
    }

    getCancelTokenSource = () => {
        return axios.CancelToken.source();
    };

    getCancelToken = () => {
        let source = this.getCancelTokenSource();
        return source.token;
    };

    //Create request with method get
    get = (path, queryParams, cancelToken) => {
        this.setAuthorization();
        if(_isEmpty(cancelToken)){
            cancelToken = this.getCancelToken();
        }

        return this.service.get(path, {
            params: queryParams,
            cancelToken: cancelToken
        });
    };

    //Create request with method post
    post = (path, payload, cancelToken) => {
        this.setAuthorization();
        if(_isEmpty(cancelToken)){
            cancelToken = this.getCancelToken();
        }

        //Convert Object to form data
        return this.service.post(path, qs.stringify(payload, { indices: false, skipNulls: false }), { cancelToken: cancelToken });
    };

    //Create request with method put
    put = (path, payload, cancelToken) => {
        this.setAuthorization();
        if(_isEmpty(cancelToken)){
            cancelToken = this.getCancelToken();
        }
        return this.service.put(path, payload, { cancelToken: cancelToken });
    };

    //Create request with method delete
    delete = (path, queryParams, cancelToken) => {
        this.setAuthorization();
        if(_isEmpty(cancelToken)){
            cancelToken = this.getCancelToken();
        }

        return this.service.delete(path, {
            params: queryParams,
            cancelToken: cancelToken
        });
    };

    //Set JWT Token
    setAuthorization = () => {
        const accessToken = CookieService.get('access_token');

        if (accessToken) {
            this.service.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
    };

    //Handle berfore send request
    handleRequest = config => {
        // Helpers.showLoading();
        return config;
    };

    //Handle when request sucessful
    handleSuccess = response => {
        //obj response : data, status, statusText, headers
        const { data } = response;
        // Helpers.hideLoading();
        return data;
    };

    //Handle when request fail
    handleError = error => {
        // Helpers.hideLoading();
        let responstStatus = _get(error, 'response.status')
		const pathname = window.location.pathname;
        if ( (responstStatus === 401 || responstStatus === 400) && !pathname.match(/\/auth\/login/i) ) {
            CookieService.removeAll()
            window.history.pushState(null, null, '/auth/login')
            window.location.reload()
        }

        return Promise.reject(error);
    };
}

export default new HttpService();