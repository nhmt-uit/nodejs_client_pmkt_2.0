import { SubStatusActionType } from 'my-constants/action-types';

let defaultState = {
    lstSub: [],
    isFetchingSub: false,
    isOpenModal: false,
    selectedItem: {},
};

const SubStatusReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SubStatusActionType.GET_SUB_USERS:
            return {...state, isFetchingSub: true};
        case SubStatusActionType.GET_SUB_USERS_SUCCESS:
            return {...state, lstSub: action.lstSub, isFetchingSub: false};
        case SubStatusActionType.GET_SUB_USERS_FAIL:
            return {...state, isFetchingSub: false};

        case SubStatusActionType.TOGGLE_MODAL:
            return { ...state, isOpenModal: !state.isOpenModal, selectedItem: action.selectedItem };

        default:
            return {...state};
    }
};

export default SubStatusReducer