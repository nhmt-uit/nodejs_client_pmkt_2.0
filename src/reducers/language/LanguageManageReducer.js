import { LanguageManageActionType } from 'my-constants/action-types';

let defaultState = {
    allLang : {},
    lang: {},
    langFlag: {},
    isFetching: false,
    formSaveStatus: null,
    formSaveResponse: {},
}

const LanguageManageReducer = (state = defaultState, action) => {

    switch (action.type) {
        case LanguageManageActionType.GET_LANGUAGE_MANAGE:
            return {...state, allLang: action.allLang || state.allLang, lang: action.lang || state.lang, langFlag: action.langFlag || state.langFlag, isFetching: action.isFetching};

        case LanguageManageActionType.DEL_LANGUAGE_MANAGE:
            return {...state, };

        case LanguageManageActionType.SAVE_LANGUAGE_MANAGE:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse, isSaveLoading: action.isSaveLoading}

        case LanguageManageActionType.RESET_FORM_LANGUAGE_MANAGE:
            return {...state, formSaveStatus: null, formSaveResponse: {}}

        default:
            return {...state};
    }
}

export default LanguageManageReducer