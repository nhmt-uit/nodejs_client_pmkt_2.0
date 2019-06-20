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
	let objToggleBanker
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
					action.payload.bankerAccountMap[x].map(acc_id => {
						objIsCheckBankerAccount[acc_id] = true
					})
				}

				//Default checked member
				for (let x in action.payload.memberAccountMap ) {
					objIsCheckMember[x] = false
				}

				resObj = {...state, bankerAccount: action.payload.bankerAccountMap, memberAccount: action.payload.memberAccountMap, isCheckMember : objIsCheckMember, isCheckBanker: objIsCheckBanker, isCheckBankerAccount: objIsCheckBankerAccount}
			} else if (action.type_toggle === "on_change") {
				objToggleBanker = {...state.isOpenBanker}
				objToggleBanker[action.bankerId] = !objToggleBanker[action.bankerId]
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


				// objIsCheckMember = action.memberId
				// for (let x in objMemberAccount ) {
				// 	if(action.memberId.includes(x)) console.log(objMemberAccount[x])
				// 	objMemberAccount[x].map(acc_id => {
				// 		let isCheck = false
				// 		if(action.memberId.includes(x)) isCheck = true
				// 		objIsCheckBankerAccount[acc_id] = isCheck
				// 	})
				// }
				// console.log(objIsCheckBankerAccount)
				// objIsCheckBanker = toggleCheckBanker(objIsCheckBanker, objBankerAccount, objIsCheckBankerAccount)
			} else if (action.type_check === "banker") {
				objIsCheckBanker[action.bankerId] = !objIsCheckBanker[action.bankerId]
				//Toggle Check Banker Account
				for (let x in objBankerAccount[action.bankerId] ) {
					objIsCheckBankerAccount[objBankerAccount[action.bankerId][x]] = objIsCheckBanker[action.bankerId]
				}
			} else if  (action.type_check === "banker_account") {
				console.log(action.bankerAccountId);
				objIsCheckBankerAccount[action.bankerAccountId] = !objIsCheckBankerAccount[action.bankerAccountId]
				objIsCheckBankerAccount = togglecheckBankerAccount(objIsCheckMember, objIsCheckBankerAccount, objMemberAccount)
				// Toggle Banker based on banker_account
				objIsCheckBanker = toggleCheckBanker(objIsCheckBanker, objBankerAccount, objIsCheckBankerAccount)
			}
			return {...state, isCheckMember: objIsCheckMember, isCheckBanker: objIsCheckBanker, isCheckBankerAccount: objIsCheckBankerAccount}
		default:
			return {...state}
	}
}

function togglecheckBankerAccount(objIsCheckMember, objIsCheckBankerAccount, objMemberAccount) {
	if(!_isEmpty(objIsCheckMember)) {
		// objIsCheckMember.map(memberId => {
		// 	objMemberAccount[memberId].map(accId => {
		// 		// objIsCheckBankerAccount[accId] = true
		// 	})
		// })
	}
	return objIsCheckBankerAccount
}

function  toggleCheckBanker(objIsCheckBanker, objBankerAccount, objIsCheckBankerAccount) {
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
	let payloadBankerAccount = []
	let uuidBankerAccountMap = {}
	let full_payload = {}
	switch(action.type){
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_START:
			for(let x in action.payload) {
				payloadBankerAccount.push({id: action.payload[x], message: "Sending request", type: "notify"})
			}
			return {...state, uuidBankerAccountMap: action.payload, request_type: action.request_type, payloadBankerAccount: payloadBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_NOTIFY:
			uuidBankerAccountMap = {...state.uuidBankerAccountMap}
			full_payload = {...state.full_payload}
			payloadBankerAccount = [...state.payloadBankerAccount]
			_map(uuidBankerAccountMap, (id, uuid) => {
                if(action.full_payload && action.full_payload.uuid === uuid && action.full_payload.type === "notify" && action.full_payload.data.message) {
					let objIndex = payloadBankerAccount.findIndex((obj => obj.id === id))
					payloadBankerAccount[objIndex].message = action.full_payload.data.message
				}
			})
			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload, payloadBankerAccount: payloadBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_REJECT:
			uuidBankerAccountMap = {...state.uuidBankerAccountMap}
			full_payload = {...state.full_payload}
			payloadBankerAccount = [...state.payloadBankerAccount]

			_map(uuidBankerAccountMap, (id, uuid) => {
				if(action.full_payload && action.full_payload.uuid === uuid && action.full_payload.type === "reject") {
					let objIndex = payloadBankerAccount.findIndex((obj => obj.id === id))
					payloadBankerAccount[objIndex].message = action.full_payload.data.message
					payloadBankerAccount[objIndex].type = "reject"
				}
			})
			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload, payloadBankerAccount: payloadBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_RESOLVE:
			uuidBankerAccountMap = {...state.uuidBankerAccountMap}
			full_payload = {...state.full_payload}
			payloadBankerAccount = [...state.payloadBankerAccount]

			_map(uuidBankerAccountMap, (id, uuid) => {
				if(action.full_payload && action.full_payload.uuid === uuid && action.full_payload.type === "resolve") {
					let objIndex = payloadBankerAccount.findIndex((obj => obj.id === id))
					payloadBankerAccount[objIndex].data = action.full_payload.data
					payloadBankerAccount[objIndex].message = null
					payloadBankerAccount[objIndex].type = "resolve"
				}
			})

			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload, payloadBankerAccount: payloadBankerAccount}
		default:
			return {...state}
	}
}
