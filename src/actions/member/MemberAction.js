import { MemberActionType } from 'my-constants/action-types'
import MemberService from 'my-services/member/MemberService'

export const getMember = () => {
    return (dispatch) => {
        return MemberService.getMember().then(res => {
            if(res.status) {
                const optMember = res.res.data.List.map(item => {
                    return {...item, value: item.id, label: item.fullname.toUpperCase()}
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

export const getFormulaByMember = (params) => {
    return (dispatch) => {
        return MemberService.getFormulaByMember(params).then(res => {
            if(res.status) {
                dispatch({
                    type: MemberActionType.GET_FORMULA_BY_MEMBER,
                    payload: res.res.data.List,
                    selectedItemList: params.selectedItemList,
                })
            }
        })
    }
};




export const resetStoreMember = () => {
    return (dispatch) => {
        dispatch({
            type: MemberActionType.MEMBER_RESET_STORE,
        })
    }
};

export const toggleModalMember = (params = {}) => {
    return (dispatch) => {
        dispatch({
            type: MemberActionType.MEMBER_TOGGLE_MODAL_FORM,
            selectedItem: params.selectedItem,
        })
    }
};

export const toggleModalDeleteMember = (params = {}) => {
    return (dispatch) => {
        dispatch({
            type: MemberActionType.MEMBER_TOGGLE_MODAL_DELETE,
            selectedItem: params.selectedItem,
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

export const resetFormSaveResponse = (params) => {
    return (dispatch) => {
        dispatch({
            type: MemberActionType.MEMBER_RESET_FORM_RESPONSE_FORMULA,
        });
    }
}

export const deleteMember = params => {
    return (dispatch) => {
        MemberService.deleteMember(params.id).then(res => {
            dispatch({
                type: MemberActionType.MEMBER_DELETE_MEMBER,
                formDeleteStatus: res.status,
                formDeleteResponse: res.res
            })
        })
    }
}



export const toggleModalDeleteMemberDetail = (params = {}) => {
    return (dispatch) => {
        dispatch({
            type: MemberActionType.MEMBER_TOGGLE_MODAL_DELETE_DETAIL,
            typeModal: params.typeModal,
            selectedItemDetail: params.selectedItemDetail,
        })
    }
};


export const deleteMemberFormulaDetail = params => {
    console.log(params)
    return (dispatch) => {
        if(params.typeDelete === "single") {
            const paramsDelete = {
                memberId: params.memberId,
                congthuctinhId: params.congthuctinhId,
            }
            MemberService.deleteLinkFormulaDetail(paramsDelete).then(res => {
                dispatch({
                    type: MemberActionType.MEMBER_DELETE_MEMBER_FORMULA,
                    formDeleteDetailStatus: res.status,
                    formDeleteDetailResponse: res.res
                })
            })
        } else if (params.typeDelete === "multiple") {
            const paramsDelete = {
                memberId: params.memberId,
                'congthuctinhIds[]': params.congthuctinhIds,
            }
            MemberService.multipleDeleteLinkFormulaDetail(paramsDelete).then(res => {
                dispatch({
                    type: MemberActionType.MEMBER_DELETE_MEMBER_FORMULA,
                    formDeleteDetailStatus: res.status,
                    formDeleteDetailResponse: res.res
                })
            })
        }
    }
}
