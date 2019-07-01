import { AccountSubActionType } from 'my-constants/action-types'
import AccountSubService from 'my-services/account_sub/AccountSubServices'

export const getMemberSub = () => {
    return (dispatch) => {
        return AccountSubService.getMemberSub().then(res => {

            dispatch({
                type: AccountSubActionType.GET_MEMBER_SUB,
                payload: res,
            })
        })
    }
}

export const delMemberSub = (post) => {
    return (dispatch) => {
        return AccountSubService.delMemberSub(post).then(res => {

            dispatch({
                type: AccountSubActionType.DEL_MEMBER_SUB,
                post: post
            })
        })
    }
}

export const getSuffixesMember = () => {
    return (dispatch) => {
        return AccountSubService.getSuffixesMember().then(res => {

            dispatch({
                type: AccountSubActionType.GET_SUFFIXES_MEMBER,
                payload: res,
            })
        })
    }
}