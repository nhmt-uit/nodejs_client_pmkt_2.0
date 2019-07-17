import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class FormulaService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;
    getFormula() {
        return HttpService.post(`${this.serviceUrl}/formula`)
    }
    
    getInitForm() {
        return HttpService.post(`${this.serviceUrl}/formula/init_form`)
    }
    
    getFormulaByAccountId(account_id) {
        const payload = {account_id}
        return HttpService.post(`${this.serviceUrl}/create_new/detail`, payload)
    }

    /*
    |--------------------------------------------------------------------------
    | input: @memberId: string, @congthuctinhId: string
    |--------------------------------------------------------------------------
    */
    deleteLinkFormulaDetail(payload){
        return HttpService.post(`${this.serviceUrl}/create_new/delete_link_formula_detail`, payload)
    }

    deleteFormulaByAccount(congthuctinhId, account_id){
        const payload = {congthuctinhId, account_id}
        return HttpService.post(`${this.serviceUrl}/create_new/delete`, payload)
    }

    /*
    |--------------------------------------------------------------------------
    | @params array congthuctinhIds = []
    |--------------------------------------------------------------------------
    */
    deleteMultipleFormulaByAccount(congthuctinhIds){
        const payload = {'congthuctinhIds[]' : congthuctinhIds}
        return HttpService.post(`${this.serviceUrl}/create_new/multi_delete`, payload)
    }

    saveFormulaAccount(payload) {
        return HttpService.post(`${this.serviceUrl}/create_new/merge`, payload)
    }

    getLinkFormulaDetail(id) {
        const params = { accountId: id };

        return HttpService.post(`${this.serviceUrl}/create_new/get_link_formula_detail`, params);
    }

    updateLinkFormulaDetail(post) {
        return HttpService.post(`${this.serviceUrl}/create_new/update_link_formula_detail`, post);
    }

    /*
    |--------------------------------------------------------------------------
    | @params array congthuctinhIds = []
    |--------------------------------------------------------------------------
    */
    deleteAccountUseFormula(ids) {
        const payload = { ids: JSON.stringify(ids) };

        return HttpService.post(`${this.serviceUrl}/formula/delete_account_use_formula`, payload);
    }

    validatorFormula(payload) {
        return HttpService.post(`${this.serviceUrl}/formula/validator_formula`, payload)
    }
    
    saveFormula(payload) {
        return HttpService.post(`${this.serviceUrl}/formula/action`, payload)
    }

    relinkFormula(payload) {
        return HttpService.post(`${this.serviceUrl}/formula/relink_formula`, payload);
    }

    deleteFormula(payload) {
        return HttpService.post(`${this.serviceUrl}/formula/delete_formula`, payload);
    }
}

export default new FormulaService()