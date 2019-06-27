import { AppActionType } from 'my-constants/action-types';

let defaultState = {
    isFullScreen: false,
}

const AppReducer = (state = defaultState, action) => {
    switch (action.type) {
        case AppActionType.APP_TOGGLE_FULL_SCREEN:
            return {...state, isFullScreen: !state.isFullScreen};
        default:
            return {...state};
    }
}

export default AppReducer