import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class CurrencyTypeService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/currency_type`;

    getCurrencyType() {
        return HttpService.post(this.serviceUrl)
    }

    actionCurrencyType(payload) {
        const url = `${this.serviceUrl}/action`;

        return HttpService.post(url, payload);
    }
}

export default new CurrencyTypeService()