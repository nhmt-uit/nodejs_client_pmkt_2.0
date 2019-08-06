import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class SubStatusService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/sub_status/sub`;

    getSubUsers() {
        return HttpService.post(`${this.serviceUrl}/users`)
    }

    getSubLocked(payload) {
        const url = `${this.serviceUrl}/get_locked`;

        return HttpService.post(url, payload);
    }

    unlockSub(payload) {
        const url = `${this.serviceUrl}/unlock`;

        return HttpService.post(url, payload);
    }
}

export default new SubStatusService()