import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class SubStatusService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/sub_status/sub`;

    getSubUsers() {
        return HttpService.post(`${this.serviceUrl}/users`)
    }

    getSubLocked(payload) {
        return HttpService.post(`${this.serviceUrl}/get_locked`, payload);
    }

    getSubActive(payload) {
        return HttpService.post(`${this.serviceUrl}/get_active`, payload);
    }

    unlockSub(payload) {
        return HttpService.post(`${this.serviceUrl}/unlock`, payload);
    }

    unlockSubByUser(payload) {
        return HttpService.post(`${this.serviceUrl}/unlock_by_user`, payload);
    }

    lockSubByUser(payload) {
        return HttpService.post(`${this.serviceUrl}/lock_by_user`, payload);
    }

    lockSub(payload) {
        return HttpService.post(`${this.serviceUrl}/lock`, payload);
    }
}

export default new SubStatusService()