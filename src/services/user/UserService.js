import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class UserService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/user`;

    getUsers() {
        return HttpService.post(`${this.serviceUrl}/get`)
    }

    toggleFeature(payload) {
        return HttpService.post(`${this.serviceUrl}/toggle_feature`, payload);
    }
}

export default new UserService()