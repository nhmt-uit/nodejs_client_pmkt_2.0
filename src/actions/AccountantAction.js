import { AccountantActionType } from 'my-constants/action-types';
import { SocketService, EventsService } from 'my-utils/core';
import { AuthService } from 'my-services/systems'
import { AccountantService }  from 'my-services'

export const socketInitData = (user) => {
    SocketService.connect('/accountant');
    return (dispatch) => {
        EventsService.on('accountant_init', res => {
            if (res) {
                AccountantService.processDataFromSocket(res.data)
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