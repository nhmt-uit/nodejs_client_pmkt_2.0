import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class BankerService extends BaseService {
    serviceUrl = `${AppConfig.URL}`;

    getBanker(){
        return HttpService.post(`${this.serviceUrl}/company_config`)
    }
}

export default new BankerService()