import * as types from './types';
import axios from 'axios';

export function getFxRates(currencyLabel) {
    return async function (dispatch) {
        try {
            const base = currencyLabel ? currencyLabel : 'EUR';
            const res = await axios.get(`https://api.exchangeratesapi.io/latest?base=${base}`);
            dispatch({
                type:types.FX_RATES_SUCCESS,
                payload: res.data,
            })
        } catch (err) {
            dispatch({
                type:types.FX_RATES_FAILURE,
                payload: err,
            })
        }
    }
}

export default getFxRates();
