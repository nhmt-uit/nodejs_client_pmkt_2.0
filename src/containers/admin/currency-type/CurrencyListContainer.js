import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { TransComponent, LoadingComponent } from 'my-components'
import { getCurrencyType } from 'my-actions/currency-type/CurrencyTypeAction';
import { CurrencyEditModal, CurrencyCreateModal } from 'my-containers/admin/currency-type';
import {Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Select from "react-select";

import { CurrencyTypeService } from 'my-services/currency-type';

class CurrencyListContainer extends Component {
    state = {
        isOpenEditModal: false,
        currencySelected: {},
        isOpenCreateModal: false,
        isOpenDeleteModal: false,
        isDeleting: false,
    };

    componentDidMount() {
        this.props.getCurrencyType();
    }

    handleChangeState = (state, cb) => () => {
        this.setState(state, () => {
            if (typeof cb === 'function') cb();
        });
    };

    handle(){}

    getTypeRound(value) {
        switch (value) {
            case -1: return 'XO';
            case 0: return 'X';
            case 1: return 'O.X';
            case 2: return 'O.OX';
        }
    }

    renderBody() {
        const { lstCurrencyType } = this.props;

        return lstCurrencyType.map((currency, idx) => {
            return (
                <tr key={idx}>
                    <td>{ idx + 1 }</td>
                    <td>{ currency.name }</td>
                    <td>{ this.getTypeRound(currency.filter) }</td>
                    <td className="text-center">
                        <i className="fa fa-edit font-green cursor-pointer" onClick={this.handleChangeState({ isOpenEditModal: true, currencySelected: currency })} />
                    </td>
                    <td className="text-center">
                        <i onClick={this.handleChangeState({ isOpenDeleteModal: true, currencySelected: currency })} className="fa fa-times-circle cursor-pointer font-red-sunglo" />
                    </td>
                </tr>
            );
        });
    }

    handleDelete = () => {
        const currency = this.state.currencySelected;

        this.setState({ isDeleting: true }, async () => {
            const result = await CurrencyTypeService.deleteCurrency({ id: currency.id });
            const newState = { isOpenDeleteModal: false, isDeleting: false };

            newState.isSuccess = result.status;

            this.setState(newState, () => {
                if (result.status) this.props.getCurrencyType();
            })
        })
    };

    render() {
        const { isFetchingCurrency, lstCurrencyType } = this.props;

        return (
            <>
                <div className="portlet box blue-hoki position-relative">
                    { isFetchingCurrency && !lstCurrencyType.length ? <LoadingComponent/> : null }
                    <button onClick={this.handleChangeState({ isOpenCreateModal: true })} className="btn btn-danger btn-add-formula"><TransComponent i18nKey="Add new" /></button>
                    <div className="portlet-title">
                        <div className="caption bold uppercase font-size-15"><TransComponent i18nKey="Currency list" /></div>
                    </div>
                    <div className="portlet-body position-relative">
                        { isFetchingCurrency && lstCurrencyType.length ? <LoadingComponent /> : null }
                        <div className="table-responsive">
                            <table className="table table-hover table-formula">
                                <thead className="font-red-sunglo">
                                <tr>
                                    <th>#</th>
                                    <th><TransComponent i18nKey='Name' /></th>
                                    <th><TransComponent i18nKey="Làm tròn" /></th>
                                    <th className="text-center"><TransComponent i18nKey='Edit' /></th>
                                    <th className="text-center"><TransComponent i18nKey='Delete' /></th>
                                </tr>
                                </thead>
                                <tbody>
                                { this.renderBody() }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <CurrencyEditModal
                    currency={this.state.currencySelected}
                    isOpenEditModal={this.state.isOpenEditModal}
                    onToggle={this.handleChangeState({ isOpenEditModal: !this.state.isOpenEditModal })}
                    onFinish={() => this.props.getCurrencyType()}
                />
                <CurrencyCreateModal
                    isOpenCreateModal={this.state.isOpenCreateModal}
                    onToggle={this.handleChangeState({ isOpenCreateModal: !this.state.isOpenCreateModal })}
                    onFinish={() => this.props.getCurrencyType()}
                />
                <Modal isOpen={this.state.isOpenDeleteModal} toggle={this.handleChangeState({ isOpenDeleteModal: !this.state.isOpenDeleteModal })}>
                    <ModalHeader toggle={this.handleChangeState({ isOpenDeleteModal: !this.state.isOpenDeleteModal })}>
                        <strong><TransComponent i18nKey="Xac nhan" /></strong>
                    </ModalHeader>
                    <ModalBody><TransComponent i18nKey="Are you sure ?" /></ModalBody>
                    <ModalFooter>
                        <Button
                            className="red"
                            onClick={this.handleDelete}
                            disabled={this.state.isDeleting}
                        ><TransComponent i18nKey="Delete" />{ this.state.isDeleting ? <>&nbsp;<i className="fa fa-spin fa-spinner" /></> : null }</Button>&nbsp;
                        <Button className="green" onClick={this.toggleModal}><TransComponent i18nKey="Close" /></Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

CurrencyListContainer.propTypes = {
    isFetchingCurrency: PropTypes.bool,
    lstCurrencyType: PropTypes.array,
};

CurrencyListContainer.defaultProps = {
    isFetchingCurrency: false,
    lstCurrencyType: [],
};

const mapStateToProps = state => {
    return {
        isFetchingCurrency: state.CurrencyTypeReducer.isFetchingCurrency || false,
        lstCurrencyType: state.CurrencyTypeReducer.lstCurrencyType || [],
    };
};
const mapDispatchToProps = dispatch => {
    return {
        getCurrencyType: () => dispatch(getCurrencyType()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyListContainer);