import { MemberActionType } from 'my-constants/action-types'
import MemberService from 'my-services/member/MemberService'

export const getMember = () => {
    return (dispatch) => {
        return MemberService.getMember().then(res => {
            dispatch({
                type: MemberActionType.GET_MEMBER,
                payload: res,
            })
        })
    }
};

export const resetStore = () => {
    return (dispatch) => {
        dispatch({
            type: MemberActionType.MEMBER_RESET_STORE,
        })
    }
};

export const toggleModalMember = () => {
    return (dispatch) => {
        dispatch({
            type: MemberActionType.MEMBER_TOGGLE_MODAL_FORM,
        })
    }
};


export const saveMember = (payload) => {
    return (dispatch) => {
        MemberService.createMember(payload).then(res => {
            dispatch({
                type: MemberActionType.MEMBER_SAVE_FORM,
                formSaveStatus: res.status,
                formSaveResponse: res.res
            })
        })
    }
};