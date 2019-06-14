import { AccountantActionType } from 'my-constants/action-types';

let defaultState = {
	request_type: null,
	full_payload: null,
    payload: null
};

const AccountantReducer = (state = defaultState, action) => {
	switch(action.type){
		case AccountantActionType.ACCOUNTANT_SOCKET_INIT_DATA:
			return {...state, request_type: action.request_type, full_payload: action.full_payload, payload: action.payload};
		default:
			return {...state};
	}
};

export default AccountantReducer;