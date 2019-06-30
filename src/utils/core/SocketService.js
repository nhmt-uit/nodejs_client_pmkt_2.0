import io from 'socket.io-client'
import uuidv4 from 'uuid/v4'

import { AppConfig } from 'my-constants'
import { AuthService } from 'my-services/systems'
import EventsService from 'my-utils/core/EventsService'

class SocketService {
    socketUrl = AppConfig.SOCKET_SERVER_URL
    listUUID2Event = {}
    listUUID2AccID = {}
    constructor() {
        this.option = {
            query: `refresh_token=${AuthService.getRefreshToken()}`
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Connect web socket with name space
    |--------------------------------------------------------------------------
    */
    connect(namespace, options = {}) {
        //Inital Socket
        this.option = {...this.option, ...options}
        this.socket = io(this.socketUrl + namespace, this.option).connect()
        
        this.initSocketWatch()
    }

    /*
    |--------------------------------------------------------------------------
    | Method send request to websocket
    | event: init, scan, get_report, get_member
    |--------------------------------------------------------------------------
    */
    send(event, args, uuid) {
        let _uuid = uuid || uuidv4()
        this.listUUID2Event[_uuid] = event

        switch (event) {
            case "init":
                this.socket.send({___Send: true, event: event, uuid: _uuid, args: [args]})
                // Emit channel when first init data
                EventsService.emit('accountant_init', {type: "notify", message: "init_data"})
            break
            case "accountant_manual_init_banker":
                this.socket.send({___Send: true, event: "init", uuid: _uuid, args: [args]})
            break
            case "accountant_manual_scan_form_banker":
                this.socket.send({___Send: true, event: "scan", uuid: _uuid, args: [args]})
            break
            case "accountant_manual_submit_form_banker":
                this.socket.send({___Send: true, event: "scan", uuid: _uuid, args: [args]})
            break
            case "scan":
                this.socket.send({___Send: true, event: event, uuid: _uuid, args: [args]})
                // Map uuid & account_id
            break
            case "get_report":
                this.socket.send({___Send: true, event: event, uuid: _uuid, args: [args]})
                this.listUUID2AccID[_uuid] = args.id
            break
            default: break
        }
    }

    listenerResponse() {
        // Listen response from websocket
        this.socket.on('message', msg => {
            switch (this.listUUID2Event[msg.uuid]) {
                case "init":
                    EventsService.emit('accountant_init', msg)
                break
                case "accountant_manual_init_banker":
                    EventsService.emit('accountant_manual_init', msg)
                break
                case "accountant_manual_scan_form_banker":
                    EventsService.emit('accountant_manual_scan_form_banker', msg)
                break
                case "accountant_manual_submit_form_banker":
                    EventsService.emit('accountant_manual_submit_form_banker', msg)
                break
                case "scan":
                    if (msg.type === "notify")
                        EventsService.emit('accountant_scan_notify', msg)
                    if (msg.type === "reject")
                        EventsService.emit('accountant_scan_reject', msg)
                    if (msg.type === "resolve")
                        EventsService.emit('accountant_scan_resolve', msg)
                break
                case "stop":
                    EventsService.emit('accountant_scan_stop', msg)
                break
                case "reloadAccInfo":
                    EventsService.emit('accountant_reload_banker_account_info', msg)
                break
                case "get_report":
                    //Emit chanel when receive data of bankerACcount
                    if(msg.data.hasOwnProperty("accountant") && msg.data.hasOwnProperty("dataFieldList") && msg.data.hasOwnProperty("formulaFieldList"))
                        EventsService.emit('accountant_get_report_banker_account', {...msg, uuid2AccId: this.listUUID2AccID})
                break
                case "get_member":
                break
                default: break
            }
        })
    }

    unListenerResponse() {
        // this.socket.off('message')
        EventsService.removeAllListeners('accountant_init')
        EventsService.removeAllListeners('accountant_scan_notify')
        EventsService.removeAllListeners('accountant_scan_reject')
        EventsService.removeAllListeners('accountant_scan_resolve')
        EventsService.removeAllListeners('accountant_reload_banker_account_info')
        EventsService.removeAllListeners('accountant_get_report_banker_account')
        // EventsService.removeAllListeners('accountant_scan_stop')
    }

    /*
    |--------------------------------------------------------------------------
    | Method get response to websocket
    |--------------------------------------------------------------------------
    */
    get(channel, callback) {
        this.socket.on(channel, msg => {
            callback(msg)
        })
    }
    /*
    |--------------------------------------------------------------------------
    | Close connection
    |--------------------------------------------------------------------------
    */
    disconnect() {
        // Reset variable
        this.listUUID2Event = {}
        this.listUUID2AccID = {}
        this.socket.off('connect')
        this.socket.off('ready')
        this.socket.off('connect_error')
        this.socket.off('disconnect')
        this.socket.off('message')
        this.socket.disconnect()
        this.socket = null

        this.unListenerResponse()
    }

    /*
    |--------------------------------------------------------------------------
    | Notify websocket connect status
    |--------------------------------------------------------------------------
    */
    initSocketWatch() {
        // Fire when socket connect successfully
        this.socket.on('connect', _ => {
            console.log(">> Websocket connected successfully", this.socket)
        })

        // Fire when socket connect ready
        this.socket.on('ready', _ => {
            console.log(">> Websocket is ready")
        })

        // Fire when socket connect error
        this.socket.on('connect_error', function (err) {
            console.log(">> Websocket connect err", err)
        })

        // Fire when socket disconnect error
        this.socket.on('disconnect', function (err) {
            console.log(">> Websocket is disconnected", err)
        })
    }
}

export default new SocketService()
