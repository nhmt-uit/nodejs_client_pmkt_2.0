import { AccountSubActionType } from 'my-constants/action-types'
import AccountSubService from 'my-services/account_sub/AccountSubServices'

export const getMemberSub = () => {
    return (dispatch) => {
        return AccountSubService.getMemberSub().then(res => {
            if(res.status) {
                var memberSub = res.res.data.List;
                dispatch({
                    type: AccountSubActionType.GET_MEMBER_SUB,
                    memberSub: memberSub,
                })
            }
        })
    }
}

export const getSuffixesMember = () => {
    return (dispatch) => {
        return AccountSubService.getSuffixesMember().then(res => {
            if(res.status) {
                const suffixesMember = {
                    s1: res.res.s1,
                    s2: res.res.s2,
                    s3: res.res.s3,
                    username: res.res.username,
                }
                dispatch({
                    type: AccountSubActionType.GET_SUFFIXES_MEMBER,
                    suffixesMember: suffixesMember,
                })
            }
        })
    }
}

export const delMemberSub = (post, isInitial = false) => {
    return (dispatch) => {
        if (!isInitial){
            dispatch({
                type: AccountSubActionType.DEL_MEMBER_SUB,
                isDeleteLoading: true
            });
        }
        return AccountSubService.delMemberSub(post).then(res => {
            dispatch({
                type: AccountSubActionType.DEL_MEMBER_SUB,
                post: post,
                isDeleteLoading: false,
            })
        })
    }
}

export const createMemberSub = (post) => {
    return (dispatch) => {
        return AccountSubService.createMemberSub(post).then(res => {
            dispatch({
                type: AccountSubActionType.CREATE_MEMBER_SUB,
                formSaveStatus: res.status,
                formSaveResponse: res.res
            })
        })
    }
}

export const toggleModalMemberSub = () => {
    return (dispatch) => {
        dispatch({
            type: AccountSubActionType.MEMBER_SUB_TOGGLE_MODAL_FORM,
        })
    }
};

export const toggleModalEditMemberSub = () => {
    return (dispatch) => {
        dispatch({
            type: AccountSubActionType.MEMBER_SUB_TOGGLE_MODAL_EDIT_FORM,
        })
    }
};

export const resetFormSaveResponse = (params) => {
    return (dispatch) => {
        dispatch({
            type: AccountSubActionType.RESET_FORM_SAVE_ACCOUNT_SUB,
        });
    }
}