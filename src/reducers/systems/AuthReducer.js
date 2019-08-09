import { AuthActionType } from 'my-constants/action-types';

import _ from 'lodash';

let defaultState = {
    login_status: null,
	errors: {},
	payload: {},
	secureCode: null,
	checkSecureStatus: null,
	resetSecurePasswordStatus: false,
	isFetching: false,
};

const AuthReducer = (state = defaultState, action) => {
	switch(action.type){
		case AuthActionType.AUTH_LOGIN:
			return {...state, isFetching: true };
		case AuthActionType.AUTH_LOGIN_SUCCESS:
			return {...state, login_status: true, checkSecureStatus: null, payload: action.payload, errors: {}, isFetching: false};
		case AuthActionType.AUTH_LOGIN_FAIL:
			return {...state, login_status: false, checkSecureStatus: null, errors: action.payload, isFetching: false};

		case AuthActionType.AUTH_GET_SECURE_SUCCESS:
			return {...state, secureCode: _.get(action, 'payload.res.data', null), errors: {}};
		case AuthActionType.AUTH_GET_SECURE_FAIL:
			return {...state, secureCode: null, errors: action.payload};

		case AuthActionType.AUTH_CHECK_SECURE_SUCCESS:
			return {...state, checkSecureStatus: true, errors: {}};
		case AuthActionType.AUTH_CHECK_SECURE_FAIL:
			return {...state, checkSecureStatus: false, login_status: false, errors: action.payload};

		case AuthActionType.RESET_SECURE_PASSWORD_SUCCESS:
			return {...state, resetSecurePasswordStatus: true, errors: {}};
		case AuthActionType.RESET_SECURE_PASSWORD_FAIL:
			return {...state, resetSecurePasswordStatus: false, login_status: false, errors: action.payload};

		default:
			return {...state};
	}
};

export default AuthReducer;