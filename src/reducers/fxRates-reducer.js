const fxRates = (state = {rate: '', err: ''}, action) => {
    switch (action.type) {
        case 'FX_RATES_SUCCESS' :
            return { rate: action.payload };
        case 'FX_RATES_FAILURE' :
            return { err: 'OPS! Something went wrong!' };
        default :
            return state;
    }
};

export default fxRates;