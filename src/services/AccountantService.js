import { filter } from 'lodash'

class AccountantService {

    processDataFromSocket(payload){
        //Gernate Member Select Options [{value:value, label: label}]
        if (payload && payload.memberMap) {
            let memberOptions = payload.memberMap.map(item => {
                return {label : item.member.fullname, value: item.member.id, bankerAccount: item.accounts}
            })
            payload['memberOptionsProcessed'] = memberOptions
        }

        //Gernate List Banker & Account
        if (payload && payload.bankerMap) {
            let listBanker = []
            for(let x in payload.bankerMap) {
                let objBanker = {
                    id: payload.bankerMap[x].id,
                    name: payload.bankerMap[x].name,
                    listAccounts: []
                }
                if (payload.scanAccMap) {
                    objBanker.listAccounts = filter(payload.scanAccMap, ['banker', payload.bankerMap[x].id])
                }
                listBanker.push(objBanker)
            }
            payload['listBankerProcessed'] = listBanker
        }
        return payload
    }
}

export default new AccountantService()