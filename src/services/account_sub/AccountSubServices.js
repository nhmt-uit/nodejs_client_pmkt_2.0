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

    createMemberSub(post){
        return HttpService.post(`${this.serviceUrl}/member_sub/create_member`,post)
    }

    validateMemberSubName(fullname) {
        const payload = {value: fullname}
        return HttpService.post(`${this.serviceUrl}/member_sub/validator_member_name`, payload)
    }

    validateMemberSubUser(username){
        const payload = {value: username}
        return HttpService.post(`${this.serviceUrl}/member_sub/validator_member_user`, payload)
    }
}

export default new AccountSubServices()