import { InfoUserActionType } from 'my-constants/action-types'
import InfoUserService from 'my-services/infoUser/InfoUserService'

export const getInfoUser = () => {
    return (dispatch) => {
        return InfoUserService.getInfoUser().then(res => {
            dispatch({
                type: InfoUserActionType.GET_INFO_USER,
                payload: res,
            })
        })
    }
}