import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class BankerService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;

    getBanker(){
        return HttpService.post(`${this.serviceUrl}/company_config`)
    }

    getBankerByMember(payload){
        return HttpService.post(`${this.serviceUrl}/banker/get`, payload)
    }
}

export default new BankerService()