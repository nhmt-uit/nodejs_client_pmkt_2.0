import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class FormulaService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;
    
    getFormula() {
        return HttpService.post(`${this.serviceUrl}/formula`)
    }

    getFormulaByAccountId(account_id) {
        const payload = {account_id}
        return HttpService.post(`${this.serviceUrl}/create_new/detail`, payload)
    }

    deleteLinkFormulaDetail(congthuctinhId){
        const payload = {congthuctinhId}
        return HttpService.post(`${this.serviceUrl}/create_new/delete_link_formula_detail`, payload)
    }
}

export default new FormulaService()