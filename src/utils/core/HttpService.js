import axios from 'axios';
import { isEmpty as _isEmpty, get as _get } from 'lodash';
import qs from 'qs';

import { Helpers } from 'my-utils';
import CookieService from 'my-utils/core/CookieService';
import { AppConfig } from 'my-constants';

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
        }).catch(error => {
            return this.refreshToken(error)
        })
    };

    //Create request with method post
    post = (path, payload, cancelToken) => {
        this.setAuthorization();
        if(_isEmpty(cancelToken)){
            cancelToken = this.getCancelToken();
        }

        //Convert Object to form data
        return this.service.post(path, qs.stringify(payload, { indices: false, skipNulls: false }), { cancelToken: cancelToken }).catch(error => {
            return this.refreshToken(error)
        })
    };

    //Create request with method put
    put = (path, payload, cancelToken) => {
        this.setAuthorization();
        if(_isEmpty(cancelToken)){
            cancelToken = this.getCancelToken();
        }
        return this.service.put(path, payload, { cancelToken: cancelToken }).catch(error => {
            return this.refreshToken(error)
        })
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
        }).catch(error => {
            return this.refreshToken(error)
        })
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

    refreshToken = params => {
        let responstStatus = _get(params, 'response.status')
        // Incase Expired Token
        if (responstStatus === 401) {
            const payload = {
                client_secret : AppConfig.API_CLIENT_SECRET,
                client_id: 1,
                grant_type: "refresh_token",
                refresh_token: CookieService.get('refresh_token'),
            };
            return this.service.post(`${AppConfig.API_URL}/oauth2/token`,  qs.stringify(payload, { indices: false, skipNulls: false })).then(res => {
                CookieService.set('access_token', res.access_token);
                CookieService.set('expires_in', res.expires_in);
                CookieService.set('refresh_token', res.refresh_token);
                CookieService.set('token_type', res.token_type);

                const payload_req = params.response.config
                payload_req.headers['Authorization'] = `Bearer ${res.access_token}`;
                return this.service.request(payload_req)
            })
        }
        throw params
    }

    //Handle when request fail
    handleError = error => {
        let responstStatus = _get(error, 'response.status')
        let responstError = _get(error, 'response.data.error')
        const pathname = window.location.pathname;
        if(responstStatus === 400 && !pathname.match(/\/auth\/login/i) ) {
            CookieService.removeAll()
            window.history.pushState(null, null, '/auth/login')
            window.location.reload()
        }

        /*======================================================
         * Server Manage Error
         * code: 500
         * error: "invalid_login"
         * error_description: "Not found user"
         *======================================================*/
        if(responstStatus === 500 && responstError === "invalid_login" && !pathname.match(/\/auth\/login/i) ) {
            CookieService.removeAll()
            window.history.pushState(null, null, '/auth/login')
            window.location.reload()
        }

        return Promise.reject(error);
    };
}

export default new HttpService();