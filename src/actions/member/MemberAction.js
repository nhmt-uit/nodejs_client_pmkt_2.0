import { MemberActionType } from 'my-constants/action-types'
import MemberService from 'my-services/member/MemberService'

export const getMember = () => {
    return (dispatch) => {
        return MemberService.getMember().then(res => {
            if(res.status) {
                const optMember = res.res.data.List.map(item => {
                    return {value: item.id, label: item.fullname.toUpperCase()}
                })
                dispatch({
                    type: MemberActionType.GET_MEMBER,
                    payload: res,
                    optMember: optMember,
                })
            }
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