class AccountantService {

    processDataFromSocket(payload){
        //Gernate Member Select Options [{value:value, label: label}]
        if (payload && payload.memberMap) {
            let memberOptions = []
            payload.memberMap.map(item => {
                memberOptions.push({label : item.member.fullname, value: item.member.id, id: item.member.id, checked: false, bankerAccount: item.accounts})
            })
            payload['payloadMemberOptions'] = memberOptions
        }

        //Gernate List Banker
        if (payload && payload.bankerMap) {
            let bankerOptions = []
            for(let x in payload.bankerMap) {
                bankerOptions.push({...payload.bankerMap[x], checked: true, collapse: true})
            }
            payload['payloadBanker'] = bankerOptions
            
        }

        //Gernate List Banker Account
        if (payload && payload.scanAccMap) {
            let bankerAccountOptions = []
            for(let x in payload.scanAccMap) {
                bankerAccountOptions.push({...payload.scanAccMap[x], type: null, massage: null, data: null, checked: true, collapse: true})
            }
            payload['payloadBankerAccount'] = bankerAccountOptions
        }


        return payload
    }
}

export default new AccountantService()