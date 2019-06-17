import { AccountantActionType } from 'my-constants/action-types';
import { SocketService, EventsService } from 'my-utils/core';
import { AuthService } from 'my-services/systems'
import { AccountantService }  from 'my-services'

export const socketInitData = () => {
    SocketService.connect('/accountant')
    return (dispatch) => {
        EventsService.on('accountant_init', res => {
            if (res) {
                AccountantService.processDataFromSocket(res.data)
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
            }
        })
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
        EventsService.on('accountant_scan', res => {
            if (res) {
                // Dispatch data to reducer
                dispatch({
                    type: AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA,
                    request_type: 'accountant_scan',
                    full_payload: res,
                    payload: res.data
                });
            }
        })
        const mockObj = {
            from_date: '06/10/2019',
            to_date: '06/16/2019',
            id: '5b6864d7787dcb61d7285b57',
            more_post: {
                login_name: "av8896"
            }
        }
        SocketService.send('scan', mockObj)
    }
};