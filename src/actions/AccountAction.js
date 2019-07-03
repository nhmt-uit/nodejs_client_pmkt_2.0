import {get as _get} from 'lodash'
import { AccountActionType } from 'my-constants/action-types';
import { AccountService } from 'my-services/account'



export const requestInitFormData = (bankerAccount) => {
    return (dispatch) => {
        AccountService.initForm(_get(bankerAccount, 'id')).then(res => {
            if (res.status) {
                dispatch({
                    type: AccountActionType.ACCOUNT_INIT_FROM_DATA,
                    initFormData: res.res.data,
                    bankerAccount: bankerAccount
                });
            }
        })
    }
}

export const saveAccount = (payload) => {
    return (dispatch) => {
        AccountService.saveAccount(payload).then(res => {
            console.log(res)
            // if (res.status) {
            //     dispatch({
            //         type: AccountActionType.ACCOUNT_SAVE_FROM_DATA,
            //         initFormData: res.res.data,
            //         bankerAccount: bankerAccount
            //     });
            // }
        })
    }
}