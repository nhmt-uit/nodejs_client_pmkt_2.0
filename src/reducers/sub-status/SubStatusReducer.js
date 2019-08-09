import { get as _get, sortBy as _sortBy } from 'lodash';

import { SubStatusActionType } from 'my-constants/action-types';

let defaultState = {
    lstSub: [],
    isFetchingSub: false,
    isOpenModal: false,
    selectedItem: {},
};

const SubStatusReducer = (state = defaultState, action) => {
    const { active: lstActive = [], locked: lstLocked = [] } = state.lstSub;

    switch (action.type) {
        /* =============== GET SUB USERS ============= */
        case SubStatusActionType.GET_SUB_USERS:
            return {...state, isFetchingSub: true};
        case SubStatusActionType.GET_SUB_USERS_SUCCESS:
            return {...state, lstSub: action.lstSub, isFetchingSub: false};
        case SubStatusActionType.GET_SUB_USERS_FAIL:
            return {...state, isFetchingSub: false};

        /* =============== TOGGLE MODAL ================= */
        case SubStatusActionType.TOGGLE_MODAL:
            return { ...state, isOpenModal: !state.isOpenModal, selectedItem: action.selectedItem };

        /* =============== GET SUB ACTIVE ================ */
        case SubStatusActionType.GET_SUB_ACTIVE_SUCCESS:
            const newLstActive = lstActive;
            const idxItemActive = newLstActive.findIndex(item => item.id === action.item.id);

            if (_get(action, 'lstChild.username', '') === 'nothing' && idxItemActive !== -1) {
                newLstActive.splice(idxItemActive, 1);
            }

            if (_get(action, 'lstChild.username', '') !== 'nothing') {
                if (idxItemActive !== -1) {
                    newLstActive[idxItemActive].child = action.lstChild;
                } else {
                    newLstActive.push({
                        ...action.item,
                        child: action.lstChild
                    })
                }
            }

            return {...state, lstSub: { locked: lstLocked, active: _sortBy(newLstActive, ['username']) }};

        /* =============== GET SUB LOCKED =================== */
        case SubStatusActionType.GET_SUB_LOCKED_SUCCESS:
            const newLstLocked = lstLocked;
            const idxItemLocked = newLstLocked.findIndex(item => item.id === action.item.id);

            if (_get(action, 'lstChild.username', '') === 'nothing' && idxItemLocked !== -1) {
                newLstLocked.splice(idxItemLocked, 1);
            }

            if (_get(action, 'lstChild.username', '') !== 'nothing') {
                if (idxItemLocked !== -1) {
                    newLstLocked[idxItemLocked].child = action.lstChild;
                } else {
                    newLstLocked.push({
                        ...action.item,
                        child: action.lstChild
                    })
                }
            }

            return {...state, lstSub: { locked: _sortBy(newLstLocked, ['username']), active: lstActive }};

        case SubStatusActionType.CLEAR_SUB_USERS:
            return defaultState;

        default:
            return {...state};
    }
};

export default SubStatusReducer