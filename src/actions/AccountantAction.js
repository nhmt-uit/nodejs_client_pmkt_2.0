import moment  from 'moment'
import uuidv4 from 'uuid/v4'

import { AccountantActionType } from 'my-constants/action-types';
import { SocketService, EventsService } from 'my-utils/core';
import { AuthService } from 'my-services/systems'
import { AccountantService }  from 'my-services'
import { AppConfig } from 'my-constants'

export const socketInitData = () => {
    SocketService.connect('/accountant')
    return (dispatch) => {
        EventsService.on('accountant_init', res => {
            if (res) {
                res.data = AccountantService.processDataFromSocket(res.data)
                // Unscrubscripe chanel 'accountant_init' when finish & disconnect socket
                if (res.type === "resolve") {
                    EventsService.removeAllListeners('accountant_init')
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
    // SocketService.connect('/accountant')
    return (dispatch) => {
        let from_date = moment(params.from_date).format(AppConfig.FORMAT_DATE)
        let to_date = moment(params.to_date).format(AppConfig.FORMAT_DATE)
        
        // Active listener before send request
        let listUUID2AccID = {}
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
                    login_name: AuthService.getUsername()
                }
            }
            SocketService.send('scan', requestObj, uuid)
        }

        

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
| Handle Toogle isOpen Collapse Account Of Banker
|--------------------------------------------------------------------------
*/
export const collapseBanker = bankerId => {
     // Dispatch toggle banker
    return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_TOGGLE_BANKER,
            type_toggle: 'on_change',
            bankerId: bankerId
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
            type: AccountantActionType.ACCOUNTANT_TOGGLE_CHECK_BANKER,
            bankerId: bankerId
        });
   }
}

/*
|--------------------------------------------------------------------------
| Handle Toogle toggle check banker account
|--------------------------------------------------------------------------
*/
export const checkBankerAccount = (bankerId, bankerAccountId) => {
    // Dispatch toggle banker
   return (dispatch) => {
        dispatch({
            type: AccountantActionType.ACCOUNTANT_TOGGLE_CHECK_BANKER_ACCOUNT,
            bankerId: bankerId,
            bankerAccountId: bankerAccountId
        });
   }
}