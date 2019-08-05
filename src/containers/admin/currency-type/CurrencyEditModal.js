import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button, Col, Form, FormGroup, Input, Label,
    Modal, ModalBody, ModalFooter, ModalHeader,
    Alert
} from "reactstrap";
import Select from "react-select";
import { find as _find, get as _get } from 'lodash';

import { TransComponent } from 'my-components';
import { CurrencyTypeService } from 'my-services/currency-type';

class CurrencyEditModal extends Component {
    constructor(props) {
        super(props);

        this.optRound = [
            { label: 'XO', value: -1 },
            { label: 'X', value: 0 },
            { label: '0.X', value: 1 },
            { label: '0.0X', value: 2 },
        ];

        this.state = {
            example: 1234.1235,
            exampleResult: '',
            round: -1,
            optRoundSelect: {},
            isLoading: false,
            currencyName: '',
            isSuccess: null,
            msg: null,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.currency && this.props.currency !== prevProps.currency) || (this.props.isOpenEditModal && !prevProps.isOpenEditModal)) {
            this.setState({
                exampleResult: this.roundFn(this.state.example, (this.props.currency.filter || -1)),
                round: this.props.currency.filter !== undefined ? this.props.currency.filter : -1,
                currencyName: this.props.currency.name || '',
                optRoundSelect: _find(this.optRound, ['value', (this.props.currency.filter)] || {}),
            })
        }
    }

    roundFn = (base, exponent) => {
        const places = Math.pow(10, exponent);

        return Math.round(base * places) / places;
    };

    toggleModal = () => this.props.onToggle();

    handleChangeInput = e => {
        const { name, value } = e.target;

        this.setState({
            [name]: value,
        });
    };

    handleChangeSelect = name => value => {
        this.setState({ [name]: value.value, exampleResult: this.roundFn(this.state.example, value.value) })
    };

    handleSave = () => {
        const currency = this.props.currency;
        const formData = {
            id: currency.id,
            currency_name: this.state.currencyName,
            round: this.state.round,
        };

        this.setState({ isLoading: true }, async () => {
            const result = await CurrencyTypeService.actionCurrencyType(formData);
            const newState = { isLoading: false };

            if (result.status) {
                newState.isSuccess = true;
                newState.msg = _get(result, 'res.data.message');
            } else {
                newState.isSuccess = false;
                newState.msg = _get(result, 'res.data.message');
            }

            this.setState(newState, () => {
                this.props.onFinish();

                setTimeout(() => this.setState({ isSuccess: null }), 3000);
            })
        })
    };

    render() {
        return (
            <Modal isOpen={this.props.isOpenEditModal} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}><strong><TransComponent i18nKey="Update currency" /></strong></ModalHeader>
                <ModalBody>
                    <Form>
                        {
                            this.state.isSuccess !== null
                                ? (
                                    <FormGroup row>
                                        <Label sm={12}>
                                            <div role="alert" className={`alert ${this.state.isSuccess ? 'bg-success font-success border-success' : 'alert-danger'}`}>{ this.state.msg }</div>
                                        </Label>
                                    </FormGroup>
                                )
                                : null
                        }
                        <FormGroup row>
                            <Label sm={3}><TransComponent i18nKey="Currency name" /></Label>
                            <Col sm={9}>
                                <Input value={this.state.currencyName} onChange={e => this.handleChangeInput(e)} type="text" name="currencyName" id="currencyName" />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={3}><TransComponent i18nKey="Round" /></Label>
                            <Col sm={9}>
                                <Select
                                    className="basic-single"
                                    classNamePrefix="select"
                                    name="round"
                                    placeholder={<TransComponent i18nKey="Select" />}
                                    options={this.optRound}
                                    isSearchable={false}
                                    value={this.state.optRoundSelect}
                                    onChange={this.handleChangeSelect('round')}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={3}>Ví dụ</Label>
                            <Label sm={9}><b>{ this.state.example }</b></Label>
                        </FormGroup>
                        <FormGroup row>
                            <Label sm={3}>Result</Label>
                            <Label sm={9}><b>{ this.state.exampleResult }</b></Label>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="red"
                        onClick={this.handleSave}
                        disabled={this.state.isLoading}
                    ><TransComponent i18nKey="Save" />{ this.state.isLoading ? <>&nbsp;<i className="fa fa-spin fa-spinner" /></> : null }</Button>&nbsp;
                    <Button className="green" onClick={this.toggleModal}><TransComponent i18nKey="Close" /></Button>
                </ModalFooter>
            </Modal>
        )
    }
}

CurrencyEditModal.propTypes = {
    isOpenEditModal: PropTypes.bool,
    onToggle: PropTypes.func,
    currency: PropTypes.object,
};

CurrencyEditModal.defaultProps = {
    isOpenEditModal: false,
    currency: {},
    onToggle: () => void(0),
};

export default CurrencyEditModal;