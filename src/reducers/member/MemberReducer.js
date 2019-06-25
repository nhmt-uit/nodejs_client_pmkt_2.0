import { MemberActionType } from 'my-constants/action-types';

let defaultState = {
    member: {},
}

const MemberReducer = (state = defaultState, action) => {

    switch (action.type) {
        case MemberActionType.GET_MEMBER:
            return {...state, member: action.payload};

        default:
            return {...state};
    }
}

export default MemberReducer