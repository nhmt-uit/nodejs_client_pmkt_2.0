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
        default:
            return {...state}
    }
}

export default NoticeManageReducer