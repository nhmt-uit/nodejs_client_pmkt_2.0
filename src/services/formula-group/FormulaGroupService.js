import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class FormulaGroupService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;
    
    getFormulaGroup() {
        return HttpService.post(`${this.serviceUrl}/formula_group`)
    }

    getInitForm() {
        return HttpService.post(`${this.serviceUrl}/formula_group/init_form`)
    }

    getFormulaGroupDetail() {
        return HttpService.post(`${this.serviceUrl}/formula_group_detail`)
    }

    loadFormulaList(banker_id) {
        const payload = {banker_id : banker_id}
        return HttpService.post(`${this.serviceUrl}/formula_group/load_formula_list`, payload)
    }

    validatorFormulaGroupDetail(value) {
        const payload = {'value[name]' : value}
        return HttpService.post(`${this.serviceUrl}/formula_group_detail/validator`, payload)
    }

    saveFormulaGroupDetail(name) {
        const payload = {'name' : name}
        return HttpService.post(`${this.serviceUrl}/formula_group_detail/action`, payload)
    }

    /*
    |--------------------------------------------------------------------------
    | @input: {formula_group_select, formula_select, company}
    |--------------------------------------------------------------------------
    */
    saveFormulaGroup(payload) {
        return HttpService.post(`${this.serviceUrl}/formula_group/action`, payload)
    }
}

export default new FormulaGroupService()