import moment  from 'moment'
import uuidv4 from 'uuid/v4'
import { get as _get, isEmpty as _isEmpty } from 'lodash'

import { AccountantActionType } from 'my-constants/action-types';
import { SocketService, EventsService } from 'my-utils/core';
import { AuthService } from 'my-services/systems'
import { AccountantService }  from 'my-services/account'
import { AppConfig } from 'my-constants'
import { Helpers } from 'my-utils'



const timeWaitToDispatch = 1000
const firstNumberPayloadSend = 50

export const socketInitData = (params) => {
    SocketService.connect('/accountant')
    return (dispatch) => {
        EventsService.on('accountant_init', res => {
            if (res) {
                res.data = AccountantService.processDataFromSocket(res.data)
                // Unscrubscripe chanel 'accountant_init' when finish & disconnect socket
                if (res.type === "resolve") {
                    EventsService.removeAllListeners('accountant_init')
                    //Unsubscribe channel
                    SocketService.unListenerResponse()
                }

                // Dispatch data to reducer
                dispatch({
                    type: AccountantActionType.ACCOUNTANT_SOCKET_INIT_DATA,
                    request_type: 'accountant_init',
                    full_payload: res,
                    payload: res.data
                });

                // Dispatch toggle banker
                dispatch({
                    type: AccountantActionType.ACCOUNTANT_TOGGLE_BANKER,
                    type_toggle: 'default',
                    payload: res.data
                });
            }
        })
                
        // Active listener before send request
        SocketService.listenerResponse()

        let objInit = { username: AuthService.getUsername() }
        if(!_isEmpty(params) && params.type === "manual") {
            objInit.type = "home"
            objInit.bankerName = params.bankerName
        }

        SocketService.send('init', objInit)
    }
};

/*
|--------------------------------------------------------------------------
| Action scan data via websocket
| @params {from_date, to_date, id (account_id), more_post: {login_name (current_username)}}
|--------------------------------------------------------------------------
*/
export const socketScanData = (params) => {
    return async (dispatch) => {
        let from_date = moment(params.from_date).format(AppConfig.FORMAT_DATE)
        let to_date = moment(params.to_date).format(AppConfig.FORMAT_DATE)

        let filterBankerAccount = _get(params, 'filterBankerAccount')
        
        // Active listener before send request
        let listUUID2AccID = {}
        let login_name = AuthService.getUsername()
        let queuesRequest = []
        let queuesAccountLock = []
        let i = 0
        for(let x in params.ids) {
            let uuid = uuidv4()
            i++

            // Check account is_active != false
            if(!_isEmpty(filterBankerAccount)) {
                const bankerAccount = filterBankerAccount.find(item => item.id === params.ids[x])
                if(!_isEmpty(bankerAccount) && bankerAccount.is_active === false) {
                    queuesAccountLock.push(bankerAccount)
                    continue
                }
            }

            listUUID2AccID[uuid] = params.ids[x]
            // listUUID2AccID[uuid] = '5a701ca320fd7e9eb445e37e'
            const requestObj = {
                from_date: from_date,
                to_date: to_date,
                id: params.ids[x],
                // id: '5a701ca320fd7e9eb445e37e',
                more_post: {
                    login_name: login_name
                }
            }

            if (typeof params.more_post !== "undefined") requestObj.more_post = params.more_post

            // Incase Accountant Manual
            if(!_isEmpty(params.bankerName)) {
                if (typeof params.flagType !== "undefined") requestObj.more_post.flag_type = `${params.flagType}`
                if (typeof params.accountRole !== "undefined") requestObj.more_post.is_sub = `${params.accountRole}`
                requestObj.more_post.is_scan_by_hand = true
            }

            queuesRequest.push({uuid: uuid, arg: requestObj})

            // First send package to websocket
            if (i <= firstNumberPayloadSend) {
                let item = queuesRequest.shift()
                if(!_isEmpty(item)) {
                    SocketService.send('scan', item.arg, item.uuid)
                }
            }
        }
        
        // Dispatch data to reducer
        dispatch({
            type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_START,
            request_type: 'accountant_scan_start',
            payload: listUUID2AccID
        });

        
        if(!_isEmpty(queuesAccountLock)) {
            dispatch({
                type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_ACCOUNT_LOCK,
                payload: queuesAccountLock
            });
        }

        let payloadNotify = []
        EventsService.on('accountant_scan_notify', async res => {
            if (res) {
                payloadNotify.push(res)
                await Helpers.sleep(timeWaitToDispatch)
                // Dispatch data to reducer
                if(payloadNotify.length !== 0 ) {
                    dispatch({
                        type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_NOTIFY,
                        request_type: 'accountant_scan_notify',
                        payload: payloadNotify
                        // full_payload: res,
                        // payload: res.data
                    });
                    
                    payloadNotify = []
                }
            }
        })
        
        let payloadReject = []
        EventsService.on('accountant_scan_reject', async res => {
            if (res) {
                let item = queuesRequest.shift()
                if(!_isEmpty(item)) SocketService.send('scan', item.arg, item.uuid)

                payloadReject.push(res)
                await Helpers.sleep(timeWaitToDispatch * 2)
                // Dispatch data to reducer
                if(payloadReject.length !== 0 ) {
                    dispatch({
                        type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_REJECT,
                        request_type: 'accountant_scan_reject',
                        payload: payloadReject
                        // full_payload: res,
                        // payload: res.data
                    });
                    
                    payloadReject = []
                }
            }
        })

        let payloadResolve = []
        EventsService.on('accountant_scan_resolve',async res => {
            if (res) {
                let item = queuesRequest.shift()
                if(!_isEmpty(item)) SocketService.send('scan', item.arg, item.uuid)

                payloadResolve.push(res)
                await Helpers.sleep(timeWaitToDispatch)
                // Dispatch data to reducer
                if(payloadResolve.length !== 0 ) {
                    dispatch({
                        type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_RESOLVE,
                        request_type: 'accountant_scan_resolve',
                        payload: payloadResolve
                        // full_payload: res,
                        // payload: res.data
                    });
                    
                    payloadResolve = []
                }
            }
        })
    }
};

/*
|--------------------------------------------------------------------------
| Stop send request scan data
|--------------------------------------------------------------------------
*/
export const socketStopScanData = (params) => {
    return (dispatch) => {
        // Active listener before send request
        for(let x in params.ids) {
            SocketService.send('stop', {id: params.ids[x]})
        }
        //Unsubscribe channel
        SocketService.unListenerResponse()
        // Dispatch toggle banker
        // EventsService.on('accountant_scan_stop', res => {
        //     if (res) {
        //         console.log(res)
                // Dispatch data to reducer
                dispatch({
                    type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_STOP,
                    request_type: 'accountant_scan_stop',
                    bankerAccountIds: params.ids,
                    // full_payload: res,
                    // payload: res.data
                });
            // }
        // })
    }
}

/*
|--------------------------------------------------------------------------
| Handle call socket reload banker account info
| @input: bankerAccountId & scanData
|--------------------------------------------------------------------------
*/
export const socketReloadBankerAccountInfo = params => {
    return (dispatch) => {
        EventsService.on('accountant_reload_banker_account_info', res => {
            if (res) {
                // Dispatch data to reducer
                dispatch({
                    type: AccountantActionType.ACCOUNTANT_SOCKET_RELOAD_BANKER_ACCOUNT_INFO,
                    full_payload: res,
                    payload: res.data
                });
            }
        })
        SocketService.send('reloadAccInfo', {id: params.id})
    }
}
/*
|--------------------------------------------------------------------------
| Handle call socket reload result scan based on banker account
| @input: bankerAccountId & scanData
|--------------------------------------------------------------------------
*/
export const socketGetReport = params => {
    return (dispatch) => {
        EventsService.on('accountant_get_report_banker_account', res => {
            if (res) {
                // Unscrubscripe chanel 'accountant_init' when finish & disconnect socket
                if (res.type === "resolve") {
                    EventsService.removeAllListeners('accountant_get_report_banker_account')
                }
                console.log(res)
                // Dispatch data to reducer
                dispatch({
                    type: AccountantActionType.ACCOUNTANT_SOCKET_GET_REPORT_BANKER_ACCOUNT,
                    full_payload: res,
                    payload: res.data,
                    uuid2AccId: res.uuid2AccId
                });
            }
        })
        SocketService.send('get_report', {id: params.id, scanData: params.scanData})
    }
}


/*
|--------------------------------------------------------------------------
| Handle Toogle isOpen Collapse Account Of Banker
|--------------------------------------------------------------------------
*/
export const collapseBanker = (type, bankerId) => {
     // Dispatch toggle banker
    return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_TOGGLE_COLLAPSE_BANKER_ACCOUNT,
            type_collapse: type,
            bankerId: bankerId
        });
    }
}


export const collapseBankerAccount = (bankerAccountId) => {
    // Dispatch toggle banker
   return (dispatch) => {
       dispatch({
           type: AccountantActionType.ACCOUNTANT_COLLAPSE_BANKER_ACCOUNT,
           bankerAccountId: bankerAccountId
       });
   }
}

/*
|--------------------------------------------------------------------------
| Handle Toogle toggle check banker
|--------------------------------------------------------------------------
*/
export const checkBanker = bankerId => {
    // Dispatch toggle banker
    return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_TOGGLE_COLLAPSE_BANKER_ACCOUNT,
            bankerId: bankerId
        });
   }
}

/*
|--------------------------------------------------------------------------
| Handle Toogle toggle check banker account
|--------------------------------------------------------------------------
*/
export const checkBankerAccount = (type_check, params) => {
    // Dispatch toggle banker
    return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_TOGGLE_CHECK_BANKER_ACCOUNT,
            type_check: type_check,
            isCheckAll: _get(params, 'isCheckAll', null),
            memberIds: _get(params, 'memberId', []),
            bankerId: _get(params, 'bankerId', null),
            bankerAccountId: _get(params, 'bankerAccountId', null),
            payloadBankerAccount: _get(params, 'payloadBankerAccount', [])
        });
    }
}

/*
|--------------------------------------------------------------------------
| Remove Banker Account
|--------------------------------------------------------------------------
*/
export const deleteBankerAccount = item => {
    return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_DELETE_BANKER_ACCOUNT,
            item: item,
        });
    }
}

export const toggleModalDeleteFormula = params => {
    return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_TOGGLE_MODAL_DELETE_FORMULA,
            payloadSelectedFormula: params,
        });
    }
}

export const toggleModalFormFormula = params => {
    return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_TOGGLE_MODAL_FROM_FORMULA,
            payloadSelectedFormula: params,
        });
    }
}

/*
|--------------------------------------------------------------------------
| Filter result with formula
|--------------------------------------------------------------------------
*/
export const toggleShowAllFormula = (type, bankerId) => {
    // Dispatch toggle banker
    return (dispatch) => {
       dispatch({
           type: AccountantActionType.ACCOUNTANT_TOGGLE_SHOW_ALL_FORMULA,
           type_collapse: type,
           bankerId: bankerId
       });
   }
}

export const toggleShowHideBankerAccountChild = params => {
    return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_TOGGLE_SHOW_HIDE_BANKER_ACCOUNT_CHILD,
            bankerAccountId: _get(params, 'bankerAccountId', null),
            username: _get(params, 'username', [])
        });
    }
}

export const resetWhenChangeDate = _ => {
    return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_RESET_WHEN_CHANGE_DATE,
        });
    }
}


export const resetStore = _ => {
    return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_RESET_STORE,
        });
    }
}