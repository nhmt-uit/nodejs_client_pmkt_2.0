import uuidv4 from 'uuid/v4'
import { map as _map, isEmpty as _isEmpty, get as _get, uniq as _uniq, difference as _difference, cloneDeep as _cloneDeep, has as _has } from 'lodash'

import { AccountantActionType } from 'my-constants/action-types'
import { SocketService } from 'my-utils/core';

let defaultState = {
	socketInitStatus: 'start',
	request_type: null,
	full_payload: null,
	payload: null,
	banker: [],
	bankerAccount: [],
	member: [],
	bankerAccountByMember: [],

	//Handle Optimize Render
	isCollapseBanker: false,
	isCollapseBankerAccount: false,

	// Handel button form
	isProcessing: false,
	isAllowReport: false,


	// Handel delete formula after scan
	isShowAllFormula: true,
	isOpenModalDeleteFormula: false,
	// Handel assign formula after scan
	isOpenModalFormFormula: false,

	payloadSelectedFormula: {}
}

export const AccountantReducer = (state = defaultState, action) => {
	let newMember = _cloneDeep(state.member)
	let newBanker = _cloneDeep(state.banker)
	let newBankerAccount = _cloneDeep(state.bankerAccount)
	let newBankerAccountByMember = _cloneDeep(state.bankerAccountByMember)
	let newIsProcessing = state.isProcessing
	let newIsAllowReport = state.isProcessing
	state.isCollapseBanker = false
	state.isCollapseBankerAccount = false
	switch(action.type){
		case AccountantActionType.ACCOUNTANT_SOCKET_INIT_DATA:
			if(action.request_type === "accountant_init" && action.full_payload.type === "notify" && action.full_payload.message === "init_data") {
				state = defaultState
			}
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
			return {...state, banker: newBanker, isCollapseBanker: uuidv4()}
		case AccountantActionType.ACCOUNTANT_COLLAPSE_BANKER_ACCOUNT:
			var objIndex = newBankerAccount.findIndex((obj => obj.id === action.bankerAccountId))
			if (objIndex !== -1){
				newBankerAccount[objIndex].collapse = !newBankerAccount[objIndex].collapse
			}
			return {...state, bankerAccount: newBankerAccount, isCollapseBankerAccount: uuidv4()}
		/*
		|--------------------------------------------------------------------------
		| Scan Data
		|--------------------------------------------------------------------------
		*/
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_START:
			for(let x in action.payload) {
				var objIndex = newBankerAccount.findIndex((obj => obj.id === action.payload[x]))
				if (objIndex !== -1) {
					newBankerAccount[objIndex].type = "notify"
					newBankerAccount[objIndex].message = "sending request"
					newBankerAccount[objIndex].uuid = x
				}
			}
			return {...state, bankerAccount: newBankerAccount, isProcessing: true}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_NOTIFY:
			if (action.payload.length !== 0 ) {
				for(let x in action.payload) {
					var objIndex = newBankerAccount.findIndex((obj => obj.uuid === action.payload[x].uuid))
					if (objIndex !== -1) newBankerAccount[objIndex].message = _get(action.payload[x], 'data.message')
				}
			}
			return {...state, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_REJECT:
			if (action.payload.length !== 0 ) {
				for(let x in action.payload) {
					var objIndex = newBankerAccount.findIndex((obj => obj.uuid === action.payload[x].uuid))
					if (objIndex !== -1) {
						newBankerAccount[objIndex].type = "reject"
						newBankerAccount[objIndex].message = _get(action.payload[x], 'data.message')
					}
				}
			}
			//Check process finish
			newIsProcessing = !_isEmpty(newBankerAccount.find(item => item.type === "notify")) ? true : false
			newIsAllowReport = !_isEmpty(newBankerAccount.find(item => item.type === "resolve")) ? true : false
			// Stop listen when scan finish
			if (newIsProcessing === false) SocketService.unListenerResponse()
			return {...state, bankerAccount: newBankerAccount, isProcessing: newIsProcessing, isAllowReport: newIsAllowReport}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_RESOLVE:
			if (action.payload.length !== 0 ) {
				for(let x in action.payload) {
					var objIndex = newBankerAccount.findIndex((obj => obj.uuid === action.payload[x].uuid))
					if (objIndex !== -1) {
						newBankerAccount[objIndex].type = "resolve"
						newBankerAccount[objIndex].message = null
						newBankerAccount[objIndex].data = action.payload[x].data
						newBankerAccount[objIndex].data.dataHiddenFields = handleProcessDataCheckHiddenColumn(newBankerAccount[objIndex].data.accountant)
					}
				}
			}
			//Check process finish
			newIsProcessing = !_isEmpty(newBankerAccount.find(item => item.type === "notify")) ? true : false
			newIsAllowReport = !_isEmpty(newBankerAccount.find(item => item.type === "resolve")) ? true : false
			// Stop listen when scan finish
			if (newIsProcessing === false) SocketService.unListenerResponse()

			return {...state, bankerAccount: newBankerAccount, isProcessing: newIsProcessing, isAllowReport: newIsAllowReport}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_ACCOUNT_LOCK:
			if (action.payload.length !== 0 ) {
				for(let x in action.payload) {
					var objIndex = newBankerAccount.findIndex((obj => obj.id === action.payload[x].id))
					if (objIndex !== -1) {
						newBankerAccount[objIndex].type = "reject"
						newBankerAccount[objIndex].message = "account is suspend! please call company for open account"
					}
				}
			}
			//Check process finish
			newIsProcessing = !_isEmpty(newBankerAccount.find(item => item.type === "notify")) ? true : false
			newIsAllowReport = !_isEmpty(newBankerAccount.find(item => item.type === "resolve")) ? true : false
			// Stop listen when scan finish
			if (newIsProcessing === false) SocketService.unListenerResponse()
			return {...state, bankerAccount: newBankerAccount, isProcessing: newIsProcessing, isAllowReport: newIsAllowReport}
		case AccountantActionType.ACCOUNTANT_SOCKET_SCAN_DATA_STOP:
			for(let x of action.bankerAccountIds) {
				var objIndex = newBankerAccount.findIndex((obj => obj.id === x))
				if (objIndex !== -1) {
					newBankerAccount[objIndex].type = "stop"
					newBankerAccount[objIndex].message = "Stopped"
				}
			}
			// Stop listen when scan finish
			if (newIsProcessing === false) SocketService.unListenerResponse()
			return {...state, bankerAccount: newBankerAccount, isProcessing: false}
		case AccountantActionType.ACCOUNTANT_DELETE_BANKER_ACCOUNT:
			newBankerAccount = newBankerAccount.filter(item => item.id !== action.item.id)
			//Remove Banker
			if(newBankerAccount.findIndex((obj => obj.banker === action.item.banker)) === -1) newBanker = newBanker.filter(item => item.id !== action.item.banker)
			return {...state, banker: newBanker, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_RELOAD_BANKER_ACCOUNT_INFO:
			var objIndex = newBankerAccount.findIndex((obj => obj.id === action.payload.id))
			if (objIndex !== -1) {
				newBankerAccount[objIndex] = {...newBankerAccount[objIndex], ...action.payload}
				newBankerAccount[objIndex].type = null
				newBankerAccount[objIndex].message = null
				newBankerAccount[objIndex].data = null
			}
			return {...state, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_SOCKET_GET_REPORT_BANKER_ACCOUNT:
			let bankerAccountId = action.uuid2AccId[action.full_payload.uuid]
			console.log(newBankerAccount)
			console.log(bankerAccountId)
			if(!_isEmpty(bankerAccountId)) {
				var objIndex = newBankerAccount.findIndex((obj => obj.id === bankerAccountId || obj.data.accountant[0].accInfo.id === bankerAccountId))
				if (objIndex !== -1) {
					newBankerAccount[objIndex].data = {...newBankerAccount[objIndex].data, ...action.payload}
					newBankerAccount[objIndex].data.dataHiddenFields = handleProcessDataCheckHiddenColumn(newBankerAccount[objIndex].data.accountant)
				}
			}
			return {...state, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_TOGGLE_SHOW_ALL_FORMULA:
			return {...state, isShowAllFormula: !state.isShowAllFormula}
		case AccountantActionType.ACCOUNTANT_TOGGLE_MODAL_DELETE_FORMULA:
			return {...state, isOpenModalDeleteFormula: !state.isOpenModalDeleteFormula, payloadSelectedFormula: action.payloadSelectedFormula}
		case AccountantActionType.ACCOUNTANT_TOGGLE_MODAL_FROM_FORMULA:
			return {...state, isOpenModalFormFormula: !state.isOpenModalFormFormula, payloadSelectedFormula: action.payloadSelectedFormula}
		case AccountantActionType.ACCOUNTANT_TOGGLE_SHOW_HIDE_BANKER_ACCOUNT_CHILD:
			var objIndex = newBankerAccount.findIndex((obj => obj.id === action.bankerAccountId))
			if (objIndex !== -1){
				newBankerAccount[objIndex].data.accountant = handleProcessDataWhenToggleShowHideChild(newBankerAccount[objIndex].data.accountant, action.username)
			}
			return {...state, bankerAccount: newBankerAccount}
		case AccountantActionType.ACCOUNTANT_RESET_WHEN_CHANGE_DATE:
			newBankerAccount = newBankerAccount.map(item => {
				item.type = null
				item.message = null
				item.uuid = null
				item.data = null
				return item
			})
			return {...state, bankerAccount: newBankerAccount, isAllowReport: false}
		default:
			return {...state}
	}
}

/*
|--------------------------------------------------------------------------
| Check has hidden column
| formatName, he_so, gia_thau, PRText
|--------------------------------------------------------------------------
*/
function handleProcessDataCheckHiddenColumn(accountant, res = {formatName: true, he_so: false, gia_thau: false, PRText: true}) {
	if (_isEmpty(accountant)) return res
	for(let x in accountant) {
		if (_isEmpty(accountant[x].reportAccountant)) continue
		for(let y in accountant[x].reportAccountant) {
			if (_isEmpty(accountant[x].reportAccountant[y].resultList)) continue
			for(let z in accountant[x].reportAccountant[y].resultList) {
				if(_has(accountant[x].reportAccountant[y].resultList[z], 'he_so')) res.he_so = true
				if(_has(accountant[x].reportAccountant[y].resultList[z], 'gia_thau')) res.gia_thau = true
				if (res.he_so && res.gia_thau) return res
			}
		}
		return handleProcessDataCheckHiddenColumn(accountant[x].child, res)
	}
}

/*
|--------------------------------------------------------------------------
| Scan result add/check object isShowChild
|--------------------------------------------------------------------------
*/
function handleProcessDataWhenToggleShowHideChild(accountant, username) {
	if (_isEmpty(accountant)) return
	return accountant.map(node => {
		if(node.username === username) {
			node.isShowChild = (typeof node.isShowChild === "undefined") ? false : !node.isShowChild
			return node
		}
		handleProcessDataWhenToggleShowHideChild(node.child, username)
		return node
	})
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