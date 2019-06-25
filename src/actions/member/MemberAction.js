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