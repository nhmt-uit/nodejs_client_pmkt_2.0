import { AuthActionType } from 'my-constants/action-types';

import _ from 'lodash';

let defaultState = {
    login_status: null,
	errors: {},
	payload: {},
	secureCode: null,
	checkSecure: false,
};

const AuthReducer = (state = defaultState, action) => {
	switch(action.type){
		case AuthActionType.AUTH_LOGIN_SUCCESS:
			return {...state, login_status: true, payload: action.payload};
		case AuthActionType.AUTH_LOGIN_FAIL:
			return {...state, login_status: false, errors: action.payload};

		case AuthActionType.AUTH_GET_SECURE_SUCCESS:
			return {...state, secureCode: _.get(action, 'payload.res.data', null)};
		case AuthActionType.AUTH_GET_SECURE_FAIL:
			return {...state, secureCode: null};

		case AuthActionType.AUTH_CHECK_SECURE_SUCCESS:
			return {...state, checkSecure: true};
		case AuthActionType.AUTH_CHECK_SECURE_FAIL:
			return {...state, checkSecure: false};

		default:
			return {...state};
	}
};

export default AuthReducer;