import { BankerActionType } from 'my-constants/action-types'
import BankerService from 'my-services/banker/BankerService'

export const getBanker = () => {
    return (dispatch) => {
        return BankerService.getBanker().then(res => {
            dispatch({
                type: BankerActionType.GET_BANKER,
                payload: res,
            })
        })
    }
}


export const getBankerByMember = () => {
    return (dispatch) => {
        let params = {exclude_banker: true, arr_rs: true}
        return BankerService.getBankerByMember(params).then(res => {
            if(res.status){
                var bankerList = res.res.data.List;
                dispatch({
                    type: BankerActionType.GET_BANKER_BY_MEMBER,
                    bankerList: bankerList,
                })
            }
        })
    }
}