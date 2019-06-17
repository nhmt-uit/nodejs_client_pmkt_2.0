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
    send(event, args) {
        let uuid = uuidv4()
        this.listUUID2Event[uuid] = event
        this.socket.send({___Send: true, event: event, uuid: uuid, args: [args]})

        
        switch (event) {
            case "init":
                // Emit channel when first init data
                EventsService.emit('accountant_init', {type: "notify", message: "init_data"})
            break
            case "scan":
                // Map uuid & account_id
                this.listUUID2AccID[uuid] = args.id
                console.log(this.listUUID2AccID)
            break
            default: break
        }

        // Listen response from websocket
        this.socket.on('message', msg => {
            switch (this.listUUID2Event[msg.uuid]) {
                case "init":
                    console.log("init")
                    EventsService.emit('accountant_init', msg)
                break
                case "scan":
                    EventsService.emit('accountant_scan', msg)
                break
                case "get_report":
                break
                case "get_member":
                break
                default: break
            }
        })

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
        this.socket.disconnect()
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
