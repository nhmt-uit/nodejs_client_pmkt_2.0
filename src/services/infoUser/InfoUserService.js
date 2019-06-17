import { AppConfig } from 'my-constants';
import { BaseService, HttpService } from 'my-utils/core';

class InfoUserService extends BaseService{
    serviceUrl = `${AppConfig.URL}/language`;

    getInfoUser(){
        const payload = {code: "en", updateLang: true};
        return HttpService.post(`${this.serviceUrl}/get`, payload)
    }
}

export default new InfoUserService()
