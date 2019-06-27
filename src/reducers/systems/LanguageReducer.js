import { LanguageActionType } from 'my-constants/action-types';

let defaultState = {
    lang_code: null,
    resources: {}
};

const LanguageReducer = (state = defaultState, action) => {
	switch(action.type){
		case LanguageActionType.ON_CHANGE_LANGUAGE:
			return {...state, resources: action.payload, lang_code: action.lang_code};
		default:
			return {...state};
	}
};

export default LanguageReducer;