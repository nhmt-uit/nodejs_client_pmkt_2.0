import { AppConfig} from 'my-constants'
import { BaseService, HttpService} from 'my-utils/core'

class AccountService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/account`

    getMember() {
        return HttpService.post(`${this.serviceUrl}`)
    }

    deleteAccount(id) {
        const payload = {id: id}
        return HttpService.post(`${this.serviceUrl}/delete_account`, payload)
    }

    initForm(exceptId) {
        const payload = {exceptId: exceptId}
        return HttpService.post(`${this.serviceUrl}/init_form`, payload)
    }

    saveAccount(payload) {
        return HttpService.post(`${this.serviceUrl}/action`, payload)
    }

    /*
    |--------------------------------------------------------------------------
    | @input : { value[acc_name], value[banker_id], except[acc_name], except[banker_id]}
    |--------------------------------------------------------------------------
    */
    validatorAccount(payload) {
        return HttpService.post(`${this.serviceUrl}/validator_account`, payload)
    }
}

export default new AccountService()