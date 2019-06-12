import axios from 'axios';
import { isEmpty } from 'lodash';
import qs from 'qs'

import { Helpers } from 'my-utils'

class HttpService {
    constructor() {
        let config = {
            withCredentials: false, //reject authen token
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        //Inital Service
        this.service = axios.create(config);
        this.service.interceptors.request.use(this.handleRequest, this.handleError);
        this.service.interceptors.response.use(this.handleSuccess, this.handleError);
    }

    getCancelTokenSource = () => {
        return axios.CancelToken.source();
    }

    getCancelToken = () => {
        let source = this.getCancelTokenSource();
        return source.token;
    }

    //Create request with method get
    get = (path, queryParams, cancelToken) => {
        this.setAuthorization();
        if(isEmpty(cancelToken)){
            cancelToken = this.getCancelToken();
        }

        return this.service.get(path, {
            params: queryParams,
            cancelToken: cancelToken
        });
    }

    //Create request with method post
    post = (path, payload, cancelToken) => {
        this.setAuthorization();
        if(isEmpty(cancelToken)){
            cancelToken = this.getCancelToken();
        }

        //Convert Object to form data
        // payload = this.obj2fd(payload)
        return this.service.post(path, qs.stringify(payload), { cancelToken: cancelToken });
    }

    //Create request with method put
    put = (path, payload, cancelToken) => {
        this.setAuthorization();
        if(isEmpty(cancelToken)){
            cancelToken = this.getCancelToken();
        }
        return this.service.put(path, payload, { cancelToken: cancelToken });
    }

    //Create request with method delete
    delete = (path, queryParams, cancelToken) => {
        this.setAuthorization();
        if(isEmpty(cancelToken)){
            cancelToken = this.getCancelToken();
        }

        return this.service.delete(path, {
            params: queryParams,
            cancelToken: cancelToken
        });
    }

    //Set JWT Token
    setAuthorization = () => {
        // this.service.defaults.headers.common['Authorization'] = 'Basic ' + btoa(`${AppConfig.API_AUTH_USER}:${AppConfig.API_AUTH_PASS}`);
    }

    //Handle berfore send request
    handleRequest = config => {
        console.log('test')
        Helpers.showLoading();
        return config;
    }
        
    //Handle when request sucessful
    handleSuccess = response => {
        //obj response : data, status, statusText, headers
        const { data } = response;
        Helpers.hideLoading();
        return data;
    }

    //Handle when request fail
    handleError = error => {
        Helpers.hideLoading();
        return Promise.reject(error);
    }

    //Convert object to form data
    obj2fd = obj => {
        let fd = new FormData()
        for(let x in obj) {
            fd.append(x, obj[x])
        }
        return fd
    }
}

export default new HttpService();