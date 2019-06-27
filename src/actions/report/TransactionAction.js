import { TransactionActionType } from 'my-constants/action-types'
import TransactionService from 'my-services/report/TransactionService'

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

            dispatch({
                type: TransactionActionType.GET_CYCLE,
                payload: res,
            })
        })
    }
};

export const getTypeOfMoney = () => {
    return (dispatch) => {
        return TransactionService.getTypeOfMoney().then(res => {

            dispatch({
                type: TransactionActionType.GET_TYPE_OF_MONEY,
                payload: res,
            })
        })
    }
};

export const saveTransaction = (post) => {
    console.log("POST", post)
    return (dispatch) => {
        return TransactionService.saveTransaction(post).then(res => {

            dispatch({
                type: TransactionActionType.SAVE_TRANSACTION,
                post: post,
            })
        })
    }
}