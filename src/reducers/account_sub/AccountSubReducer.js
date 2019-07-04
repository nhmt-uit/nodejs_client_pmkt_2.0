import { AccountSubActionType } from 'my-constants/action-types';

let defaultState = {
    memberSub: {},
    suffixesMember: {},
}

const AccountSubReducer = (state = defaultState, action) => {

    switch (action.type) {
        case AccountSubActionType.GET_MEMBER_SUB:
            return {...state, memberSub: action.payload};
        case AccountSubActionType.DEL_MEMBER_SUB:
            return {...state,};
        default:
            return {...state};
    }
}

export default AccountSubReducer