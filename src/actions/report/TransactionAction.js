import { TransactionActionType } from 'my-constants/action-types'
import TransactionService from 'my-services/report/TransactionService'
import {isEmpty as _isEmpty} from "lodash";

export const getAllTransaction = () => {
    return (dispatch) => {
        return TransactionService.getAllTransaction().then(res => {

            dispatch({
                type: TransactionActionType.GET_ALL_TRANSACTION,
                payload: res,
            })
        })
    }
};

export const getCycle = () => {
    return (dispatch) => {
        return TransactionService.getCycle().then(res => {
            if (res.status) {
                const optCycle = res.res.data.List.map(item => {
                    return {value: item.id, label: item.chuky}
                })

                // Dispatch data to reducer
                dispatch({
                    type: TransactionActionType.GET_CYCLE,
                    optCycle: optCycle
                });
            }

        })
    }
};

export const getTypeOfMoney = () => {
    return (dispatch) => {
        return TransactionService.getTypeOfMoney().then(res => {
            if(res.status) {
                const optMoney = res.res.data.map(item => {
                    return {value: item.id, label: item.name}
                })

                dispatch({
                    type: TransactionActionType.GET_TYPE_OF_MONEY,
                    optMoney: optMoney,
                })
            }
        })
    }
};

export const saveTransaction = (post) => {
    return (dispatch) => {
        return TransactionService.saveTransaction(post).then(res => {

            dispatch({
                type: TransactionActionType.SAVE_TRANSACTION,
                post: post,
            })
        })
    }
}

export const delTransaction = (id) => {
    return(dispatch) => {
        return TransactionService.delTransaction(id).then(res =>{

            dispatch({
                type: TransactionActionType.DEL_TRANSACTION,
                id: id,
            })
        })
    }
}

export const getDetailReport = (post) => {
    return(dispatch) => {
        return TransactionService.getDetailReport(post).then(res =>{

            dispatch({
                type: TransactionActionType.GET_DETAIL_REPORT,
                payload: res,
                post: post,
            })
        })
    }
}