import EventEmitter from 'events'
// const ee = new EventEmitter();
class EventsService extends EventEmitter {
    static instance;

    constructor() {
        super()
        if (this.instance) {
            return this.instance;
        }
        this.instance = new EventEmitter();
    }

    // emit(eventName, msg) {
    //     return this.instance.emit(eventName, msg)
    // }

    // on(eventName, callback) {
    //     return this.instance.on(eventName, msg => {
    //         callback(msg)
    //     })
    // }
    
    // off(eventName, callback = _ => {}) {
    //     console.log("offffffffffffff")
    //     return this.instance.removeAllListeners(eventName)
    // }
}

export default new EventsService()