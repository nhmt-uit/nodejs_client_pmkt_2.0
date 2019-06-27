import { AppActionType } from 'my-constants/action-types';

export const toggleFullScreen = () => {
    return (dispatch) => {
        dispatch({
            type: AppActionType.APP_TOGGLE_FULL_SCREEN
        })
    }
}