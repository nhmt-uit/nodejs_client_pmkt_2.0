import {AppConfig} from 'my-constants';
import {BaseService, HttpService} from "my-utils/core";

class TransactionService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;

    getMember(){
        return HttpService.post(`${this.serviceUrl}/member`)
    }
}

export default new TransactionService()