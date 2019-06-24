import { AppConfig} from 'my-constants'
import { BaseService, HttpService} from 'my-utils/core'

class AccountService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/account`

    deleteAccount(id) {
        const payload = {id: id}
        return HttpService.post(`${this.serviceUrl}/delete_account`, payload)
    }

    initForm(exceptId) {
        const payload = {exceptId: exceptId}
        return HttpService.post(`${this.serviceUrl}/init_form`, payload)
    }
}

export default new AccountService()