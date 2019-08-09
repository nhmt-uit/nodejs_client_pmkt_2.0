import React, {Component} from 'react';
import {
    Button, Col, Form, FormGroup, Input, Label,
    Modal, ModalBody, ModalFooter, ModalHeader,
} from "reactstrap";
import Select from "react-select";
import { cloneDeep as _cloneDeep, get as _get, debounce as _debounce } from 'lodash';

import { TransComponent } from 'my-components';
import { CurrencyTypeService } from 'my-services/currency-type';

class CurrencyCreateModal extends Component {
    constructor(props) {
        super(props);

        this.optRound = [
            { label: 'XO', value: -1 },
            { label: 'X', value: 0 },
            { label: 'O.X', value: 1 },
            { label: 'O.OX', value: 2 },
        ];

        this.defaultState = {
            example: 1234.1235,
            exampleResult: this.roundFn(1234.1235, -1),
            round: -1,
            optRoundSelect: { label: 'XO', value: -1 },
            isLoading: false,
            currencyName: '',
            isSuccess: null,
            msg: null,
            msgValidateName: null,
        };

        this.state = _cloneDeep(this.defaultState);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isOpenCreateModal && !prevProps.isOpenCreateModal) {
            this.setState(_cloneDeep(this.defaultState));
        }
    }

    roundFn = (base, exponent) => {
        const places = Math.pow(10, exponent);

        return Math.round(base * places) / places;
    };

    toggleModal = () => this.props.onToggle();

    handleChangeInput = (name, value) => {
        this.setState({ [name]: value }, () => this.handleValidator());
    };

    handleValidator = _debounce(async () => {
        const formData = { value: this.state.currencyName.trim() };

        if (this.state.currencyName) {
            const result = await CurrencyTypeService.validator(formData);

            if (!result.status) {
                this.setState({ msgValidateName: _get(result, 'res.data.message') })
            } else {
                this.setState({ msgValidateName: null })
            }
        } else {
            this.setState({ msgValidateName: null })
        }
    }, 300);

    handleChangeSelect = name => value => {
        this.setState({
            [name]: value.value,
            exampleResult: this.roundFn(this.state.example, value.value),
            optRoundSelect: value
        })
    };

    handleSave = () => {
        const formData = {
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

                setTimeout(() => this.setState(_cloneDeep(this.defaultState)), 3000);
            })
        })
    };

    render() {
        return (
            <Modal isOpen={this.props.isOpenCreateModal} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}><strong><TransComponent i18nKey="Create currency" /></strong></ModalHeader>
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
                        <FormGroup row className={ this.state.msgValidateName ? 'has-error' : '' }>
                            <Label sm={3}><TransComponent i18nKey="Currency name" /></Label>
                            <Col sm={9}>
                                <Input
                                    autoComplete="off"
                                    onChange={e => this.handleChangeInput(e.target.name, e.target.value)}
                                    type="text"
                                    name="currencyName"
                                    id="currencyName"
                                    value={this.state.currencyName}
                                />
                                { this.state.msgValidateName ? <div className="help-block"><TransComponent i18nKey={this.state.msgValidateName} /></div> : null }
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
                        disabled={this.state.isLoading || this.state.msgValidateName || !this.state.currencyName}
                    ><TransComponent i18nKey="Save" />{ this.state.isLoading ? <>&nbsp;<i className="fa fa-spin fa-spinner" /></> : null }</Button>&nbsp;
                    <Button className="green" onClick={this.toggleModal}><TransComponent i18nKey="Close" /></Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default CurrencyCreateModal;