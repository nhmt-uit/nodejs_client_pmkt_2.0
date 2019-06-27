import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class AlertService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/notice`;

    getAlert(){
        return HttpService.post(`${this.serviceUrl}/get_mobile`)
    }
}

export default new AlertService()