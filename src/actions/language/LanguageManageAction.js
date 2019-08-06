import {LanguageManageActionType} from 'my-constants/action-types'
import LanguageManageService from 'my-services/language/LanguageManageService'
import _get from "lodash/get";
import { Helpers } from 'my-utils'

export const getLanguageManage = (isInitial = false) => {
    return (dispatch) => {
        if(!isInitial){
            dispatch({
                type: LanguageManageActionType.GET_LANGUAGE_MANAGE,
                isFetching: true,
            })
        }
        LanguageManageService.getLanguageManage().then(res => {
            if(res.status) {
                var data = res.res.data
                dispatch({
                    type: LanguageManageActionType.GET_LANGUAGE_MANAGE,
                    allLang : data.allLang,
                    lang: data.lang,
                    langFlag: data.langFlag,
                    isFetching: false,
                })
            } else {
                dispatch({
                    type: LanguageManageActionType.GET_LANGUAGE_MANAGE,
                    payload: {
                        status: false,
                        error_description: _get(res, 'res.data.message', '')
                    },
                    isFetching: false
                })
            }
        })
    }
}

export const delLanguageManage = (post) => {
    return (dispatch) => {
        return LanguageManageService.delLanguageManage(post).then(res => {
            dispatch({
                type: LanguageManageActionType.DEL_LANGUAGE_MANAGE,
                post: post,
            })
        })
    }
}

export const saveLanguageManage = (post) => {
    return (dispatch) => {
        return LanguageManageService.saveLanguageManage(post).then( async res => {
            dispatch({
                type: LanguageManageActionType.SAVE_LANGUAGE_MANAGE,
                formSaveStatus: res.status,
                formSaveResponse: res.res
            })
            //Clear Message
            await Helpers.sleep(2000)
            dispatch(resetFormSaveResponse())
        })
    }
};

export const resetFormSaveResponse = (params) => {
    return (dispatch) => {
        dispatch({
            type: LanguageManageActionType.RESET_FORM_LANGUAGE_MANAGE,
        });
    }
}