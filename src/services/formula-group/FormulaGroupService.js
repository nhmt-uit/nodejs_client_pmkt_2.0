import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class FormulaGroupService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;
    
    getFormulaGroup() {
        return HttpService.post(`${this.serviceUrl}/formula_group`)
    }

    delFormulaGroup(payload){
        return HttpService.post(`${this.serviceUrl}/formula_group/delete`, payload)
    }

    delFormulaGroupDetail(payload){
        return HttpService.post(`${this.serviceUrl}/formula_group_detail/delete`, payload)
    }

    getInitForm() {
        return HttpService.post(`${this.serviceUrl}/formula_group/init_form`)
    }

    getFormulaGroupDetail() {
        return HttpService.post(`${this.serviceUrl}/formula_group_detail`)
    }

    /*
    |--------------------------------------------------------------------------
    | @input: {banker_id, formula_group_select}
    |--------------------------------------------------------------------------
    */
    loadFormulaList(payload) {
        return HttpService.post(`${this.serviceUrl}/formula_group/load_formula_list`, payload)
    }

    validatorFormulaGroupDetail(value) {
        const payload = {'value[name]' : value}
        return HttpService.post(`${this.serviceUrl}/formula_group_detail/validator`, payload)
    }

    saveFormulaGroupDetail(payload) {
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

    /*
    |--------------------------------------------------------------------------
    | @input: {formula_group_id, banker_id, f_pattern_id}
    |--------------------------------------------------------------------------
    */
    deleteOneByOne(payload) {
        return HttpService.post(`${this.serviceUrl}/formula_group/delete_one_by_one`, payload)
    }

    /*
    |--------------------------------------------------------------------------
    | @input: {formula_group_id, banker_id, f_pattern_ids: array}
    |--------------------------------------------------------------------------
    */
    multiDelete(payload) {
        return HttpService.post(`${this.serviceUrl}/formula_group/multi_delete`, payload)
    }

    /*
    |--------------------------------------------------------------------------
    | @input: {formula_group_id, banker_id, data: [{isEdit, formulaId, formulaAccountGroupId, random}]}
    |--------------------------------------------------------------------------
    */
    updateListFormula(payload) {
        return HttpService.post(`${this.serviceUrl}/formula_group/update`, payload)
    }
}

export default new FormulaGroupService()