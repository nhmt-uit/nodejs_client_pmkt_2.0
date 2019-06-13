import { AuthActionType } from 'my-constants/action-types';

import _ from 'lodash';

let defaultState = {
    login_status: null,
	errors: {},
	payload: {},
	secureCode: null,
	checkSecureStatus: null,
};

const AuthReducer = (state = defaultState, action) => {
	switch(action.type){
		case AuthActionType.AUTH_LOGIN_SUCCESS:
			return {...state, login_status: true, checkSecureStatus: null, payload: action.payload};
		case AuthActionType.AUTH_LOGIN_FAIL:
			return {...state, login_status: false, checkSecureStatus: null, errors: action.payload};

		case AuthActionType.AUTH_GET_SECURE_SUCCESS:
			return {...state, secureCode: _.get(action, 'payload.res.data', null), errors: {}};
		case AuthActionType.AUTH_GET_SECURE_FAIL:
			return {...state, secureCode: null, errors: action.payload};

		case AuthActionType.AUTH_CHECK_SECURE_SUCCESS:
			return {...state, checkSecureStatus: true, errors: {}};
		case AuthActionType.AUTH_CHECK_SECURE_FAIL:
			return {...state, checkSecureStatus: false, login_status: false, errors: action.payload};

		default:
			return {...state};
	}
};

export default AuthReducer;