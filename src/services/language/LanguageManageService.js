import { AppConfig } from 'my-constants';
import { BaseService, HttpService} from "my-utils/core";

class LanguageManageService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;

    getLanguageManage(){
        return HttpService.post(`${this.serviceUrl}/language_manage/get`)
    }

    delLanguageManage(post){
        return HttpService.post(`${this.serviceUrl}/language_manage/delete`, post)
    }

    saveLanguageManage(post){
        return HttpService.post(`${this.serviceUrl}/language_manage/action`, post)
    }

    validateLanguageKey(lang_key) {
        const payload = {
            value: lang_key,
            except: false,
        }
        return HttpService.post(`${this.serviceUrl}/language_manage/validate`, payload)
    }
}

export default new LanguageManageService()