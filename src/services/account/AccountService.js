import { groupBy as _groupBy } from 'lodash'

import { AppConfig} from 'my-constants'
import { BaseService, HttpService} from 'my-utils/core'

class AccountService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}/account`

    getAccount() {
        return HttpService.post(`${this.serviceUrl}`).then(res => {
            if (res.status) {
                let bankerList = _groupBy(res.res.data.List, 'banker')
                let optBanker = []
                if(bankerList) {
                    for(let x in bankerList) {
                        let groupOtion = []
                        let bankerId, bankerName
                        if(bankerList[x].length !== 0) {
                            groupOtion = bankerList[x].map(item => {
                                bankerId = item.banker
                                bankerName = item.banker_name
                                return { label: item.acc_name.toUpperCase(), value: item.id, bankerId: bankerId}
                            })
                        }
                        optBanker.push({ value: bankerId, label: bankerName.toUpperCase(), options: groupOtion})
                    }
                }
                res.res.data.bankerAccountMap = optBanker
            }
            return res
        })
    }

    deleteAccount(id) {
        const payload = {id: id};
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

    checkLogin(accId) {
        const payload = { accId };

        return HttpService.post(`${this.serviceUrl}/check_login`, payload);
    }
}

export default new AccountService()