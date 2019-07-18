import { get as _get } from 'lodash'
import { AccountActionType } from 'my-constants/action-types'

let defaultState = {
	initFormData: {},
	optBanker: [],
	optAccountBelong: [],

	//Handle Modal Delete Member
	isOpenModalDelete: false,
	formDeleteStatus: null,
	formDeleteResponse: {},

	//Handle Modal Form Member
	selectedItem: {},
	isOpenModal: false,
	isOpenLinkFormula: false,

	//Handel Save Form
	formSaveStatus: null,
	formSaveResponse: {},

	lstTab: [],
	lstAccount: [],

	modalLinkFormula: {
		lstMember: [],
		lstFormula: [],
		lstFormulaGroup: [],
	}
};

export const AccountReducer = (state = defaultState, action) => {
	switch(action.type){
		case AccountActionType.ACCOUNT_RESET_STORE:
            return {...defaultState}
		case AccountActionType.ACCOUNT_INIT_FORM_DATA:
			let optBanker = []
			let optAccountBelong = []
			let bankerList = _get(action.initFormData, 'bankerList')
			if(bankerList) {
				for(let x in bankerList) {
					optBanker.push({ ...bankerList[x], value: bankerList[x].id, label: bankerList[x].name.toUpperCase()})

					let groupOtion = action.initFormData.accountList.filter(item => item.banker_id === bankerList[x].id)
					groupOtion.map(item => {
						item.value = item.id
						item.label = item.acc_name.toUpperCase()
					})
					optAccountBelong.push({label: bankerList[x].name.toUpperCase(), value: bankerList[x].id, options: groupOtion})
				}
			}
			return {...state, initFormData: action.initFormData, optBanker: optBanker, optAccountBelong: optAccountBelong}
		case AccountActionType.ACCOUNT_TOGGLE_MODAL_FORM:
			let newState = {
				...defaultState,
				lstTab: state.lstTab,
				lstAccount: state.lstAccount,
			};

			//Reset Store When Modal Close
			if (!state.isOpenModal === true && !action.isModalLinkFormula) {
				newState = {...state, selectedItem: action.selectedItem, isOpenModal: true};
			}

			if (!state.isOpenLinkFormula === true && action.isModalLinkFormula) {
				newState = {...state, selectedItem: action.selectedItem, isOpenLinkFormula: true};
			}

			return newState;

		case AccountActionType.ACCOUNT_TOGGLE_MODAL_DELETE:
			//Reset Store When Modal Close
			//Reset Store When Modal Close
			if (!state.isOpenModalDelete === false) return {...defaultState}
			return {...state, selectedItem: action.selectedItem, isOpenModalDelete: !state.isOpenModalDelete};
		case AccountActionType.ACCOUNT_SAVE_FORM_DATA:
			return {...state, formSaveStatus: action.formSaveStatus, formSaveResponse: action.formSaveResponse}
		case AccountActionType.ACCOUNT_DELETE_ITEM:
			return {...state, formDeleteStatus: action.formDeleteStatus, formDeleteResponse: action.formDeleteResponse}
		case AccountActionType.ACCOUNT_RESET_FORM_RESPONSE:
			return {...state, formSaveStatus: null, formSaveResponse: {}};

		case AccountActionType.GET_TAB_SUCCESS:
			return { ...state, lstTab: action.payload, error: null };
		case AccountActionType.GET_TAB_FAIL:
			return { ...state, error: action.payload };

		case AccountActionType.GET_ACCOUNT:
			return { ...state, error: null, isFetchingAccount: true };
		case AccountActionType.GET_ACCOUNT_SUCCESS:
			return { ...state, lstAccount: action.payload, isFetchingAccount: false, error: null };
		case AccountActionType.GET_ACCOUNT_FAIL:
			return { ...state, isFetchingAccount: false, error: action.payload };

		default:
			return {...state}
	}
};


export default AccountReducer;