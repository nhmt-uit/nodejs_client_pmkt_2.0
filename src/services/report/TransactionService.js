import {AppConfig} from 'my-constants';
import {BaseService, HttpService} from "my-utils/core";

class TransactionService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/manual_transport_new`;

    getAllTransaction(){
        return HttpService.post(`${this.serviceUrl}/getall`)
    }

    getCycle(){
        return HttpService.post(`${this.serviceUrl}/chuky`)
    }

    getTypeOfMoney(){
        return HttpService.post(`${this.serviceUrl}/loaitien`)
    }
}

export default new TransactionService()