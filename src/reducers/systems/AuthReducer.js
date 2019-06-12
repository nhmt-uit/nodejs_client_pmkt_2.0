import { AuthActionType } from 'my-constants/action-types';
let defaultState = {
    login_status: null,
	errors: {},
	payload: {}
}

const AuthReducer = (state = defaultState, action) => {
	switch(action.type){
		case AuthActionType.AUTH_LOGIN_SUCCESS:
			return {...state, login_status: true, payload: action.payload}
		case AuthActionType.AUTH_LOGIN_FAIL:
			return {...state, login_status: false, errors: action.payload}
		default:
			return {...state};
	}
}

export default AuthReducer;