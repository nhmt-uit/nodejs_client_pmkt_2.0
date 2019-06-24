import { map as _map, isEmpty as _isEmpty, get as _get, uniq as _uniq, difference as _difference } from 'lodash'
import { AccountantActionType } from 'my-constants/action-types'

let defaultState = {
	socketInitStatus: 'start',
	request_type: null,
	full_payload: null,
	payload: null,
	banker: [],
	bankerAccount: [],
	member: [],
	bankerAccountByMember: []
}

export const AccountantReducer = (state = defaultState, action) => {
	let newMember = [...state.member]
	let newBanker = [...state.banker]
	let newBankerAccount = [...state.bankerAccount]
	let newBankerAccountByMember = [...state.bankerAccountByMember]
	switch(action.type){
		case AccountantActionType.ACCOUNTANT_SOCKET_INIT_DATA:
			let socketInitStatus = 'inprogress'
			if(action.request_type === "accountant_init" && action.full_payload.type !== "notify" && action.full_payload.message !== "init_data") {
				socketInitStatus = 'finish'
			}
			return {...state,
						socketInitStatus: socketInitStatus,
						bankerAccount: _get(action.payload, 'payloadBankerAccount', []),
						banker: _get(action.payload, 'payloadBanker', []),
						member: _get(action.payload, 'payloadMemberOptions', [])
					}
		case AccountantActionType.ACCOUNTANT_TOGGLE_CHECK_BANKER_ACCOUNT:
			if (action.type_check === "member") {
				let memberChekedFalse = []
				let memberChekedTrue = []
				newBankerAccountByMember = []
				newMember.map(item => {
					if (action.memberIds.indexOf(item.value) !== -1) {
						item.checked = true
						newBankerAccountByMember = newBankerAccountByMember.concat(_map(item.bankerAccount, 'id'))
						memberChekedTrue = memberChekedTrue.concat(_map(item.bankerAccount, 'id'))
					} else {
						item.checked = false
						memberChekedFalse= memberChekedFalse.concat(_map(item.bankerAccount, 'id'))
					}
				})
				newBankerAccountByMember = _uniq(newBankerAccountByMember)
				memberChekedFalse = _difference(_uniq(memberChekedFalse), newBankerAccountByMember)
				
				
				toggleBankerAccount(newBanker, newBankerAccount, newBankerAccountByMember, memberChekedFalse)
			}

			if (action.type_check === "banker") {
				let objIndex = newBanker.findIndex((obj => obj.id === action.bankerId))
				let curChecked = newBanker[objIndex].checked
				newBankerAccount.map(item => {
					if(item.banker === action.bankerId){
						item.checked = (curChecked === true && newBankerAccountByMember.indexOf(item.id) !== -1) ? true : !curChecked
					}
				})
				
				newBanker[objIndex].checked = _isEmpty(newBankerAccount.filter(item => item.banker === action.bankerId && !item.checked)) ? true : !curChecked
			}

			if (action.type_check === "banker_account") {
				if (newBankerAccountByMember.indexOf(action.bankerAccountId) === -1 ) {
					let objIndex = newBankerAccount.findIndex((obj => obj.id === action.bankerAccountId))
					newBankerAccount[objIndex].checked = !newBankerAccount[objIndex].checked

					toggleBanker(newBanker, newBankerAccount, newBankerAccount[objIndex].checked, newBankerAccount[objIndex].banker )
				}
			}

			if (action.type_check === "check_all") {
				newBanker.map(item => {item.checked = action.isCheckAll})
				newBankerAccount.map(item => {
					item.checked = action.isCheckAll
					if(!action.isCheckAll && newBankerAccountByMember.indexOf(item.id) !== -1) {
						item.checked = true
						toggleBanker(newBanker, newBankerAccount, true, item.banker )
					}
				})
			}
			
			if (action.type_check === "check_all_error") {
				newBankerAccountByMember = []
				newMember.map(item => { item.checked = false })
				newBankerAccount.map(item => {
					item.checked = item.type === "reject" && item.message !== "Empty data" ? true : false
					toggleBanker(newBanker, newBankerAccount, true, item.banker )
				})
			}

			return {...state, member: newMember, banker: newBanker, bankerAccount: newBankerAccount, bankerAccountByMember: newBankerAccountByMember}
		case AccountantActionType.ACCOUNTANT_TOGGLE_COLLAPSE_BANKER_ACCOUNT:
			if (action.type_collapse === "single") {
				let objIndex = newBanker.findIndex((obj => obj.id === action.bankerId))
				newBanker[objIndex].collapse = !newBanker[objIndex].collapse
			}

			if (action.type_collapse === "close_all") {
				newBanker.map(item => {item.collapse = false})
			}

			if (action.type_collapse === "open_all") {
				newBanker.map(item => {item.collapse = true})
			}
			return {...state, banker: newBanker}
		/*
		|--------------------------------------------------------------------------
		| Scan Data
		|--------------------------------------------------------------------------
		*/
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_START:
			for(let x in action.payload) {
				var objIndex = newBankerAccount.findIndex((obj => obj.id === action.payload[x]))
				newBankerAccount[objIndex].type = "notify"
				newBankerAccount[objIndex].message = "Sending request"
				newBankerAccount[objIndex].uuid = x
			}
			return {...state, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_NOTIFY:
			var objIndex = newBankerAccount.findIndex((obj => obj.uuid === action.full_payload.uuid))
			newBankerAccount[objIndex].message = _get(action, 'full_payload.data.message')
			return {...state, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_REJECT:
			var objIndex = newBankerAccount.findIndex((obj => obj.uuid === action.full_payload.uuid))
			newBankerAccount[objIndex].type = "reject"
			newBankerAccount[objIndex].message = _get(action, 'full_payload.data.message')
			return {...state, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_RESOLVE:
			var objIndex = newBankerAccount.findIndex((obj => obj.uuid === action.full_payload.uuid))
			newBankerAccount[objIndex].type = "resolve"
			newBankerAccount[objIndex].message = null
			newBankerAccount[objIndex].data = action.full_payload.data
			return {...state, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_STOP:
			for(let x of action.bankerAccountIds) {
				var objIndex = newBankerAccount.findIndex((obj => obj.id === x))
				newBankerAccount[objIndex].type = "stop"
				newBankerAccount[objIndex].message = "Stopped"
			}
			return {...state, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_DELETE_BANKER_ACCOUNT:
			newBankerAccount = newBankerAccount.filter(item => item.id !== action.item.id)
			//Remove Banker
			if(newBankerAccount.findIndex((obj => obj.banker === action.item.banker)) === -1) newBanker = newBanker.filter(item => item.id !== action.item.banker)
			return {...state, banker: newBanker, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_RELOAD_BANKER_ACCOUNT_INFO:
				var objIndex = newBankerAccount.findIndex((obj => obj.id === action.payload.id))
				newBankerAccount[objIndex] = {...newBankerAccount[objIndex], ...action.payload}
				newBankerAccount[objIndex].type = null
				newBankerAccount[objIndex].message = null
				newBankerAccount[objIndex].data = null
				return {...state, bankerAccount: newBankerAccount}
		default:
			return {...state}
	}
}

//reference function
function toggleBanker(banker, bankerAccount, bankerAccountChecked, bankerId) {
	if (bankerAccountChecked === false ) {
		let objIndex = banker.findIndex((obj => obj.id === bankerId))
		banker[objIndex].checked = false
	} else {
		let checkBanker = bankerAccount.filter(item => item.banker === bankerId && item.checked !== bankerAccountChecked)
		let objIndex = banker.findIndex((obj => obj.id === bankerId))
		banker[objIndex].checked = _isEmpty(checkBanker) ? true : false
	}
}

//reference function
function toggleBankerAccount(banker, bankerAccount, bankerAccountByMember, memberChekedFalse) {
	bankerAccount.map(item => {
		item.checked = bankerAccountByMember.indexOf(item.id) !== -1 ? memberChekedFalse.indexOf(item.id) !== -1 ? false : true : false
		toggleBanker(banker, bankerAccount, item.checked, item.banker )
	})
}


export default AccountantReducer;