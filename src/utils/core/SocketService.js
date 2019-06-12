import io from 'socket.io-client'
import uuidv4 from 'uuid/v4'

import { AppConfig } from 'my-constants';
import { AuthService } from 'my-services/systems'


class SocketService {
    socketUrl = AppConfig.SOCKET_SERVER_URL;

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
    |--------------------------------------------------------------------------
    */
    send(event, args) {
        this.socket.send({___Send: true, event: event, uuid: uuidv4(), args: [args]})

        this.socket.on("message", msg => {return msg})
    }

    get(channel) {
        return new Promise((resolve, reject) => {
            this.socket.on(channel, msg => {
                console.log(msg)
                if (msg) {
                    resolve(msg)
                } else {
                    reject(msg)
                }
            })
        })
    }
    /*
    |--------------------------------------------------------------------------
    | Close connection
    |--------------------------------------------------------------------------
    */
    disconnect() {
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
        });

        // Fire when socket connect ready
        this.socket.on('ready', _ => {
            console.log(">> Websocket is ready")
        });

        // Fire when socket connect error
        this.socket.on('connect_error', function (err) {
            console.log(">> Websocket connect err", err)
        });

        // Fire when socket disconnect error
        this.socket.on('disconnect', function (err) {
            console.log(">> Websocket is disconnected", err)
        });
    }
}

export default new SocketService();
