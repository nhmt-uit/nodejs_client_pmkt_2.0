import { NoticeManageActionType } from 'my-constants/action-types'

let defaultState = {
    allLang: {},
    lang: {},
    langFlag: {},
    formSaveStatus: null,
    formSaveResponse: {},
}

const NoticeManageReducer = (state = defaultState, action) => {
    switch (action.type) {
        case NoticeManageActionType.GET_NOTICE_MANAGE:
            return {...state, allLang: action.allLang, lang: action.lang, langFlag: action.langFlag };
        case NoticeManageActionType.DEL_NOTICE_MANAGE:
            return {...state};
        case NoticeManageActionType.SAVE_NOTICE_MANAGE:
            return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse};
        case NoticeManageActionType.RESET_FORM_SAVE_RESPONSE:
            return {...state, formSaveStatus: null, formSaveResponse: {} };
        default:
            return {...state}
    }
}

export default NoticeManageReducer