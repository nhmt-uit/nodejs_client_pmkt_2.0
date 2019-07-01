import { get as _get } from 'lodash'

import { AccountantManualActionType } from 'my-constants/action-types';
import { SocketService, EventsService } from 'my-utils/core';
import { AuthService } from 'my-services/systems'


export const socketAccountantManualResetData = params => {
    return (dispatch) => {
        // Dispatch data to reducer
        dispatch({
            type: AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_INIT_DATA,
        });
    }
}

export const socketAccountantManualInitData = params => {
    SocketService.connect('/accountant')
    return (dispatch) => {
        // Send request get bankerID
        EventsService.on('accountant_manual_init', res => {
            if (res) {
                if (res.type === "resolve") {
                    //Send request to get data form login
                    try {

                        const bankerId = Object.keys(res.data.scanAccMap)[0]
                        const banker = res.data.bankerMap[Object.keys(res.data.bankerMap)[0]]
                        banker.bankerSocketRequestId = bankerId
                        SocketService.send('accountant_manual_scan_form_banker', { id: bankerId, more_post: {get_login_info: true, is_scan_by_hand: true} })
                        EventsService.removeAllListeners('accountant_manual_init')

                        // Dispatch data to reducer
                        dispatch({
                            type: AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_GET_BANKER_DATA,
                            banker: banker
                        });

                    }  catch (e) {
                        console.log(e)
                    }
                }
            }
        })

        // Send request get form data
        EventsService.on('accountant_manual_scan_form_banker', res => {
            if (res) {
                if(res.type === "resolve") {
                    // Dispatch data to reducer
                    dispatch({
                        type: AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_SCAN_FORM_BANKER,
                        full_payload: res,
                        payload: res.data,
                        isRenderFinish: true
                    });
                }

                if(res.type === "reject") {
                    // Dispatch data to reducer
                    dispatch({
                        type: AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_SCAN_FORM_BANKER,
                        full_payload_reject: res,
                        payload_reject: res.data,
                        isRenderFinish: true
                    });
                }

                EventsService.removeAllListeners('accountant_manual_scan_form_banker')
            }
        })
                
        // Active listener before send request
        SocketService.listenerResponse()
        SocketService.send('accountant_manual_init_banker', { username: AuthService.getUsername(), bankerName: params.bankerName, type: "login" })
    }
};


export const socketAccountantManualGetFromData = params => {
    return (dispatch) => {
        // Send request get form data
        EventsService.on('accountant_manual_scan_form_banker', res => {
            if (res) {
                if(res.type === "resolve") {
                    // Dispatch data to reducer
                    dispatch({
                        type: AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_SCAN_FORM_BANKER,
                        full_payload: res,
                        payload: res.data,
                        isRenderFinish: true
                    });
                    EventsService.removeAllListeners('accountant_manual_scan_form_banker')
                }
            }
        })

        dispatch({
            type: AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_SCAN_FORM_BANKER,
            isRenderFinish: false
        });

        SocketService.send('accountant_manual_scan_form_banker', { id: params.bankerId, more_post: {get_login_info: true, is_scan_by_hand: true} })
    }
}

export const socketAccountantManualSubmitFromData = params => {
    return (dispatch) => {
        // Send request get form data
        EventsService.on('accountant_manual_submit_form_banker', res => {
            if (res) {
                if(res.type === "resolve") {
                    // Dispatch data to reducer
                    dispatch({
                        type: AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_SUBMIT_FORM_BANKER,
                        full_payload: res,
                        payload: res.data,
                        isRenderFinish: true
                    });
                }


                EventsService.removeAllListeners('accountant_manual_submit_form_banker')
            }
        })

        dispatch({
            type: AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_SUBMIT_FORM_BANKER,
            isRenderFinish: false
        });
        /*
        |--------------------------------------------------------------------------
        | Submit form
        |--------------------------------------------------------------------------
        */
        const arg = {
            id: params.bankerId,
            more_post: {
                is_scan_by_hand: true,
                post: params.post,
                session: params.session,
                sub_user: _get(params, 'sub_user', null),
                sub_pass: _get(params, 'sub_pass', null),
                sub_code: _get(params, 'sub_code', null),
                captcha: _get(params, 'captcha', null),
            }
        }
        SocketService.send('accountant_manual_submit_form_banker', arg)
    }
}