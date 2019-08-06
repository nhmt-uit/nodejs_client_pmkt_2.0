import { HostManageActionType } from 'my-constants/action-types'
import HostManageService from 'my-services/host/HostManageService'

export const getHostManage = () => {
    return (dispatch) => {
        return HostManageService.getHostManage().then( res => {
            if(res.status){
                var bankerList = res.res.data.bankerList;
                var dataList = res.res.data.dataList;
                var optBanker = bankerList.map(item => {
                    return {value: item.id, label: item.name.toUpperCase()}
                })
                dispatch({
                    type: HostManageActionType.GET_HOST_MANAGE,
                    bankerList: bankerList,
                    optBanker: optBanker,
                    dataList: dataList,
                })
            }
        })
    }
}

export const delHostManage = (post) => {
    return (dispatch) => {
        return HostManageService.delHostManage(post).then( res => {
            dispatch({
                type: HostManageActionType.DEL_HOST_MANAGE,
            })
        })
    }
}

export const saveHostManage = (post) => {
    return (dispatch) => {
        return HostManageService.saveHostManage(post).then( res => {
            dispatch({
                type: HostManageActionType.SAVE_HOST_MANAGE,
                formSaveStatus: res.status,
                formSaveResponse: res.res,
            })
        })
    }
}

export const resetFormSaveResponse = () => {
    return (dispatch) => {
        dispatch({
            type: HostManageActionType.RESET_FORM_SAVE_RESPONSE,
        })
    }
}