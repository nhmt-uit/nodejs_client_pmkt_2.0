import { filter as _filter } from 'lodash'

class AccountantService {

    processDataFromSocket(payload){
        //Gernate Member Select Options [{value:value, label: label}]
        if (payload && payload.memberMap) {
            let memberOptions = []
            let memberAccountOptions = {}
            payload.memberMap.map(item => {
                memberOptions.push({label : item.member.fullname, value: item.member.id})

                //Map member & account
                memberAccountOptions[item.member.id] = []
                item.accounts.map(acc => {
                    memberAccountOptions[item.member.id].push(acc.id)
                })
            })
            payload['memberOptionsProcessed'] = memberOptions
            payload['memberAccountMap'] = memberAccountOptions
        }

        //Gernate List Banker & Account
        if (payload && payload.bankerMap) {
            let listBanker = []
            let bankerAccountOptions = {}
            for(let x in payload.bankerMap) {
                let objBanker = {
                    id: payload.bankerMap[x].id,
                    name: payload.bankerMap[x].name,
                    listAccounts: []
                }
                if (payload.scanAccMap) {
                    objBanker.listAccounts = _filter(payload.scanAccMap, ['banker', payload.bankerMap[x].id])
                }
                listBanker.push(objBanker)

                //Map banker & account
                bankerAccountOptions[objBanker.id] = []
                objBanker.listAccounts.map(acc => {
                    bankerAccountOptions[objBanker.id].push(acc.id)
                })
            }
            payload['listBankerProcessed'] = listBanker
            payload['bankerAccountMap'] = bankerAccountOptions
        }
        return payload
    }
}

export default new AccountantService()