import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';
import { ModalBody, ModalHeader, ModalFooter, Modal } from 'reactstrap';
import Select from 'react-select';

import { TransComponent } from 'my-components';
import { FormulaService } from 'my-services/formula';

class AccountDetailItemContainer extends Component {
    static propTypes = {
        dataItem: PropTypes.object,
        lstFormula: PropTypes.array,
        lstMember: PropTypes.array,
    };

    static defaultProps = {
        dataItem: {},
        lstFormula: [],
        lstMember: [],
    };

    state = {
        isEdit: false,
        isOpenModal: false,
        isLoadingDelete: false,
        formulaSelected: null,
        memberSelected: null,
        isSaved: true,
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if ((this.props.isSaved !== nextProps.isSaved) && nextProps.isSaved) {
            this.setState({ isEdit: !nextProps.isSaved })
        }
    }

    handleChangeState = (state, cb) => () => {
        this.setState(state, () => {
            if (typeof cb === 'function') {
                cb();
            }
        })
    };

    _renderTd({ rowSpan, className, content }) {
        const props = {};

        if (rowSpan) {
            props.rowSpan = rowSpan;
        }

        if (className) {
            props.className = className;
        }

        return <td { ...props } >{ content }</td>;
    }

    _renderEditButton() {
        if (this.props.dataItem.formula_group_id) {
            return null;
        }

        if (this.state.isEdit) {
            return <span
                className="text-danger cursor-pointer"
                onClick={this.handleChangeState({ isEdit: false }, () => this.props.onChangeLstDetail({ congthuctinhId: this.props.dataItem.id, isRemove: true }) )} >
                <TransComponent i18nKey="Close" />
            </span>;
        }

        return <i onClick={this.handleChangeState({ isEdit: true })} className="fa fa-edit font-green cursor-pointer" />;
    }

    handleChangeSelect = type => value => {
        const { dataItem } = this.props;
        const newState = {};

        if (type === 'member') {
            newState.memberSelected = value;
        }

        if (type === 'formula') {
            newState.formulaSelected = value;
        }

        this.setState(newState, () => {
            const formulaId = this.state.formulaSelected ? this.state.formulaSelected.value : dataItem.congthucmau_id;
            const memberId = this.state.memberSelected ? this.state.memberSelected.value : dataItem.user_id;

            return this.props.onChangeLstDetail({
                formulaId,
                congthuctinhId: dataItem.id,
                memberId,
            });
        })
    };

    renderOptionFormula(formula) {
        const { optFormula } = this.props;

        formula.label = formula.tenct;
        formula.value = formula.id;

        if (!this.state.isEdit) {
            return formula.tenct;
        }

        return <Select
            onChange={this.handleChangeSelect('formula')}
            placeholder={<TransComponent i18nKey="Formula" />}
            noOptionsMessage={() => <TransComponent i18nKey="Empty data" />}
            options={optFormula}
            defaultValue={formula}
            isSearchable={false}
            className="basic-single"
            menuPosition="fixed"
        />
    }

    renderOptionMember(member) {
        const { optMember } = this.props;

        member.label = (member.fullname || '').toUpperCase();
        member.value = member.id;

        if (!this.state.isEdit) {
            return (member.fullname || '').toUpperCase();
        }

        return <Select
            onChange={this.handleChangeSelect('member')}
            placeholder={<TransComponent i18nKey="Member" />}
            noOptionsMessage={() => <TransComponent i18nKey="Empty data" />}
            options={optMember}
            defaultValue={member}
            isSearchable={false}
            className="basic-single"
            menuPosition="fixed"
        />
    }

    handleDelete = () => {
        this.handleChangeState({ isLoadingDelete: true }, async () => {
            try {
                await FormulaService.deleteLinkFormulaDetail({congthuctinhId: this.props.dataItem.id});

                this.handleChangeState({ isLoadingDelete: false, isOpenModal: false }, () => {
                    return this.props.onReGetLinkFormulaDetail();
                })();
            } catch (e) {
                this.handleChangeState({ isLoadingDelete: false })()
            }
        })()
    };

    render() {
        const { dataItem, lstFormula, lstMember, order } = this.props;
        const { isOpenModal, isLoadingDelete } = this.state;

        let subItemIn = null;
        let subItemOut = null;

        const formula = lstFormula.find(item => item.id === (dataItem.congthucmau_id || '')) || {};
        const member = lstMember.find(item => item.id === (dataItem.user_id || '')) || {};
        const fieldValueLength = formula.field_value ? formula.field_value.length : 1;
        const fieldValue_0 = _get(formula, 'field_value[0]');
        const fieldValueOther = (formula.field_value || []).filter((_, index) => index !== 0);

        subItemIn = fieldValue_0
            ? [
                <td key={0}><TransComponent i18nKey={fieldValue_0.field_name} /></td>,
                <td key={1}>{fieldValue_0.value}</td>
            ]
            : subItemIn;

        subItemOut = fieldValueOther.length
            ? fieldValueOther.map((item, index) => (
                <tr key={index}>
                    <td><TransComponent i18nKey={item.field_name} /></td>
                    <td>{ item.value }</td>
                </tr>
            ))
            : subItemOut;

        return (
            <>
                <tbody>
                    <tr>
                        { this._renderTd({ rowSpan: fieldValueLength, content: order }) }
                        { this._renderTd({ rowSpan: fieldValueLength, className: 'min-width-170', content: this.renderOptionMember(member) }) }
                        { this._renderTd({ rowSpan: fieldValueLength, content: dataItem.formula_group_id ? (dataItem.formula_group_id.name || '') : '' }) }
                        { this._renderTd({ rowSpan: fieldValueLength, className: 'min-width-170', content: this.renderOptionFormula(formula) }) }
                        { this._renderTd({ rowSpan: fieldValueLength, content: (formula.banker_name || '').toUpperCase() }) }
                        { this._renderTd({ rowSpan: fieldValueLength, content: formula.currency_name || '' }) }
                        { this._renderTd({ rowSpan: fieldValueLength, content: formula.giaonhan === 1 ? <TransComponent i18nKey="Pay" /> : <TransComponent i18nKey="Receive"/> }) }
                        { this._renderTd({ rowSpan: fieldValueLength, content: formula.format_name }) }
                        { subItemIn }
                        { this._renderTd({ rowSpan: fieldValueLength, className: 'text-center', content: this._renderEditButton() }) }
                        { this._renderTd({
                            rowSpan: fieldValueLength,
                            className: 'text-center',
                            content: (
                                <label className="mt-checkbox mt-checkbox-outline">
                                    <input
                                        checked={!!this.state[`isCheck${dataItem.id}`]}
                                        type="checkbox"
                                        onChange={this.handleChangeState({ [`isCheck${dataItem.id}`]: !(!!this.state[`isCheck${dataItem.id}`]) }, () => this.props.onCheckAccount({
                                            id: dataItem.id,
                                            checked: this.state[`isCheck${dataItem.id}`]
                                        }))}
                                    />
                                    <span />
                                </label>
                            )
                        }) }
                        { this._renderTd({
                            rowSpan: fieldValueLength,
                            className: 'text-center',
                            content: (<i className="cursor-pointer fa fa-times-circle text-danger" onClick={this.handleChangeState({ isOpenModal: true })} />)
                        }) }
                    </tr>
                    { subItemOut }
                </tbody>
                <Modal isOpen={isOpenModal} toggle={this.handleChangeState({ isOpenModal: !isOpenModal })}>
                    <ModalHeader toggle={this.handleChangeState({ isOpenModal: !isOpenModal })}><TransComponent i18nKey="Xac nhan" /></ModalHeader>
                    <ModalBody><TransComponent i18nKey="Are you sure ?" /></ModalBody>
                    <ModalFooter>
                        <button className="btn bg-green font-white" disabled={isLoadingDelete} onClick={this.handleDelete}>
                            <TransComponent i18nKey="Delete" />&nbsp;{ isLoadingDelete ? <i className="fa fa-spin fa-spinner" /> : null }
                        </button>&nbsp;
                        <button className="btn btn-danger" onClick={this.handleChangeState({ isOpenModal: !isOpenModal })}><TransComponent i18nKey="Cancel"  /></button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

export default AccountDetailItemContainer;