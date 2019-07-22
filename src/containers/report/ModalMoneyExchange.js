import React, { Component } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Form, FormGroup, Label, Col,
    Input
} from 'reactstrap';
import Select from 'react-select';
import { withTranslation } from 'react-i18next';
import { get as _get } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { TransComponent } from 'my-components';
import { Helpers } from 'my-utils';

class ModalMoneyExchange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rate: '',
            from: { label: '', value: '' },
            to: { label: '', value: '' }
        };
    }

    toggleModalMoneyExchange = () => {
        return this.props.onToggleModalMoneyExchange();
    }

    handleChangeRate = e => {
        this.setState({
            rate: e.target.value
        });
    }

    parseCurrencyToOptions (currencyMap) {
        if (!currencyMap) {
            return [];
        }

        return currencyMap.map(item => {
            return { label: item.dv_tien_te, value: item.dv_tien_te_id };
        });
    }

    handleChangeSelect = name => value => {
        const newState = {
            [name]: value
        };

        if (name === 'from') {
            newState.to = { label: '', value: '' };
        }

        this.setState(newState);
    }

    handleSubmitForm = () => {
        const { from, to, rate } = this.state;
        const params = { from: from.value, to: to.value, rate, moneyExchangeIds: this.props.moneyExchangeIds };

        return this.props.onMoneyExchange(params);
    }

    render() {
        const currencyMap = this.props.currencyMap;
        const fromOptions = this.parseCurrencyToOptions(currencyMap);
        const toOptions = fromOptions.filter(item => item.value !== _get(this.state, 'from.value'));
        const { rate, from, to } = this.state;

        return (
            <Modal isOpen={this.props.isOpenModalMoneyExchange} toggle={this.toggleModalMoneyExchange}>
                <ModalHeader toggle={this.toggleModalMoneyExchange}><strong><TransComponent i18nKey="Money Exchange" /></strong></ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup row>
                            <Label for="rate" sm={2}>Rate</Label>
                            <Col sm={10}>
                                <Input onChange={e => this.handleChangeRate(e)} type="text" name="rate" id="rate" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="from" sm={2}>From</Label>
                            <Col sm={10}>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="from"
                                    placeholder={this.props.t('Select')}
                                    options={fromOptions}
                                    isSearchable={false}
                                    value={from}
                                    onChange={this.handleChangeSelect('from')}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="to" sm={2}>To</Label>
                            <Col sm={10}>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="to"
                                    isSearchable={false}
                                    value={to}
                                    options={toOptions}
                                    placeholder={this.props.t('Select')}
                                    onChange={this.handleChangeSelect('to')}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={2} />
                            <Label sm={10}>
                                Result = Total * { (rate && !isNaN(rate)) ? Helpers.formatMoney(rate, 0) : '' }
                            </Label>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        disabled={!rate || isNaN(rate) || !from.value || !to.value}
                        className="red"
                        onClick={this.handleSubmitForm}
                    ><TransComponent i18nKey="Submit" /></Button>&nbsp;
                    <Button className="green" onClick={this.toggleModalMoneyExchange}><TransComponent i18nKey="Close" /></Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        moneyExchangeIds: _get(state, 'ReportReducer.moneyExchangeIds', []),
    };
}

export default compose(
    connect(mapStateToProps, null),
    withTranslation()
)(ModalMoneyExchange);
