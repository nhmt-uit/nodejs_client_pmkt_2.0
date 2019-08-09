import { AppConfig } from 'my-constants';
import { BaseService, HttpService} from "my-utils/core";

class HostManageService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;

    getHostManage(){
        return HttpService.post(`${this.serviceUrl}/host_manage/get`)
    }

    delHostManage(post){
        return HttpService.post(`${this.serviceUrl}/host_manage/delete`, post)
    }

    saveHostManage(post){
        return HttpService.post(`${this.serviceUrl}/host_manage/action`, post)
    }
}

export default new HostManageService