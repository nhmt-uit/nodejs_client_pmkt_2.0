import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class FormulaService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;

    deleteLinkFormulaDetail(congthuctinhId){
        const payload = {congthuctinhId}
        return HttpService.post(`${this.serviceUrl}/create_new/delete_link_formula_detail`, payload)
    }
}

export default new FormulaService()