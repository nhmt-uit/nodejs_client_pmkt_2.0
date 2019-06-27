import { get as _get, partition as _partition } from 'lodash'
import { AccountActionType } from 'my-constants/action-types'

let defaultState = {
	initFormData: {},
	optBanker: [],
	optAccountBelong: []
}

export const AccountReducer = (state = defaultState, action) => {
	switch(action.type){
		case AccountActionType.ACCOUNT_INIT_FROM_DATA:
			let optBanker = []
			let optAccountBelong = []
			let bankerList = _get(action.initFormData, 'bankerList')
			if(bankerList) {
				for(let x in bankerList) {
					optBanker.push({ ...bankerList[x], value: bankerList[x].id, label: bankerList[x].name.toUpperCase()})

					let groupOtion = action.initFormData.accountList.filter(item => item.banker_id == bankerList[x].id)
					groupOtion.map(item => {
						item.value = item.id
						item.label = item.acc_name.toUpperCase()
					})
					optAccountBelong.push({label: bankerList[x].name.toUpperCase(), value: bankerList[x].id, options: groupOtion})
				}
			}

			return {...state, initFormData: action.initFormData, optBanker: optBanker, optAccountBelong: optAccountBelong}
		default:
			return {...state}
	}
}


export default AccountReducer;