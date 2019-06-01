import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as fxRatesActions from './../actions/fxRates-actions';
import Select from 'react-select';

const actions = { ...fxRatesActions };

class HomePage extends Component {

    state = {
        fxRates: [],
        USD: 250000,
        EUR: 200000,
        GBP: 0,
        selectedFromAccount: {},
        selectedToAccount: {},
        selectedAccount: '',
        targetCurrency: '',
        fromAccount: '',
    };

    componentDidMount() {
        this.props.getFxRates(this.state.selectedFromAccount.currencyLabel);
        this.interval = setInterval(() => this.props.getFxRates(this.state.selectedFromAccount.currencyLabel), 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    inputHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    };

    handleExchange = (result) => {
        const fromAcc = this.state.selectedFromAccount.currencyLabel || 'EUR';
        const toAcc = this.state.selectedToAccount.currencyLabel || 'GBP';

        if(this.state[fromAcc] >= this.state.fromAccount) {
            this.setState({
                [fromAcc]: this.state[fromAcc] - this.state.fromAccount,
                [toAcc]: this.state[toAcc] + result,
            })
        } else {
            alert('Insufficient balance');
        }

    };

    render() {
        const defaultFromAccount = {
            value: this.state.EUR,
            label: `EUR ${this.state.EUR}`,
            currency: '€',
            currencyLabel: 'EUR'
        };
        const defaultToAccount = {
            value: this.state.GBP,
            label: `GBP ${this.state.GBP}`,
            currency: '£',
            currencyLabel: 'GBP'
        };

        const accounts = [
            { value: this.state.USD, label: `USD ${this.state.USD}`, currency: '$', currencyLabel: 'USD' },
            { value: this.state.EUR, label: `EUR ${this.state.EUR}`, currency: '€', currencyLabel: 'EUR' },
            { value: this.state.GBP, label: `GBP ${this.state.GBP}`, currency: '£', currencyLabel: 'GBP' },
        ];

        const exchangeRate = this.props.fxRates.rate ? this.props.fxRates.rate.rates[this.state.selectedToAccount.currencyLabel || 'GBP'] : 0;
        const result = Number((exchangeRate * this.state.fromAccount).toFixed(2));

        return (
            <div className="exchange-component">
                <p className="title">Exchange money</p>
                <div className="row">
                    <div className="col-md-6 left">
                        <div className="content">
                            From
                            <Select
                                defaultValue={defaultFromAccount}
                                options={accounts}
                                onChange={item => {
                                        this.setState({
                                            selectedFromAccount: item
                                        });
                                        this.props.getFxRates(item.currencyLabel);
                                    }
                                }
                            />
                            <div className="number-input">
                                {this.state.selectedFromAccount.currency
                                    ? this.state.fromAccount && `- ${this.state.selectedFromAccount.currency}`
                                    : this.state.fromAccount && `- ${defaultFromAccount.currency}`}
                                <input
                                    name="fromAccount"
                                    type="number"
                                    inputMode="decimal"
                                    min="0" max="100000"
                                    placeholder={`${this.state.selectedFromAccount.currency || '€'} 0`}
                                    onChange={e => this.inputHandler(e)}
                                />
                            </div>
                            {exchangeRate && `Current rate: ${exchangeRate}`}
                        </div>
                    </div>
                    <div className="col-md-6 right">
                        <div className="content">
                            To
                            <Select
                                defaultValue={defaultToAccount}
                                options={accounts}
                                onChange={item => this.setState({
                                    selectedToAccount: item
                                })}
                            />
                        </div>
                        <div className="number-input">
                            + {`${this.state.selectedToAccount.currency || '£'}`}
                            {result}
                        </div>
                    </div>

                </div>
                <button className="exchangeButton"
                        onClick={()=> this.handleExchange(result)}
                >Exchange money</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fxRates: state.fxRates,
    }
};

export default connect(mapStateToProps, actions)(HomePage)
