import moment  from 'moment'
import uuidv4 from 'uuid/v4'
import { get as _get } from 'lodash'

import { AccountantActionType } from 'my-constants/action-types';
import { SocketService, EventsService } from 'my-utils/core';
import { AuthService } from 'my-services/systems'
import { AccountantService }  from 'my-services/account'
import { AppConfig } from 'my-constants'

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const socketInitData = () => {
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
        SocketService.send('init', { username: AuthService.getUsername() })
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
        
        // Active listener before send request
        let listUUID2AccID = {}
        let login_name = AuthService.getUsername()
        let queuesRequest = []
        // let i = 0

        for(let x in params.ids) {
            let uuid = uuidv4()
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
            queuesRequest.push(requestObj)
            console.log(requestObj)
            // SocketService.send('scan', requestObj, uuid)
            // await sleep(200)
            // if (i > 50) break
        }
        console.log(queuesRequest)

        

        // Dispatch data to reducer
        dispatch({
            type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_START,
            request_type: 'accountant_scan_start',
            payload: listUUID2AccID
        });


        EventsService.on('accountant_scan_notify', res => {
            if (res) {
                // Dispatch data to reducer
                dispatch({
                    type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_NOTIFY,
                    request_type: 'accountant_scan_notify',
                    full_payload: res,
                    payload: res.data
                });
            }
        })
        
        EventsService.on('accountant_scan_reject', res => {
            if (res) {
                // Dispatch data to reducer
                dispatch({
                    type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_REJECT,
                    request_type: 'accountant_scan_reject',
                    full_payload: res,
                    payload: res.data
                });
            }
        })

        EventsService.on('accountant_scan_resolve', res => {
            if (res) {
                // Dispatch data to reducer
                dispatch({
                    type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_RESOLVE,
                    request_type: 'accountant_scan_resolve',
                    full_payload: res,
                    payload: res.data
                });
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
| Handle call socket save report
|--------------------------------------------------------------------------
*/
export const socketSaveReport = params => {
    return (dispatch) => {
        for(let x in params.payloadBankerAccount) {
            const requestObj = {
                from_date: params.payloadBankerAccount[x].data.from_date,
                to_date: params.payloadBankerAccount[x].data.to_date,
                dataReportSave: [params.payloadBankerAccount[x].data.reportSave]
            }
            SocketService.send('save_report', requestObj)
        }
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
            payloadDeleteFormula: params,
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