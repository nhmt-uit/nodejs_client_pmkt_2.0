import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class FormulaGroupService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;
    
    getFormulaGroup() {
        return HttpService.post(`${this.serviceUrl}/formula_group`)
    }
}

export default new FormulaGroupService()