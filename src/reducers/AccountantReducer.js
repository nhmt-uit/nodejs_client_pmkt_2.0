import { map as _map} from 'lodash'
import { AccountantActionType } from 'my-constants/action-types'

let defaultState = {
	request_type: null,
	full_payload: null,
	payload: null
}

let toggleBankerAccountState = {
	bankerAccount: {},
	isOpenBanker: {},
	isCheckBanker: {},
	isCheckBankerAccount: {},
}


let defaultScanState = {
	uuidBankerAccountMap: null,
	request_type: null,
	full_payload: null,
	payload: null,
	payload_notify: null
}

export const AccountantReducer = (state = defaultState, action) => {
	switch(action.type){
		case AccountantActionType.ACCOUNTANT_SOCKET_INIT_DATA:
			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload}
		default:
			return {...state}
	}
}

export const AccountantToggleReducer = (state = toggleBankerAccountState, action) => {
	let objToggleBanker, objIsCheckBanker, objIsCheckBankerAccount, objBankerAccount
	switch(action.type){
		case AccountantActionType.ACCOUNTANT_TOGGLE_BANKER:
			objToggleBanker = {}
			objIsCheckBanker = {}
			objIsCheckBankerAccount = {}
			objBankerAccount = {}
			var resObj = {}
			if (action.type_toggle === "default") {
				if (typeof action.payload !== "undefined") {
					for (let x in action.payload.listBankerProcessed) {
						objToggleBanker[action.payload.listBankerProcessed[x].id] = true
						objIsCheckBanker[action.payload.listBankerProcessed[x].id] = true

						// Map account of banker
						objBankerAccount[action.payload.listBankerProcessed[x].id] = []
						for (let i in action.payload.listBankerProcessed[x].listAccounts) {
							
							objBankerAccount[action.payload.listBankerProcessed[x].id].push(action.payload.listBankerProcessed[x].listAccounts[i].id)
							objIsCheckBankerAccount[action.payload.listBankerProcessed[x].listAccounts[i].id] = true
						}
					}
				}
				resObj = {...state, bankerAccount: objBankerAccount, isOpenBanker: objToggleBanker, isCheckBanker: objIsCheckBanker, isCheckBankerAccount : objIsCheckBankerAccount}
			} else if (action.type_toggle === "on_change") {
				objToggleBanker = {...state.isOpenBanker}
				objToggleBanker[action.bankerId] = !objToggleBanker[action.bankerId]
				resObj = {...state, isOpenBanker: objToggleBanker}
			}
			return resObj
		case AccountantActionType.ACCOUNTANT_TOGGLE_CHECK_BANKER:
			objIsCheckBanker = {...state.isCheckBanker}
			objIsCheckBankerAccount = {...state.isCheckBankerAccount}
			objBankerAccount = {...state.bankerAccount}
			objIsCheckBanker[action.bankerId] = !objIsCheckBanker[action.bankerId]

			//Toggle Check Banker Account
			for (let x in objBankerAccount[action.bankerId] ) {
				objIsCheckBankerAccount[objBankerAccount[action.bankerId][x]] = objIsCheckBanker[action.bankerId]
			}
			return {...state, isCheckBanker: objIsCheckBanker, isCheckBankerAccount: objIsCheckBankerAccount}
		case AccountantActionType.ACCOUNTANT_TOGGLE_CHECK_BANKER_ACCOUNT:
			objIsCheckBanker = {...state.isCheckBanker}
			objIsCheckBankerAccount = {...state.isCheckBankerAccount}
			objBankerAccount = {...state.bankerAccount}
			objIsCheckBankerAccount[action.bankerAccountId] = !objIsCheckBankerAccount[action.bankerAccountId]

			// Toggle Banker based on banker_account
			let isCheckBanker = true
			if (objIsCheckBankerAccount[action.bankerAccountId] === false) {
				isCheckBanker = false
			} else {
				for (let x in objBankerAccount[action.bankerId] ) {
					if (objIsCheckBankerAccount[objBankerAccount[action.bankerId][x]] === false) {
						isCheckBanker = false
						break
					}
				}
			}
			objIsCheckBanker[action.bankerId] = isCheckBanker
			return {...state, isCheckBanker: objIsCheckBanker, isCheckBankerAccount: objIsCheckBankerAccount}
		default:
			return {...state}
	}
}

export const AccountantScanReducer = (state = defaultScanState, action) => {
	let payload_notify = {}
	let uuidBankerAccountMap = {}
	let full_payload = {}
	switch(action.type){
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_START:
			for(let x in action.payload) {
				payload_notify[action.payload[x]] = "Sending request"
			}
			return {...state, uuidBankerAccountMap: action.payload, request_type: action.request_type, payload_notify: payload_notify}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_NOTIFY:
			uuidBankerAccountMap = {...state.uuidBankerAccountMap}
			full_payload = {...state.full_payload}
			payload_notify = {...state.payload_notify}
			
			_map(uuidBankerAccountMap, (id, uuid) => {
                if(action.full_payload && action.full_payload.uuid === uuid && action.full_payload.type === "notify" && action.full_payload.data.message) payload_notify[id] = action.full_payload.data.message
			})
			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload, payload_notify: payload_notify}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_REJECT:
			uuidBankerAccountMap = {...state.uuidBankerAccountMap}
			full_payload = {...state.full_payload}
			payload_notify = {...state.payload_notify}

			_map(uuidBankerAccountMap, (id, uuid) => {
				if(action.full_payload && action.full_payload.uuid === uuid && action.full_payload.type !== "notify") delete payload_notify[id]
			})
			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload, payload_notify: payload_notify}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_RESOLVE:
			uuidBankerAccountMap = {...state.uuidBankerAccountMap}
			full_payload = {...state.full_payload}
			payload_notify = {...state.payload_notify}

			_map(uuidBankerAccountMap, (id, uuid) => {
				console.log(uuid)
				console.log(action.full_payload)
				if(action.full_payload && action.full_payload.uuid === uuid && action.full_payload.type !== "notify") delete payload_notify[id]
			})

			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload, payload_notify: payload_notify}
		default:
			return {...state}
	}
}
