import { AppConfig} from 'my-constants';
import { BaseService, HttpService} from 'my-utils/core';

class BankerService extends BaseService {
    serviceUrl = `${AppConfig.API_URL}`;

    getBanker(){
        return HttpService.post(`${this.serviceUrl}/company_config`)
    }

    getBankerByMember(payload){
        return HttpService.post(`${this.serviceUrl}/banker/get`, payload)
    }

    getFlagType(bankerName) {
        bankerName = bankerName.toLowerCase()
        let flagType = [
            {bankerName: 'bong88', account_role: [], flag_type: [{value: 1, label: 'SB-CSN-LOTO-RACING-BF'}]},
            {bankerName: 'abet', account_role: [], flag_type: [{value: 1, label: 'SB-CSN-LOTO-RACING-BF'}]},
            {bankerName: 's1288', account_role: [{value: 0, label: 'Sub'}, {value: 1, label: 'Admin Sub'}], flag_type: [{value: 1, label: 'CF-CSN-RACING-MMA'}]},
            {bankerName: 'pinbet88', account_role: [], flag_type: [{value: 1, label: 'SB & VS & GGL & RNG'}]},
            {bankerName: 'sbobet', account_role: [], flag_type: [{value: 1, label: 'SB & CSN & GAMES-XS & RACING & ESB'}]},
            {bankerName: 'asbobet', account_role: [], flag_type: [{value: 1, label: 'SB & CSN & GAMES-XS & RACING & ESB'}]},
            {bankerName: 'cft3388', account_role: [], flag_type: [{value: 1, label: 'CF & WFC'}]},
            {bankerName: 'sv388', account_role: [], flag_type: [{value: 1, label: 'Cam & phi & sexy-jdb-jdbf & venus'}]},
            {bankerName: 'new789', account_role: [], flag_type: [{value: 2, label: 'LOTO-CSN'}]},
        ]

        let notExistedBanker = flagType.filter(item => item.bankerName === bankerName)
        if(notExistedBanker.length === 0) {
            if (['ld789', 'ldbong88', 'sgd777', 'ok368', 'edy688', '3king', 'sgs889'].indexOf(bankerName) === -1) {
                flagType.push({bankerName: bankerName, account_role: [], flag_type: [{value: 1, label: 'SB-CSN'}]})
            } else {
                flagType.push({bankerName: bankerName, account_role: [], flag_type: []})
            }
        }

        flagType = flagType.map(item => {
            if (['sbc168', 'new789'].indexOf(bankerName) === -1) {
                item.flag_type.unshift({value: 0, label: 'All'})
            }
            return item
        })

        return flagType.find(item => item.bankerName === bankerName)
    }
}

export default new BankerService()