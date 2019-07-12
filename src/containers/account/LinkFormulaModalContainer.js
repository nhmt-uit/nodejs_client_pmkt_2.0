import React, {Component} from 'react';
import {Modal, ModalBody, ModalHeader, Container, Row, Col, FormGroup, Label} from "reactstrap";
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
import { toggleModalAccount } from 'my-actions/AccountAction';
import { getMember } from 'my-actions/member/MemberAction';
import { getFormula, getLinkFormulaDetail } from 'my-actions/formula/FormulaAction';
import { getFormulaGroup } from 'my-actions/formula-group/FormulaGroupAction';
import { FormulaService } from 'my-services/formula';

class LinkFormulaModalContainer extends Component {
    constructor(props) {
        super(props);

        this.defaultState = {
            formulaType: 1,
            memberId: null,
            formulaId: null,
            optFormula: [],
            optFormulaGroup: [],
        };
        this.state = {
            ..._cloneDeep(this.defaultState),
            isLoadingMerge: false,
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
        const { isOpenLinkFormula, lstFormula, lstFormulaGroup } = this.props;
        const { formulaType } = this.state;

        if (isOpenLinkFormula && formulaType !== prevState.formulaType) {
            if (formulaType === 1 && _isEmpty(lstFormula)) {
                this.props.getFormula();
            }

            if (formulaType === 2 && _isEmpty(lstFormulaGroup)) {
                this.props.getFormulaGroup();
            }
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { optFormula, optFormulaGroup } = this.state;

        let newState = {};

        const { selectedItem } = this.props;

        if (nextProps.isOpenLinkFormula && _isEmpty(optFormula) && _isEmpty(optFormulaGroup)) {
            this.props.getFormula();
        }

        if (nextProps.lstFormula) {
            const newOptFormula = nextProps.lstFormula
                .filter(formula => formula.banker_id === selectedItem.banker_id)
                .map(formula => ({ label: formula.tenct, value: formula.id  }));

            if (newOptFormula !== optFormula) {
                newState.optFormula = newOptFormula
            }
        }

        if (nextProps.lstFormulaGroup) {
            let lstFormulaGroup = nextProps.lstFormulaGroup;

            lstFormulaGroup = this._filterFormulaGroupByBankerId(lstFormulaGroup, selectedItem.banker_id);

            const newOptFormulaGroup = lstFormulaGroup
                .map(formulaGroup => ({ label: formulaGroup.name, value: formulaGroup.formula_group_id }));

            if (newOptFormulaGroup !== optFormulaGroup) {
                newState.optFormulaGroup = newOptFormulaGroup;
            }
        }

        if (!nextProps.isOpenLinkFormula) {
            newState = this.defaultState;
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
            [optName]: optSelected.value,
        })
    };

    handleSaveFormulaAccount = () => {
        const { formulaType, formulaId, memberId } = this.state;
        const { selectedItem } = this.props;
        const formulaSelect = formulaType === 1 ? { formula_select: formulaId } : { formula_group_select: formulaId };

        this.handleChangeState({ isLoadingMerge: true }, () => {
            return FormulaService.saveFormulaAccount({
                account_select: selectedItem.id,
                banker_id: selectedItem.banker_id,
                member_select: memberId,
                banker_select: selectedItem.banker_id,
                select_formula_type: formulaType,
                ...formulaSelect,
            })
                .then(() => {
                    this.handleChangeState({ isLoadingMerge: false, ..._cloneDeep(this.defaultState) }, () => {
                        return this.props.getLinkFormulaDetail(selectedItem.id);
                    })()
                })
                .catch(() => {
                    this.handleChangeState({ isLoadingMerge: false })()
                });
        })();
    };

    renderDetailAccount() {
        const { lstAccountDetail, lstMember } = this.props;

        return (
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="font-red">
                        <tr>
                            <th rowSpan={2}>#</th>
                            <th rowSpan={2}><TransComponent i18nKey={'Member'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Formula group'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Formula name'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Company'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Currency'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Pay'}/>/<TransComponent i18nKey={'Receive'}/></th>
                            <th colSpan={3}><TransComponent i18nKey={'Info'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Edit'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Multi select'}/></th>
                            <th rowSpan={2}><TransComponent i18nKey={'Delete'}/></th>
                        </tr>
                        <tr>
                            <th><TransComponent i18nKey={'Type name'}/></th>
                            <th colSpan={2}><TransComponent i18nKey={'Value'}/></th>
                        </tr>
                        <tr>
                            <th colSpan={13}>
                                {/*<Home.Item.MultiDelete account_select={this.state.account_select} listPatternMultiDelete={this.state.listIdMultiDelete} reload={this.clearListIdMultiDelete}/>*/}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        lstAccountDetail.map((account, index) => (
                            <tr key={index}>
                                {/*<td rowSpan={formula.get('field_value') ? formula.get('field_value').size : 1}>{this.props.index + 1}</td>*/}
                                {/*<td rowSpan={formula.get('field_value') ? formula.get('field_value').size : 1}*/}
                                {/*    className={"member_name"}>{showMember}</td>*/}
                                {/*<td rowSpan={formula.get('field_value') ? formula.get('field_value').size : 1}*/}
                                {/*    className={"formula_group"}>{this.props.item.get('formula_group_id') ? this.props.item.get('formula_group_id').get('name', '') : ''}</td>*/}
                                {/*<td rowSpan={formula.get('field_value') ? formula.get('field_value').size : 1}*/}
                                {/*    className={"formula"}>{showFormula}</td>*/}
                                {/*<td rowSpan={formula.get('field_value') ? formula.get('field_value').size : 1}*/}
                                {/*    className={"formula_book"}>{formula.get('banker_name', '').toUpperCase()}</td>*/}
                                {/*<td rowSpan={formula.get('field_value') ? formula.get('field_value').size : 1}*/}
                                {/*    className={"formula_cur"}>{formula.get('currency_name') || ''}</td>*/}
                                {/*<td rowSpan={formula.get('field_value') ? formula.get('field_value').size : 1}*/}
                                {/*    className={"formula_giaonhan"}>{formula.get('giaonhan') == '1' ? <Language lang={'Pay'}/> :*/}
                                {/*    <Language lang={'Receive'}/>}</td>*/}
                                {/*<td rowSpan={formula.get('field_value') ? formula.get('field_value').size : 1}*/}
                                {/*    className={"formula_info"}>{formula.get('format_name') || ''}</td>*/}
                                {/*{sub_item_html_in}*/}
                                {/*<td rowSpan={formula.get('field_value') ? formula.get('field_value').size : 1}*/}
                                {/*    className={"formula_edit text-center"}>*/}
                                {/*    {edit}*/}
                                {/*</td>*/}
                                {/*<td rowSpan={2}*/}
                                {/*    className={"multi_select text-center"}>*/}
                                {/*    <Home.Item.Checkbox item={this.props.item} listPatternMultiDelete={this.props.listPatternMultiDelete} onChangelistIdMultiDelete={this.props.onChangelistIdMultiDelete}/>*/}
                                {/*</td>*/}
                                {/*<td rowSpan={formula.get('field_value') ? formula.get('field_value').size : 1}*/}
                                {/*    className={"formula_delete text-center"}>*/}
                                {/*    <Home.Item.Delete item={this.props.item}/></td>*/}
                            </tr>
                        ))
                    }
                    {/*{ this.renderBody() }*/}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        const { isOpenLinkFormula, selectedItem, optMember } = this.props;
        const { formulaType, optFormula, optFormulaGroup, isLoadingMerge } = this.state;
        const optFormulaFiltered = formulaType === 1 ? optFormula : optFormulaGroup;

        return (
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
                                    content: this.renderSelect({ options: optMember, placeholder: <TransComponent i18nKey="Member" />, onChange: this.handleChangeSelect('memberId') })
                                })}
                                {this.renderFormGroup({
                                    label: <TransComponent i18nKey="Type" />,
                                    content: this.renderSelect({
                                        placeholder: <TransComponent i18nKey="Type" />,
                                        isSearchable: false,
                                        options: this.optFormulaType,
                                        defaultValue: this.optFormulaType[0],
                                        onChange: this.handleChangeSelect('formulaType')
                                    })
                                })}
                                {this.renderFormGroup({
                                    label: <TransComponent i18nKey="Formula" />,
                                    content: this.renderSelect({
                                        placeholder: <TransComponent i18nKey="Formula" />,
                                        isSearchable: false,
                                        options: optFormulaFiltered,
                                        onChange: this.handleChangeSelect('formulaId')
                                    })
                                })}
                                {this.renderFormGroup({
                                    label: <>&nbsp;</>,
                                    content: <button className="btn btn-danger" onClick={this.handleSaveFormulaAccount}>
                                        <TransComponent i18nKey="Save" />{ isLoadingMerge ? <i className="fa fa-spin fa-spinner" /> : null }
                                    </button>
                                })}
                            </Col>
                            <Col md={8}>
                                <div className="portlet light bordered">
                                    <div className="portlet-title">
                                        <div className="caption font-size-15"><TransComponent i18nKey="Detail account list" /></div>
                                        <div className="actions">
                                            <button className="btn btn-danger"><TransComponent i18nKey="Save" /></button>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleModalAccount: params => dispatch(toggleModalAccount(params)),
        getMember: () => dispatch(getMember()),
        getFormula: () => dispatch(getFormula()),
        getFormulaGroup: () => dispatch(getFormulaGroup()),
        getLinkFormulaDetail: id => dispatch(getLinkFormulaDetail(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LinkFormulaModalContainer);