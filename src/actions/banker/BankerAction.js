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