import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { 
    get as _get, 
    sortBy as _sortBy,
    debounce as _debounce,
    isEmpty as _isEmpty,
    find as _find,
    isEqual as _isEqual,
    findIndex as _findIndex
} from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Select from 'react-select';

import { TransComponent, LoadingComponent } from 'my-components';
import { getFormula, setFormulaSelected } from 'my-actions/formula/FormulaAction';
import { FormulaItemContainer, FormulaModalContainer, ModalFormFormulaContainer } from 'my-containers/formula';
import { FormulaService } from 'my-services/formula';
import { MemberService } from 'my-services/member';
import { toggleModalFormula} from 'my-actions/formula/FormulaAction'

class FormulaListContainer extends Component {
    static propTypes = {
        banker: PropTypes.object,
        formulaList: PropTypes.array,
    }

    static defaultProps = {
        banker: {},
        formulaList: [],
    }

    constructor(props) {
        super(props);

        this.state = {
            bankerId: 'all',
            keySearch: '',
            isOpenAccountModal: false,
            isOpenRelinkModal: false,
            formulaSelected: {},
            listAccDelete: [],
            listAccEdit: [],
            listMemberUpdate: [],
            isLoadingDelete: false,
            isLoadingUpdate: false,
            isLoadingRelink: false,
            formulaBatchId: null,
            relinkFormulaId: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.formulaList && !_isEmpty(this.state.formulaSelected)) {
            const newFormulaSelected = _find(nextProps.formulaList, ['id', this.state.formulaSelected.id]);
            const newState = { 
                formulaSelected: newFormulaSelected,
                listAccDelete: [],
                listAccEdit: [],
                listMemberUpdate: [],
                formulaBatchId: null
            };

            this.setState(newState);
        }
    }

    componentDidUpdate() {
        if (this.state.isOpenAccountModal && _get(this.state, 'formulaSelected.list_acc_use', []).length === 0) {
            this.setState({ isOpenAccountModal: false });
        }
    }

    componentDidMount() {
        this.props.getFormula();
    }

    handleChangeState = (state, cb) => () => {
        this.setState(state, () => {
            if (typeof cb === 'function') {
                cb();
            }
        });
    }

    handleGetFormula = () => {
        return this.props.getFormula();
    }

    handleSetFormulaSelected = (formula) => {
        this.setState({
            isOpenAccountModal: true,
            formulaSelected: formula
        });
    }

    handleToggleRelinkModal = (formula) => {
        this.setState({
            isOpenRelinkModal: true,
            formulaSelected: formula
        });
    }

    renderBody() {
        const { isFetching } = this.props;

        let { formulaList } = this.props;

        formulaList = this.filterFormula(formulaList);
        formulaList = _sortBy(formulaList, ['giaonhan', 'tenct']);

        if (isFetching && !this.state.isOpenAccountModal) {
            return (
                <tr>
                    <td style={{ height: '100px' }} colSpan={13}><LoadingComponent /></td>
                </tr>
            );
        }

        return formulaList.map((item, index) => 
            <FormulaItemContainer 
                key={index} 
                formula={item} 
                order={index + 1}
                onSetFormulaSelected={this.handleSetFormulaSelected}
                onToggleRelinkModal={this.handleToggleRelinkModal}
                onToggleEditModal={() => this.props.toggleModalFormula()}
            />
        );
    }

    filterFormula(formulaList) {
        const { keySearch, bankerId } = this.state;

        if (!keySearch && (!bankerId || bankerId === 'all')) {
            return formulaList;
        }

        const bankerFilter = (bankerId && bankerId !== 'all') ? bankerId : '';
        const searchFilter = keySearch || '';

        return formulaList.filter(item => {
            const tenct = item.tenct ? item.tenct.toLowerCase() : '';
            
            let flagBanker = true;
            let flagSearch = true;

            if (bankerFilter && bankerFilter !== (item.banker_id || '')) {
                flagBanker = false;
            }

            if (searchFilter && tenct.indexOf(searchFilter.toLowerCase()) === -1) {
                flagSearch = false;
            }

            return flagBanker && flagSearch;
        });
    }

    handleChangeSelectBanker = e => {
        this.setState({
            bankerId: e.target.value
        });
    }

    handleSearch = _debounce(key => {
        this.setState({ keySearch: key });
    }, 300);

    handleToggleDelete = id => () => {
        const listAccDelete = this.state.listAccDelete;

        if (listAccDelete.includes(id)) {
            listAccDelete.splice(listAccDelete.indexOf(id) , 1);
        } else {
            listAccDelete.push(id);
        }

        this.setState({ listAccDelete });
    }

    handleToggleEdit = (id, member) => () => {
        const { listAccEdit, listMemberUpdate } = this.state;
        const indexOfAccount = _findIndex(listMemberUpdate, ['congthuctinhId', id]);

        if (listAccEdit.includes(id)) {
            listAccEdit.splice(listAccEdit.indexOf(id) , 1);

            if (indexOfAccount !== -1) {
                listMemberUpdate.splice(indexOfAccount , 1);
            }
            
        } else {
            listMemberUpdate.push(member);
            listAccEdit.push(id);
        }

        this.setState({ listAccEdit, listMemberUpdate });
    }

    handleDeleteAccountUseFormula = () => {
        this.setState({ isLoadingDelete: true }, () => {
            FormulaService.deleteAccountUseFormula(this.state.listAccDelete)
            .then(res => {
                if (res.status) {
                    this.setState({ isLoadingDelete: false }, () => {
                        return this.props.getFormula();
                    });
                }
            })
            .catch(() => {
                this.setState({ isLoadingDelete: false });
            });
        });
    }

    handleChangeListMember = member => newValue => {
        const listMemberUpdate = this.state.listMemberUpdate;
        const newMember = { ...member, formulaId: newValue.value };

        let isNew = true;

        if (listMemberUpdate.length === 0) {
            listMemberUpdate.push(newMember);
        }

        listMemberUpdate.forEach(member => {
            if (_isEqual(member.congthuctinhId, newMember.congthuctinhId)) {
                member.formulaId = newValue.value;

                isNew = false;
            }
        });

        if (isNew) {
            listMemberUpdate.push(newMember);
        }

        this.setState({ listMemberUpdate });
    }

    handleSaveMember = () => {
        this.setState({
            isLoadingUpdate: true
        }, () => {
            const { formulaBatchId, listMemberUpdate } = this.state;

            if (formulaBatchId) {
                listMemberUpdate.forEach(item => {
                    item.formulaId = formulaBatchId;
                });
            }

            return MemberService.updateMultiCongThucTinh(listMemberUpdate)
                .then(res => {
                    if (res.status) {
                        this.setState({
                            isLoadingUpdate: false
                        }, () => {
                            return this.props.getFormula();
                        });
                    }
                })
                .catch(() => {
                    this.setState({ isLoadingUpdate: false });
                });
        });
    }

    handleChangeSelect = key => value => {
        this.setState({ [key]: value.value });
    }

    handleRelinkFormula = () => {
        const { formulaSelected, relinkFormulaId } = this.state;

        this.setState({
            isLoadingRelink: true,
        })

        FormulaService.relinkFormula({ fromId: formulaSelected.id, toId: relinkFormulaId })
            .then(res => {
                if (res.status) {
                    this.setState({
                        isLoadingRelink: false,
                        isOpenRelinkModal: false,
                    }, () => this.props.getFormula())
                }
            })
            .catch(() => {
                this.setState({
                    isLoadingRelink: false,
                })
            });
    }

    renderBodyAccountModal = () => {
        const { formulaSelected, listAccDelete, listAccEdit, isLoadingDelete, isLoadingUpdate } = this.state;
        const listAccUse = formulaSelected.list_acc_use || [];
        const listOptionFormula = this.props.formulaList.map(item => { return { label: item.tenct.toUpperCase(), value: item.id } })
        const selectBatchFormulaElm = listAccEdit.length > 1 
            ? <Select
                className="basic-single color-text-normal"
                classNamePrefix="select"
                defaultValue={listOptionFormula[0]}
                isSearchable={false}
                onChange={this.handleChangeSelect('formulaBatchId')}
                options={listOptionFormula}
                menuPosition="fixed"
            />
            : <TransComponent i18nKey={'Formula name'}/>;

        return (
            <div style={{ overflow: 'auto' }}>
                <table className="table table-hover table-formula table-bordered">
                    <thead>
                        <tr>
                            <th><TransComponent i18nKey={'Member'}/></th>
                            <th><TransComponent i18nKey="Account" /></th>
                            <th>{selectBatchFormulaElm}</th>
                            <th className="text-center">{
                                listAccEdit.length > 0 
                                    ? (
                                        <button disabled={isLoadingUpdate} onClick={this.handleSaveMember} className="btn btn-danger">
                                            <TransComponent i18nKey="Save" />&nbsp;{ isLoadingUpdate ? <i className="fa fa-spinner fa-spin" /> : null }
                                        </button>
                                    ) 
                                    : <TransComponent i18nKey={'Edit'} />
                            }</th>
                            <th className="text-center">
                                <button disabled={!(this.state.listAccDelete.length > 0) || isLoadingDelete} className="btn btn-danger" onClick={this.handleDeleteAccountUseFormula}>
                                    <TransComponent i18nKey="Delete" />&nbsp;{ isLoadingDelete ? <i className="fa fa-spinner fa-spin" /> : null }
                                </button>
                                </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listAccUse.map((acc, index) => { 
                                const isEdit = listAccEdit.includes(acc.id);
                                const accEditElement = isEdit
                                    ? <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={{ label: formulaSelected.tenct, value: formulaSelected.id }}
                                        isSearchable={false}
                                        onChange={this.handleChangeListMember({ accountId: acc.account.id, memberId: acc.user.id, congthuctinhId: acc.id })}
                                        options={listOptionFormula}
                                        menuPosition="fixed"
                                    />
                                    : formulaSelected.tenct;

                                return (
                                    <tr key={index}>
                                        <td>{ acc.user.fullname.toUpperCase() }</td>
                                        <td>{ acc.account.acc_name.toUpperCase() }</td>
                                        <td>{ accEditElement }</td>
                                        <td className="text-center">
                                            { isEdit 
                                                ? (<span 
                                                        onClick={this.handleToggleEdit(acc.id, { accountId: acc.account.id, memberId: acc.user.id, formulaId: formulaSelected.id, congthuctinhId: acc.id })} 
                                                        className="cursor-pointer font-red">
                                                    <TransComponent i18nKey="Close" />
                                                    </span>)
                                                : <i 
                                                    onClick={this.handleToggleEdit(acc.id, { accountId: acc.account.id, memberId: acc.user.id, formulaId: formulaSelected.id, congthuctinhId: acc.id })} 
                                                    className="fa fa-edit font-blue-steel cursor-pointer" 
                                                /> 
                                            }
                                        </td>
                                        <td className="text-center">
                                            <label className="mt-checkbox mt-checkbox-outline">
                                                <input type="checkbox" checked={!!listAccDelete.includes(acc.id)} value={!!listAccDelete.includes(acc.id)} onChange={this.handleToggleDelete(acc.id)} />
                                                <span />
                                            </label>
                                        </td>
                                    </tr>
                                )}
                            )
                        }
                    </tbody>
                </table>
            </div>
        );
    }

    renderBodyRelinkModal = () => {
        const formulaList = this.props.formulaList;
        const { formulaSelected, relinkFormulaId, isLoadingRelink } = this.state;

        let listOptions = formulaList.filter(item => item.banker_id === formulaSelected.banker_id);

        listOptions = listOptions.map(item => ({ label: item.tenct, value: item.id }));

        return (
            <>
                <div className="form-group">
                    <label><TransComponent i18nKey="Please Chose Formula" /></label>
                    <Select
                        className="basic-single color-text-normal"
                        classNamePrefix="select"
                        defaultValue={{ label: formulaSelected.tenct, value: formulaSelected.id }}
                        isSearchable={false}
                        onChange={this.handleChangeSelect('relinkFormulaId')}
                        options={listOptions}
                        menuPosition="fixed"
                    />
                </div>
                <div className="form-group">
                    <button 
                        disabled={ !relinkFormulaId || relinkFormulaId === formulaSelected.id || isLoadingRelink } 
                        className="btn btn-danger"
                        onClick={this.handleRelinkFormula}
                    >
                        <TransComponent i18nKey="Submit" /> &nbsp; { isLoadingRelink ? <i className="fa fa-spinner spin" /> : null }
                    </button>
                </div>
            </>
        );
    }

    render() {
        const { banker } = this.props;console.log(this.state.relinkFormulaId);
        const { bankerId, isOpenAccountModal, isOpenRelinkModal } = this.state;

        return (
            <div className="portlet box blue-hoki">
                <div className="portlet-title">
                    <div className="caption bold uppercase font-size-15"><TransComponent i18nKey="Formula list" /></div>
                    <div className="actions">
                        <div className="form-inline">
                            <div className="form-group">
                                <label className="sr-only">formula name</label>
                                <div className="input-icon right">
                                    <i className="fa fa-search"></i>
                                    <input className="form-control" onChange={e => this.handleSearch(e.target.value)} placeholder={this.props.t('Formula name')} type="text" />
                                </div>
                            </div>
                            <div className="form-group">
                                <select className="form-control" value={bankerId} onChange={this.handleChangeSelectBanker}>
                                    <option value="all">{this.props.t('ALL')}</option>
                                    {
                                        Object.keys(banker).map(id => 
                                            <option className="text-uppercase" key={id} value={id}>
                                                {banker[id].toUpperCase()}
                                            </option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="portlet-body">
                    <table className="table table-hover table-formula">
                        <thead>
                            <tr>
                                <th rowSpan={2}>#</th>
                                <th rowSpan={2}>
                                    <TransComponent i18nKey={'Formula name'}/>
                                </th>
                                <th rowSpan={2}><TransComponent i18nKey="Book" /></th>
                                <th rowSpan={2}><TransComponent i18nKey={'Company'}/></th>
                                <th rowSpan={2}><TransComponent i18nKey={'Currency'}/></th>
                                <th rowSpan={2}><TransComponent
                                    i18nKey={'Pay'}/>/<TransComponent i18nKey={'Receive'}/></th>
                                <th colSpan={"3"} className="text-center"><TransComponent i18nKey={'Info'}/></th>
                                <th rowSpan={2}><TransComponent i18nKey={'Total used account'}/></th>
                                <th rowSpan={2} className="text-center"><TransComponent i18nKey={'Relink Formula'}/></th>
                                <th rowSpan={2}><TransComponent i18nKey={'Edit'}/></th>
                                <th rowSpan={2} className="text-center"><TransComponent i18nKey={'Delete'}/></th>
                            </tr>
                            <tr>
                                <th className="text-center"><TransComponent i18nKey={'Type name'}/></th>
                                <th className="text-center" colSpan={"2"}><TransComponent i18nKey={'Value'}/></th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.renderBody() }
                        </tbody>
                    </table>
                </div>
                <FormulaModalContainer 
                    isOpen={isOpenAccountModal} 
                    header={<strong><TransComponent i18nKey="Formula" /></strong>} 
                    onToggle={this.handleChangeState({ isOpenAccountModal: !isOpenAccountModal })}
                    body={this.renderBodyAccountModal()}
                    scrollable={true}
                    className="modal-xxl"
                />
                <FormulaModalContainer 
                    isOpen={isOpenRelinkModal} 
                    header={<strong><TransComponent i18nKey="Relink Formula" /></strong>} 
                    onToggle={this.handleChangeState({ isOpenRelinkModal: !isOpenRelinkModal })}
                    body={this.renderBodyRelinkModal()}
                />
                <ModalFormFormulaContainer formType="create" />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        banker: _get(state, 'FormulaReducer.banker', {}),
        formulaList: _get(state, 'FormulaReducer.List', []),
        isFetching: _get(state, 'FormulaReducer.isFetching', false),
        //Response Modal Formula Saved
        formFormulaSaveStatus: state.FormulaReducer.formSaveStatus,
        formFormulaSaveResponse: state.FormulaReducer.formSaveResponse,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getFormula: () => dispatch(getFormula()),
        setFormulaSelected: formula => dispatch(setFormulaSelected(formula)),
        // Handel Modal Form Formula
        toggleModalFormula:  _ => dispatch(toggleModalFormula()),
    };
}

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(FormulaListContainer);