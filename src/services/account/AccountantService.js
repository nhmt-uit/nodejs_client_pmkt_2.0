import { sortBy as _sortBy } from 'lodash'

class AccountantService {

    processDataFromSocket(payload){
        //Gernate Member Select Options [{value:value, label: label}]
        if (payload && payload.memberMap) {
            let memberOptions = []
            payload.memberMap.map(item => {
                memberOptions.push({label : item.member.fullname, value: item.member.id, id: item.member.id, checked: false, bankerAccount: item.accounts})
            })
            payload['payloadMemberOptions'] = _sortBy(memberOptions, [o => o.label.toLowerCase()])
        }

        //Gernate List Banker Account
        let bankerCheckedList = {}
        if (payload && payload.scanAccMap) {
            let bankerAccountOptions = []
            for(let x in payload.scanAccMap) {
                const bankerAccountChecked = payload.scanAccMap[x].checked === 1 ? true : false

                if (bankerAccountChecked === false) {
                    bankerCheckedList[payload.scanAccMap[x].banker] = false
                }

                bankerAccountOptions.push({...payload.scanAccMap[x], type: null, message: null, data: null, checked: bankerAccountChecked, collapse: true})
            }
            payload['payloadBankerAccount'] = _sortBy(bankerAccountOptions, [o => o.acc_name.toLowerCase()])
        }

        //Gernate List Banker
        if (payload && payload.bankerMap) {
            let bankerOptions = []
            for(let x in payload.bankerMap) {
                const bankerChecked = bankerCheckedList[payload.bankerMap[x].id] === false ? false : true
                bankerOptions.push({...payload.bankerMap[x], checked: bankerChecked, collapse: true})
            }
            payload['payloadBanker'] = _sortBy(bankerOptions, [o => o.name.toLowerCase()])
        }


        return payload
    }

    /*
    |--------------------------------------------------------------------------
    | Describe dynamic column table scan result
    |--------------------------------------------------------------------------
    */
    getDynamicColumn() {
        return [
            {key: 'turnover', value: 'turnover'},
            {key: 'turnoverTT', value: 'turnovertt'},
            {key: 'net_turnover', value: 'net_turnover'},
            {key: 'gross_comm', value: 'grosscomm'},
            {key: 'member_comm', value: 'membercomm'},
            {key: 'win_loss', value: 'win_loss'},
            {key: 'company', value: 'Company'},
            {key: 'ma_total', value: 'ma_total'},
            {key: 'payout', value: 'Payout'},
            {key: 'master_total', value: 'master_total'},
            {key: 'outstanding', value: 'outstanding'},
        ]
    }
}

export default new AccountantService()