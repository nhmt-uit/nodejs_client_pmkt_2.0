import {AppConfig} from 'my-constants';
import {BaseService, HttpService} from "my-utils/core";

class MemberService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;

    getMember(){
        return HttpService.post(`${this.serviceUrl}/member`)
    }

    createMember(payload){
        return HttpService.post(`${this.serviceUrl}/member/create_member`, payload)
    }


    getSuffixesMember() {
        return HttpService.post(`${this.serviceUrl}/member/get_suffixes_member`)
    }

    validateMemberName(fullname) {
        const payload = {value: fullname}
        return HttpService.post(`${this.serviceUrl}/member/validator_member_name`, payload)
    }

    validateMemberUser(username) {
        const payload = {value: username}
        return HttpService.post(`${this.serviceUrl}/member/validator_member_user`, payload)
    }

    updateMultiCongThucTinh(members) {
        const payload = { data: JSON.stringify(members) };

        return HttpService.post(`${this.serviceUrl}/member/update_multi_cong_thuc_tinh`, payload);
    }

    updateLinkFormulaDetail(payload) {
        return HttpService.post(`${this.serviceUrl}/member/update_link_formula_detail`, payload);
    }

    /*
    |--------------------------------------------------------------------------
    | @input: memberId
    |--------------------------------------------------------------------------
    */
    getFormulaByMember(payload) {
        return HttpService.post(`${this.serviceUrl}/member/get_link_formula_detail`, payload)
    }

    /*
    |--------------------------------------------------------------------------
    | @input: id
    |--------------------------------------------------------------------------
    */
    deleteMember(id) {
        return HttpService.post(`${this.serviceUrl}/member/delete_member`, {id: id})
    }

     /*
    |--------------------------------------------------------------------------
    | input: @memberId: string, @congthuctinhId: string
    |--------------------------------------------------------------------------
    */
    deleteLinkFormulaDetail(payload){
        return HttpService.post(`${this.serviceUrl}/member/delete_link_formula_detail`, payload)
    }

    /*
    |--------------------------------------------------------------------------
    | input: @memberId: string, @congthuctinhIds: array
    |--------------------------------------------------------------------------
    */
    multipleDeleteLinkFormulaDetail(payload){
        return HttpService.post(`${this.serviceUrl}/member/multi_delete_link_formula_detail`, payload)
    }
}

export default new MemberService()