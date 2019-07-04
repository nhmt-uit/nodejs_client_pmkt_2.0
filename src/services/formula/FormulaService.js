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

    deleteLinkFormulaDetail(congthuctinhId){
        const payload = {congthuctinhId}
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

    validatorFormula(formula_name) {
        const payload = {value: formula_name}
        return HttpService.post(`${this.serviceUrl}/formula/validator_formula`, payload)
    }
    
    saveFormula(payload) {
        return HttpService.post(`${this.serviceUrl}/formula/action`, payload)
    }
}

export default new FormulaService()