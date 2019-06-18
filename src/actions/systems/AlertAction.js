import { AlertActionType} from 'my-constants/action-types'
import AlertService from 'my-services/systems/AlertService'

export const getAlert = () => {
    return (dispatch) => {
        return AlertService.getAlert().then(res => {
            dispatch({
                type: AlertActionType.GET_ALERT,
                payload: res,
            })
        })
    }
}