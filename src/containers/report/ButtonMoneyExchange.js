import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get as _get } from 'lodash';

import { TransComponent } from 'my-components';

class ButtonMoneyExchange extends Component {
    state = { btnMoneyExchangeClicked: false, showAll: false };

    changeState = state => _ => {
        this.setState(state, _ => {
            this.props.toggleBtnMoneyExchange(this.state.btnMoneyExchangeClicked);
        });
    }

    handleToggleModalMoneyExchange = () => {
        return this.props.onToggleModalMoneyExchange();
    }

    handleToggleShowAll = () => {
        this.setState({
            showAll: !this.state.showAll
        }, () => {
            return this.props.onToggleShowAll(this.state.showAll);
        });
    }

    render() {
        const { btnMoneyExchangeClicked, showAll } = this.state;

        if (btnMoneyExchangeClicked) {
            return (
                <div className="btn-money-exchange">
                    <button className="btn red" onClick={this.changeState({ btnMoneyExchangeClicked: false })}><TransComponent i18nKey="Close" /></button>&nbsp;&nbsp;
                    <button className="btn green" onClick={this.handleToggleModalMoneyExchange} disabled={!this.props.moneyExchangeIds.length > 0} ><TransComponent i18nKey="Continue" /></button>
                </div>
            );
        }

        return (
            <div className="btn-money-exchange">
                <label class="mt-checkbox mt-checkbox-outline"> <TransComponent i18nKey="Show all" />
                    <input type="checkbox" checked={showAll} onClick={this.handleToggleShowAll} name="test" />
                    <span></span>
                </label>&nbsp;&nbsp;&nbsp;&nbsp;
                <button className="btn green" onClick={this.changeState({ btnMoneyExchangeClicked: true })}>
                    <TransComponent i18nKey="Money Exchange" />
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        moneyExchangeIds: _get(state, 'ReportReducer.moneyExchangeIds', []),
    };
}

export default connect(mapStateToProps, null)(ButtonMoneyExchange);

