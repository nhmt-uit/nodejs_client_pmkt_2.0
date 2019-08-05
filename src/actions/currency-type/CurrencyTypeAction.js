import { CurrencyTypeActionType } from 'my-constants/action-types'

import { get as _get } from 'lodash';
import { CurrencyTypeService } from 'my-services/currency-type'

export const getCurrencyType = () => {
    return (dispatch) => {
        dispatch({
            type: CurrencyTypeActionType.GET_CURRENCY_TYPE
        });

        return CurrencyTypeService.getCurrencyType()
            .then(res => {
                if (res.status) {
                    dispatch({
                        type: CurrencyTypeActionType.GET_CURRENCY_TYPE_SUCCESS,
                        lstCurrencyType: _get(res, 'res.data.List', [])
                    });
                } else {
                    dispatch({
                        type: CurrencyTypeActionType.GET_CURRENCY_TYPE_FAIL,
                        payload: {
                            status: false,
                            error_description: _get(res, 'res.data.message', '')
                        },
                    });
                }
            }).catch(e => {
                dispatch({
                    type: CurrencyTypeActionType.GET_CURRENCY_TYPE_FAIL,
                    payload: _get(e, 'response.data', {
                        status: false,
                        error_description: e.stack,
                    }),
                });
            });
    }
};