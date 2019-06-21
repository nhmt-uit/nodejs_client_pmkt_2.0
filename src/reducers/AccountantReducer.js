import { map as _map, isEmpty as _isEmpty } from 'lodash'
import { AccountantActionType } from 'my-constants/action-types'

let defaultState = {
	isSocketInitSuccess: false,
	request_type: null,
	full_payload: null,
	payload: null
}

let toggleBankerAccountState = {
	bankerAccountCheck: {},
	memberAccount: {},
	bankerAccount: {},
	isOpenBanker: {},
	isCheckMember: {},
	isCheckBanker: {},
	isCheckBankerAccount: {},
}


let defaultScanState = {
	uuidBankerAccountMap: null,
	request_type: null,
	full_payload: null,
	payload: null,
	payloadBankerAccount: null
}

export const AccountantReducer = (state = defaultState, action) => {
	switch(action.type){
		case AccountantActionType.ACCOUNTANT_SOCKET_INIT_DATA:
			let isSocketInitSuccess = false
			if(action.request_type === "accountant_init" && action.full_payload.type !== "notify" && action.full_payload.message !== "init_data") {
				isSocketInitSuccess = true
			}
			return {...state, isSocketInitSuccess: isSocketInitSuccess, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload}
		default:
			return {...state}
	}
}

export const AccountantToggleReducer = (state = toggleBankerAccountState, action) => {
	let objToggleBanker = {...state.isOpenBanker}
	let objIsCheckMember = {...state.isCheckMember}
	let objIsCheckBanker = {...state.isCheckBanker}
	let objIsCheckBankerAccount = {...state.isCheckBankerAccount}
	let objBankerAccount = {...state.bankerAccount}
	let objMemberAccount = {...state.memberAccount}
	switch(action.type){
		case AccountantActionType.ACCOUNTANT_TOGGLE_BANKER:
			var resObj = {}
			
			if (action.type_toggle === "default" && typeof action.payload !== "undefined") {
				objIsCheckMember = []
				objIsCheckBanker = {}
				objIsCheckBankerAccount = {}
				for (let x in action.payload.bankerAccountMap ) {
					objIsCheckBanker[x] = true
					objToggleBanker[x] = true
					action.payload.bankerAccountMap[x].map(acc_id => {
						objIsCheckBankerAccount[acc_id] = true
					})
				}
				//Default checked member
				for (let x in action.payload.memberAccountMap ) {
					objIsCheckMember[x] = false
				}
				resObj = {...state, bankerAccount: action.payload.bankerAccountMap, memberAccount: action.payload.memberAccountMap, isCheckMember : objIsCheckMember, isCheckBanker: objIsCheckBanker, isCheckBankerAccount: objIsCheckBankerAccount, isOpenBanker: objToggleBanker}
			} else if (action.type_toggle === "on_change") {
				if (action.type_collapse === "single") {
					objToggleBanker = {...state.isOpenBanker}
					objToggleBanker[action.bankerId] = !objToggleBanker[action.bankerId]
				} else {
					let isCollapseAll = true
					if (action.type_collapse === "close_all") isCollapseAll = false
					for (let x in objToggleBanker ) {
						objToggleBanker[x] = isCollapseAll
					}
				}
				resObj = {...state, isOpenBanker: objToggleBanker}
			}
			return resObj
		case AccountantActionType.ACCOUNTANT_TOGGLE_CHECK_BANKER_ACCOUNT:
			if (action.type_check === "member") {
				// case uncheckall
				for ( let x in objIsCheckMember) {
					objIsCheckMember[x] = false
					if (action.memberId.includes(x)) objIsCheckMember[x] = true
				}

				for (let x in objMemberAccount ) {
					if(!objIsCheckMember[x]) {
						objMemberAccount[x].map(acc_id => {
							objIsCheckBankerAccount[acc_id] = false
						})
					}
				}

				for (let x in objMemberAccount ) {
					if(objIsCheckMember[x]) {
						objMemberAccount[x].map(acc_id => {
							objIsCheckBankerAccount[acc_id] = true
						})
					}
				}
				objIsCheckBanker = toggleCheckBanker(objIsCheckBanker, objBankerAccount, objIsCheckBankerAccount)
			} else if (action.type_check === "banker") {
				objIsCheckBanker[action.bankerId] = !objIsCheckBanker[action.bankerId]
				//Toggle Check Banker Account
				for (let x in objBankerAccount[action.bankerId] ) {
					objIsCheckBankerAccount[objBankerAccount[action.bankerId][x]] = objIsCheckBanker[action.bankerId]
				}
				objIsCheckBankerAccount = togglecheckBankerAccount(objIsCheckMember, objIsCheckBankerAccount, objMemberAccount)
				objIsCheckBanker = toggleCheckBanker(objIsCheckBanker, objBankerAccount, objIsCheckBankerAccount)
			} else if  (action.type_check === "banker_account") {
				objIsCheckBankerAccount[action.bankerAccountId] = !objIsCheckBankerAccount[action.bankerAccountId]
				objIsCheckBankerAccount = togglecheckBankerAccount(objIsCheckMember, objIsCheckBankerAccount, objMemberAccount)
				// Toggle Banker based on banker_account
				objIsCheckBanker = toggleCheckBanker(objIsCheckBanker, objBankerAccount, objIsCheckBankerAccount)
			} else if  (action.type_check === "check_all") {
				for (let x in objIsCheckBanker) {
					objIsCheckBanker[x] = true
					//Toggle Check Banker Account
					for (let y in objBankerAccount[x] ) {
						objIsCheckBankerAccount[objBankerAccount[x][y]] = objIsCheckBanker[x]
					}
				}
				objIsCheckBankerAccount = togglecheckBankerAccount(objIsCheckMember, objIsCheckBankerAccount, objMemberAccount)
				objIsCheckBanker = toggleCheckBanker(objIsCheckBanker, objBankerAccount, objIsCheckBankerAccount)
			} else if  (action.type_check === "uncheck_all") {
				for (let x in objIsCheckBanker) {
					objIsCheckBanker[x] = false
					//Toggle Check Banker Account
					for (let y in objBankerAccount[x] ) {
						objIsCheckBankerAccount[objBankerAccount[x][y]] = objIsCheckBanker[x]
					}
				}
				objIsCheckBankerAccount = togglecheckBankerAccount(objIsCheckMember, objIsCheckBankerAccount, objMemberAccount)
				objIsCheckBanker = toggleCheckBanker(objIsCheckBanker, objBankerAccount, objIsCheckBankerAccount)
			} else if  (action.type_check === "check_all_error") {
				for ( let x in objIsCheckMember) {
					objIsCheckMember[x] = false
				}
				for (let x in objIsCheckBanker) {
					objIsCheckBanker[x] = false
					//Toggle Check Banker Account
					for (let y in objBankerAccount[x] ) {
						objIsCheckBankerAccount[objBankerAccount[x][y]] = objIsCheckBanker[x]
					}
				}

				action.payloadBankerAccount.map(acc => {
					if(acc.type === "reject" && acc.message !== "Empty data") {
						objIsCheckBankerAccount[acc.id] = true
					}
				})
				objIsCheckBankerAccount = togglecheckBankerAccount(objIsCheckMember, objIsCheckBankerAccount, objMemberAccount)
				objIsCheckBanker = toggleCheckBanker(objIsCheckBanker, objBankerAccount, objIsCheckBankerAccount)
			}
			return {...state, isCheckMember: objIsCheckMember, isCheckBanker: objIsCheckBanker, isCheckBankerAccount: objIsCheckBankerAccount}
		default:
			return {...state}
	}
}

function togglecheckBankerAccount(objIsCheckMember, objIsCheckBankerAccount, objMemberAccount) {
	if(!_isEmpty(objIsCheckMember)) {
		for (let x in objMemberAccount ) {
			if(objIsCheckMember[x]) {
				objMemberAccount[x].map(acc_id => {
					objIsCheckBankerAccount[acc_id] = true
				})
			}
		}
	}
	return objIsCheckBankerAccount
}

function toggleCheckBanker(objIsCheckBanker, objBankerAccount, objIsCheckBankerAccount) {
	for (let bankerId in objBankerAccount ) {
		let isCheckBanker = true
		for (let x in objBankerAccount[bankerId] ) {
			if (objIsCheckBankerAccount[objBankerAccount[bankerId][x]] === false) {
				isCheckBanker = false
				break
			}
		}
		objIsCheckBanker[bankerId] = isCheckBanker
	}
	return objIsCheckBanker
}

export const AccountantScanReducer = (state = defaultScanState, action) => {
	let payloadBankerAccount = (state.payloadBankerAccount) ? [...state.payloadBankerAccount] : []
	let uuidBankerAccountMap = {...state.uuidBankerAccountMap}
	switch(action.type){
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_START:
			payloadBankerAccount = []
			for(let x in action.payload) {
				payloadBankerAccount.push({id: action.payload[x], message: "Sending request", type: "notify"})
			}
			return {...state, uuidBankerAccountMap: action.payload, request_type: action.request_type, payloadBankerAccount: payloadBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_NOTIFY:
			_map(uuidBankerAccountMap, (id, uuid) => {
                if(action.full_payload && action.full_payload.uuid === uuid && action.full_payload.type === "notify" && action.full_payload.data.message) {
					let objIndex = payloadBankerAccount.findIndex((obj => obj.id === id))
					payloadBankerAccount[objIndex].message = action.full_payload.data.message
				}
			})
			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload, payloadBankerAccount: payloadBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_REJECT:
			_map(uuidBankerAccountMap, (id, uuid) => {
				if(action.full_payload && action.full_payload.uuid === uuid && action.full_payload.type === "reject") {
					let objIndex = payloadBankerAccount.findIndex((obj => obj.id === id))
					payloadBankerAccount[objIndex].message = action.full_payload.data.message
					payloadBankerAccount[objIndex].type = "reject"
				}
			})
			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload, payloadBankerAccount: payloadBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_RESOLVE:
			_map(uuidBankerAccountMap, (id, uuid) => {
				if(action.full_payload && action.full_payload.uuid === uuid && action.full_payload.type === "resolve") {
					let objIndex = payloadBankerAccount.findIndex((obj => obj.id === id))
					payloadBankerAccount[objIndex].data = action.full_payload.data
					payloadBankerAccount[objIndex].message = null
					payloadBankerAccount[objIndex].type = "resolve"
				}
			})
			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload, payloadBankerAccount: payloadBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_STOP:
			_map(action.bankerAccountIds, id => {
				let objIndex = payloadBankerAccount.findIndex((obj => obj.id === id))
				payloadBankerAccount[objIndex].message = 'Stopped'
				payloadBankerAccount[objIndex].type = "stop"
			})
			return {...state, payloadBankerAccount: payloadBankerAccount}
		default:
			return {...state}
	}
}
