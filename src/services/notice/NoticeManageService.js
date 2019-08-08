import { AppConfig } from 'my-constants';
import { BaseService, HttpService} from "my-utils/core";

class NoticeManageService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;

    getNoticeManage(){
        return HttpService.post(`${this.serviceUrl}/notice_manage/get`)
    }

    delNoticeManage(post){
        return HttpService.post(`${this.serviceUrl}/notice_manage/delete`, post)
    }

    saveNoticeManage(post){
        return HttpService.post(`${this.serviceUrl}/notice_manage/action`, post)
    }

    validateLangKey(lang_key) {
        const payload = {
            value: lang_key,
            except: false,
        }
        return HttpService.post(`${this.serviceUrl}/notice_manage/validate`, payload)
    }
}

export default new NoticeManageService()