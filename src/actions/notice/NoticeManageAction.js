import { NoticeManageActionType } from 'my-constants/action-types'
import NoticeManageService from 'my-services/notice/NoticeManageService'

export const getNoticeManage = () => {
    return (dispatch) => {
        return NoticeManageService.getNoticeManage().then( res => {
            if(res.status){
                var allLang = res.res.data.allLang;
                var lang = res.res.data.lang;
                var langFlag = res.res.data.langFlag;
                dispatch({
                    type: NoticeManageActionType.GET_NOTICE_MANAGE,
                    allLang: allLang,
                    lang: lang,
                    langFlag: langFlag,
                })
            }
        })
    }
};

export const delNoticeManage = (post) => {
    return (dispatch) => {
        return NoticeManageService.delNoticeManage(post).then( res => {
            dispatch({
                type: NoticeManageActionType.DEL_NOTICE_MANAGE,
            })
        })
    }
}

export const saveNoticeManage = (post, isInitial = false) => {
    return (dispatch) => {
        if (!isInitial){
            dispatch({
                type: NoticeManageActionType.SAVE_NOTICE_MANAGE,
                isSaveLoading: true
            });
        }
        return NoticeManageService.saveNoticeManage(post).then( res => {
            dispatch({
                type: NoticeManageActionType.SAVE_NOTICE_MANAGE,
                formSaveStatus: res.status,
                formSaveResponse: res.res,
                isSaveLoading: false,
            })
        })
    }

}

export const resetFormSaveResponse = () => {
    return (dispatch) => {
        dispatch({
            type: NoticeManageActionType.RESET_FORM_SAVE_RESPONSE,
        })
    }
}