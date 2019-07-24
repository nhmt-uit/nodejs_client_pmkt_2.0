import { TransactionActionType } from 'my-constants/action-types'
import TransactionService from 'my-services/report/TransactionService'

export const getAllTransaction = () => {
    return (dispatch) => {
        return TransactionService.getAllTransaction().then(res => {
            if(res.status){
                const currencies = res.res.data.List.currencies;
                const listTransaction = res.res.data.List.result;
                dispatch({
                    type: TransactionActionType.GET_ALL_TRANSACTION,
                    currencies: currencies,
                    listTransaction: listTransaction,
                })
            }
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
                formSaveStatus: res.status,
                formSaveResponse: res.res,
            })
        })
    }
}

export const resetFormSaveResponse = (params) => {
    return (dispatch) => {
        dispatch({
            type: TransactionActionType.RESET_FORM_SAVE_RESPONSE_TRANSACTION,
        });
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
            if(res.status){
                const currencyMap = res.res.currencyMap;
                const result = res.res.result;
                const total = res.res.total;

                dispatch({
                    type: TransactionActionType.GET_DETAIL_REPORT,
                    post: post,
                    currencyMap: currencyMap,
                    result: result,
                    total: total,
                })
            }
        })
    }
}