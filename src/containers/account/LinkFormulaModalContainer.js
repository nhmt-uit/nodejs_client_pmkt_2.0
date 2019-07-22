import React, {Component} from 'react';
import {Modal, ModalBody, ModalHeader, Container, Row, Col, FormGroup, Label, ModalFooter} from "reactstrap";
import { connect } from 'react-redux';
import Select from 'react-select';
import {
    isEmpty as _isEmpty,
    cloneDeep as _cloneDeep,
    isPlainObject as _isPlainObject,
    merge as _merge,
    get as _get,
} from 'lodash';

import { TransComponent } from 'my-components';

import { FormulaService } from 'my-services/formula';

import { AccountDetailItemContainer } from 'my-containers/account';
import { ModalFormMemberContainer } from 'my-containers/member';
import { ModalFormFormulaContainer } from 'my-containers/formula';
import { ModalFormAssignFormulaGroupContainer } from 'my-containers/formula-group';

import { getFormulaGroup, toggleModalAssignFormulaGroup } from 'my-actions/formula-group/FormulaGroupAction';
import { toggleModalAccount } from 'my-actions/AccountAction';
import { getFormula, getLinkFormulaDetail, toggleModalFormula } from 'my-actions/formula/FormulaAction';
import { getMember } from 'my-actions/member/MemberAction';
import { toggleModalMember } from 'my-actions/member/MemberAction';

class LinkFormulaModalContainer extends Component {
    constructor(props) {
        super(props);

        this.defaultState = {
            formulaType: null,
            memberId: null,
            formulaId: null,
            lstDelete: [],
            lstDetailEdit: [],
        };
        this.state = {
            ..._cloneDeep(this.defaultState),
            isLoadingMerge: false,
            isOpenMultiDeleteModal: false,
            isLoadingDeleteMulti: false,
            isLoadingUpdateMulti: false,
            optFormula: [],
            optFormulaGroup: [],
            isSaved: false,
        };

        this.optFormulaType = [
            { label: <TransComponent i18nKey="-- Formula --" />, value: 1 },
            { label: <TransComponent i18nKey="-- Formula group --" />, value: 2 },
        ];
    }

    componentDidMount() {
        this.props.getMember();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { isOpenLinkFormula, lstFormula, lstFormulaGroup, selectedItem, isOpenMemberModal, isOpenFormulaModal, isOpenFormulaGroupModal, isOpenFormulaGroupAssignModal } = this.props;
        const { formulaType } = this.state;
        const valueFormulaType = (formulaType && formulaType.value) || '';

        if (isOpenLinkFormula && valueFormulaType !== _get(prevState, 'formulaType.value', '')) {
            if (valueFormulaType === 1 && _isEmpty(lstFormula)) {
                this.props.getFormula();
            }

            if (valueFormulaType === 2 && _isEmpty(lstFormulaGroup)) {
                this.props.getFormulaGroup();
            }
        }

        if (isOpenLinkFormula && !prevProps.isOpenLinkFormula) {
            this.props.getFormula();
            this.props.getLinkFormulaDetail(selectedItem.id);
        }

        if (!isOpenLinkFormula && prevProps.isOpenLinkFormula) {
            this.setState(this.defaultState);
        }

        if (!isOpenMemberModal && prevProps.isOpenMemberModal) {
            this.props.getMember();
        }

        if (!isOpenFormulaModal && prevProps.isOpenFormulaModal) {
            this.props.getFormula();
        }

        if ((!isOpenFormulaGroupModal && prevProps.isOpenFormulaGroupModal) || (!isOpenFormulaGroupAssignModal && prevProps.isOpenFormulaGroupAssignModal)) {
            this.props.getFormulaGroup();
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { selectedItem, lstFormula = [], lstFormulaGroup = [] } = this.props;

        let newState = {};

        if (nextProps.lstFormula && nextProps.lstFormula.length /*&& _isEmpty(lstFormula)*/) {
            newState.optFormula = nextProps.lstFormula
                .filter(formula => formula.banker_id === selectedItem.banker_id)
                .map(formula => ({ label: formula.tenct, value: formula.id  }));
        }

        if (nextProps.lstFormulaGroup && nextProps.lstFormula.length /*&& _isEmpty(lstFormulaGroup)*/) {
            newState.optFormulaGroup =  this._filterFormulaGroupByBankerId(nextProps.lstFormulaGroup, selectedItem.banker_id)
                .map(formulaGroup => ({ label: formulaGroup.name, value: formulaGroup.formula_group_id }));
        }

        this.setState(newState);
    }

    handleChangeState = (state, cb) => () => {
        const oldState = this.state;

        Object.keys(state).forEach(key => {
            if (oldState.hasOwnProperty(key) && _isPlainObject(state[key])) {
                state[key] = _merge(oldState[key], state[key]);
            }
        });

        this.setState(state, () => {
            if (typeof cb === 'function') {
                cb();
            }
        })
    };

    _filterFormulaGroupByBankerId(lstFormulaGroup, bankerId) {
        let result = [];

        lstFormulaGroup.forEach(item => {
            if (!item.child || !item.child.length) {
                return ;
            }

            result = result.concat(item.child.filter(elm => elm.banker.id === bankerId));
        });

        return result;
    }

    toggle = () => {
        return this.props.toggleModalAccount({ isModalLinkFormula: true });
    };

    renderSelect = ({ options = [], placeholder = '', noOptionsMessage, isSearchable = true, ...otherProps }) => {
        noOptionsMessage = noOptionsMessage || <TransComponent i18nKey="Empty data" />;

        return (<Select
            options={options}
            placeholder={placeholder}
            noOptionsMessage={() => noOptionsMessage}
            isSearchable={isSearchable}
            { ...otherProps }
        />);
    };

    renderFormGroup = ({ label, labelSize = 2, content, contentSize = 10 }) => {
        label = label
            ? <Label sm={labelSize}>{label}</Label>
            : null;
        content = content
            ? <Col sm={contentSize}>{content}</Col>
            : null;

        return <FormGroup row>{label}{content}</FormGroup>;
    };

    handleChangeSelect = optName => optSelected => {
        this.setState({
            [optName]: optSelected,
        })
    };

    handleSaveFormulaAccount = () => {
        const { formulaType, formulaId, memberId } = this.state;
        const { selectedItem } = this.props;
        const formulaSelect = formulaType.value === 1 ? { formula_select: formulaId.value } : { formula_group_select: formulaId.value };

        this.handleChangeState({ isLoadingMerge: true }, () => {
            return FormulaService.saveFormulaAccount({
                account_select: selectedItem.id,
                banker_id: selectedItem.banker_id,
                member_select: memberId.value,
                banker_select: selectedItem.banker_id,
                select_formula_type: formulaType.value,
                ...formulaSelect,
            }).then(() => {
                this.handleChangeState({ isLoadingMerge: false, ..._cloneDeep(this.defaultState) }, () => {
                    return this.props.getLinkFormulaDetail(selectedItem.id);
                })()
            }).catch(() => {
                this.handleChangeState({ isLoadingMerge: false })()
            });
        })();
    };

    handleGetLinkFormulaDetail = () => {
        return this.props.getLinkFormulaDetail(this.props.selectedItem.id);
    };

    handleChangeLstDelete = ({ id, checked }) => {
        const { lstDelete } = this.state;
        const indexOfAccount = lstDelete.findIndex(item => item === id);

        if (indexOfAccount !== -1 && !checked) {
            lstDelete.splice(indexOfAccount, 1);
        }

        if (indexOfAccount === -1 && checked) {
            lstDelete.push(id);
        }

        this.setState({ lstDelete })
    };

    renderDetailAccount() {
        const { lstAccountDetail, lstMember, lstFormula } = this.props;

        return (
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover min-width-850">
                    <thead className="font-red">
                        <tr>
                            <th rowSpan={3}>#</th>
                            <th rowSpan={3}><TransComponent i18nKey={'Member'}/></th>
                            <th rowSpan={3}><TransComponent i18nKey={'Formula group'}/></th>
                            <th rowSpan={3}><TransComponent i18nKey={'Formula name'}/></th>
                            <th rowSpan={3}><TransComponent i18nKey={'Company'}/></th>
                            <th rowSpan={3}><TransComponent i18nKey={'Currency'}/></th>
                            <th rowSpan={3}><TransComponent i18nKey={'Pay'}/>/<TransComponent i18nKey={'Receive'}/></th>
                            <th colSpan={3} rowSpan={2} className="text-center"><TransComponent i18nKey={'Info'}/></th>
                            <th colSpan={3} className="text-center">
                                <button onClick={this.handleChangeState({ isOpenMultiDeleteModal: true })} className="btn btn-danger font-size-12" disabled={ this.state.lstDelete.length === 0 }>
                                    <TransComponent i18nKey="Delete selected" />
                                </button>
                            </th>
                        </tr>
                        <tr />
                        <tr>
                            <th><TransComponent i18nKey={'Type name'}/></th>
                            <th colSpan={2}><TransComponent i18nKey={'Value'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Edit'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Multi select'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Delete'}/></th>
                        </tr>
                    </thead>
                    {
                        lstAccountDetail.length
                            ? lstAccountDetail.map((account, index) =>
                                <AccountDetailItemContainer
                                    key={index}
                                    dataItem={account}
                                    lstFormula={lstFormula}
                                    lstMember={lstMember}
                                    order={index + 1}
                                    onReGetLinkFormulaDetail={this.handleGetLinkFormulaDetail}
                                    onCheckAccount={this.handleChangeLstDelete}
                                    optFormula={this.state.optFormula}
                                    optMember={this.props.optMember}
                                    onChangeLstDetail={this.handleChangeLstDetail}
                                    isSaved={this.state.isSaved}
                                />
                            )
                            : <tbody><tr><td className="text-center" colSpan={30}><TransComponent i18nKey="Empty data" /></td></tr></tbody>
                    }
                </table>
            </div>
        );
    }

    handleChangeLstDetail = detail => {
        const lstDetailEdit = this.state.lstDetailEdit;

        const itemIndex = lstDetailEdit.findIndex(elm => elm.congthuctinhId === detail.congthuctinhId);

        if (detail.isRemove) {
            lstDetailEdit.splice(itemIndex, 1);

            this.setState({ lstDetailEdit });

            return;
        }

        if (itemIndex !== -1) {
            lstDetailEdit[itemIndex] = detail;
        } else {
            lstDetailEdit.push(detail);
        }

        this.setState({ lstDetailEdit });
    };

    handleDeleteMulti = () => {
        this.setState({ isLoadingDeleteMulti: true }, async () => {
            try {
                await FormulaService.deleteMultipleFormulaByAccount(this.state.lstDelete);

                this.setState({ isLoadingDeleteMulti: false, isOpenMultiDeleteModal: false }, () => {
                    return this.handleGetLinkFormulaDetail();
                })
            } catch (e) {
                this.setState({ isLoadingDeleteMulti: false })
            }
        });
    };

    handleSaveMultiFormula = () => {
        const selectedItem = this.props.selectedItem;
        const bodyData = {
            accountId: selectedItem.id,
            data: JSON.stringify(this.state.lstDetailEdit)
        };

        this.handleChangeState({ isLoadingUpdateMulti: true, isSaved: false }, async () => {
            try {
                await FormulaService.updateLinkFormulaDetail(bodyData);

                this.setState({ isLoadingUpdateMulti: false, isSaved: true, lstDetailEdit: [] })
            } catch (e) {
                this.setState({ isLoadingUpdateMulti: false })
            }
        })()
    };

    handleToggleFormulaModal = e => {
        const formulaType = this.state.formulaType;
        const value = (formulaType && formulaType.value) || '';

        if (!value) {
            e.preventDefault();

            return;
        }

        if (value === 1) {
            return this.props.toggleModalFormula();
        }

        return this.props.toggleModalAssignFormulaGroup();
    };

    render() {
        const { isOpenLinkFormula, selectedItem, optMember } = this.props;
        const {
            formulaType, optFormula, optFormulaGroup, isLoadingMerge,
            memberId, formulaId, isOpenMultiDeleteModal, isLoadingDeleteMulti,
            isLoadingUpdateMulti, lstDetailEdit
        } = this.state;
        const optFormulaFiltered = _get(formulaType, 'value', '') === 1
            ? optFormula
            : _get(formulaType, 'value', '') === 2
                ? optFormulaGroup
                : [];

        return (
            <>
                <Modal className="modal-xxl" isOpen={isOpenLinkFormula} toggle={this.toggle} >
                    <ModalHeader toggle={this.toggle}><TransComponent i18nKey="Link formula" /></ModalHeader>
                    <ModalBody>
                        <Container>
                            <Row>
                                <Col md={4}>
                                    {this.renderFormGroup({
                                        label: <><strong><TransComponent i18nKey="Account" /></strong>: <span className="text-uppercase">{selectedItem.acc_name}</span></>,
                                        labelSize: 12
                                    })}
                                    {this.renderFormGroup({
                                        label: <><strong><TransComponent i18nKey="Belong account" /></strong>: <span className="text-uppercase">{selectedItem.acc_name}</span></>,
                                        labelSize: 12
                                    })}
                                    {this.renderFormGroup({
                                        label: <TransComponent i18nKey="Member" />,
                                        content: (
                                            <div className="input-group">
                                                { this.renderSelect({
                                                    options: optMember,
                                                    placeholder: <TransComponent i18nKey="Member" />,
                                                    onChange: this.handleChangeSelect('memberId'),
                                                    value: memberId
                                                }) }
                                                <span className="input-group-btn">
                                                    <button className="btn btn-secondary bg-red-sunglo" onClick={() => this.props.toggleModalMember()}>
                                                        <i className="fa fa-plus font-white" />
                                                    </button>
                                                </span>
                                            </div>
                                        )
                                    })}
                                    {this.renderFormGroup({
                                        label: <TransComponent i18nKey="Type" />,
                                        content: this.renderSelect({
                                            placeholder: <TransComponent i18nKey="Type" />,
                                            isSearchable: false,
                                            options: this.optFormulaType,
                                            onChange: this.handleChangeSelect('formulaType'),
                                            value: formulaType
                                        })
                                    })}
                                    {this.renderFormGroup({
                                        label: <TransComponent i18nKey="Formula" />,
                                        content: (
                                            <div className="input-group">
                                                { this.renderSelect({
                                                    placeholder: <TransComponent i18nKey="Formula" />,
                                                    isSearchable: false,
                                                    options: optFormulaFiltered,
                                                    onChange: this.handleChangeSelect('formulaId'),
                                                    value: formulaId
                                                }) }
                                                <span className="input-group-btn">
                                                    <button onClick={e => this.handleToggleFormulaModal(e)} className="btn btn-secondary bg-red-sunglo">
                                                        <i className="fa fa-plus font-white" />
                                                    </button>
                                                </span>
                                            </div>
                                        )
                                    })}
                                    {this.renderFormGroup({
                                        label: <>&nbsp;</>,
                                        content: <button disabled={isLoadingMerge || !(formulaType && memberId && formulaId)} className="btn btn-danger" onClick={this.handleSaveFormulaAccount}>
                                            <TransComponent i18nKey="Save" />{ isLoadingMerge ? <i className="fa fa-spin fa-spinner" /> : null }
                                        </button>
                                    })}
                                </Col>
                                <Col md={8}>
                                    <div className="portlet light bordered">
                                        <div className="portlet-title">
                                            <div className="caption font-size-15"><TransComponent i18nKey="Detail account list" /></div>
                                            <div className="actions">
                                                <button disabled={isLoadingUpdateMulti || lstDetailEdit.length === 0} onClick={this.handleSaveMultiFormula} className="btn btn-danger">
                                                    <TransComponent i18nKey="Save" />&nbsp;{ isLoadingUpdateMulti ? <i className="fa fa-spinner fa-spin" /> : null }
                                                </button>
                                            </div>
                                        </div>
                                        <div className="portlet-body">
                                            { this.renderDetailAccount() }
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </ModalBody>
                </Modal>
                <Modal isOpen={isOpenMultiDeleteModal} toggle={this.handleChangeState({ isOpenMultiDeleteModal: !isOpenMultiDeleteModal })}>
                    <ModalHeader toggle={this.handleChangeState({ isOpenMultiDeleteModal: !isOpenMultiDeleteModal })}><TransComponent i18nKey="Xac nhan" /></ModalHeader>
                    <ModalBody><TransComponent i18nKey="Do you want remove all checked?" /></ModalBody>
                    <ModalFooter>
                        <button className="btn bg-green font-white" disabled={isLoadingDeleteMulti} onClick={this.handleDeleteMulti}>
                            <TransComponent i18nKey="Delete" />&nbsp;{ isLoadingDeleteMulti ? <i className="fa fa-spin fa-spinner" /> : null }
                        </button>&nbsp;
                        <button className="btn btn-danger" onClick={this.handleChangeState({ isOpenMultiDeleteModal: !isOpenMultiDeleteModal })}><TransComponent i18nKey="Cancel"  /></button>
                    </ModalFooter>
                </Modal>
                <ModalFormMemberContainer formType="create" />
                <ModalFormFormulaContainer formType="create" defaultBankerId={selectedItem.banker_id}/>
                <ModalFormAssignFormulaGroupContainer formType="create" defaultBankerId={selectedItem.banker_id}/>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenLinkFormula: state.AccountReducer.isOpenLinkFormula || false,
        selectedItem: state.AccountReducer.selectedItem || {},
        optMember: state.MemberReducer.optMember || [],
        lstFormula: state.FormulaReducer.List || [],
        lstFormulaGroup: state.FormulaGroupReducer.formulaGroupList || [],
        lstAccountDetail: state.FormulaReducer.lstAccountDetail || [],
        lstMember: _get(state, 'MemberReducer.member.res.data.List', []),
        isOpenMemberModal: state.MemberReducer.isOpenModal || false,
        isOpenFormulaModal: state.FormulaReducer.isOpenModal || false,
        isOpenFormulaGroupModal: state.FormulaGroupReducer.isOpenModal || false,
        isOpenFormulaGroupAssignModal: state.FormulaGroupReducer.isOpenModalAssign || false,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleModalAccount: params => dispatch(toggleModalAccount(params)),
        getMember: () => dispatch(getMember()),
        getFormula: () => dispatch(getFormula()),
        getFormulaGroup: () => dispatch(getFormulaGroup()),
        getLinkFormulaDetail: id => dispatch(getLinkFormulaDetail(id)),
        toggleModalMember:  () => dispatch(toggleModalMember()),
        toggleModalFormula:  () => dispatch(toggleModalFormula()),
        toggleModalAssignFormulaGroup:  _ => dispatch(toggleModalAssignFormulaGroup()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LinkFormulaModalContainer);