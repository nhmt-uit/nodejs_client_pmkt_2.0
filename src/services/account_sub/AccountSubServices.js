import { AppConfig } from 'my-constants';
import { BaseService, HttpService} from "my-utils/core";

class AccountSubServices extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;

    getMemberSub(){
        return HttpService.post(`${this.serviceUrl}/member_sub`)
    }

    delMemberSub(post){
        return HttpService.post(`${this.serviceUrl}/member_sub/delete_member`, post)
    }

    getSuffixesMember(){
        return HttpService.post(`${this.serviceUrl}/member_sub/get_suffixes_member`)
    }

}

export default new AccountSubServices()