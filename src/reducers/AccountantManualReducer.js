import { AccountantManualActionType } from 'my-constants/action-types'

let defaultState = {
	isRenderFinish: false,
	full_payload: null,
	payload: null,
	full_payload_reject: null,
	payload_reject: null,
	banker: {}
}

export const AccountantManualReducer = (state = defaultState, action) => {
	switch(action.type){
		case AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_INIT_DATA:
			return {...defaultState}
		case AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_GET_BANKER_DATA:
			return {...state, banker: action.banker}
		case AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_SCAN_FORM_BANKER: {
			let full_payload = action.full_payload || state.full_payload
			let payload = action.payload || state.payload
			let full_payload_reject = action.full_payload_reject || state.full_payload_reject
			let payload_reject = action.payload_reject || state.payload_reject
			let isRenderFinish = action.isRenderFinish || state.isRenderFinish
			return {...state, isRenderFinish: isRenderFinish, full_payload: full_payload, payload: payload, full_payload_reject: full_payload_reject, payload_reject: payload_reject, }
		}
		case AccountantManualActionType.ACCOUNTANT_MANUAL_SOCKET_SUBMIT_FORM_BANKER: {
			let full_payload = action.full_payload || state.full_payload
			let payload = action.payload || state.payload
			let isRenderFinish = action.isRenderFinish
			return {...state, isRenderFinish: isRenderFinish, full_payload: full_payload, payload: payload}
		}
		default:
			return {...state}
	}
}


export default AccountantManualReducer;