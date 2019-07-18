import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { isEqual as _isEqual, cloneDeep as _cloneDeep, isEmpty as _isEmpty, uniqBy as _uniqBy } from 'lodash'

import { TransComponent, PaginationComponent, LoadingComponent } from 'my-components';
import { getFormula } from 'my-actions/formula/FormulaAction'
import { ModalDeleteMemberDetailContainer } from 'my-containers/member'
import { getFormulaByMember, toggleModalDeleteMemberDetail } from 'my-actions/member/MemberAction'
import MemberService from 'my-services/member/MemberService'

class DetailMemberContainer extends Component {
    state = {
        currentPage: 1,
        itemPerPage: 10,
        search: {
            formulaName : null
        },
        bankerId: 'all',

        // Add formula id to delete multiple
        congthuctinhIds: [],
        selectedFormulas: [],
    }
    

    componentWillMount() {
        this.props.getFormula()
    }

    componentDidUpdate(prevProps) {
        if(!_isEqual(prevProps.selectedItemList, this.props.selectedItemList)) {
            this.setState({bankerId: 'all'})

            //Reset State
            this.setState({congthuctinhIds : [], selectedFormulas: []})
        }

        // Reload Data
        if((this.props.formDeleteDetailStatus && this.props.isOpenModalDeleteDetail)) {
            this.props.getFormulaByMember({memberId: this.props.selectedItemList.id, selectedItemList: this.props.selectedItemList})

            //Reset State
            this.setState({congthuctinhIds : []})
        }
    }
    
    handleSearch = value => {
        this.setState({
            search: {
                formulaName : value
            },
            currentPage: 1,
        })
    }

    handleChangePage = currentPage => {
        this.setState({
            currentPage,
        });
    }
    
    handleChangeSelectBanker = (e) => {
        this.setState({
            bankerId: e.target.value,
            currentPage: 1,
        })
    }

    handleCheckFormula = (e, item) => {
        const isChecked = e.target.checked;
        const formulaId = item.id
        if(isChecked) {
            this.state.congthuctinhIds.push(formulaId)
        } else {
            this.state.congthuctinhIds = this.state.congthuctinhIds.filter(id => id !== formulaId)
        }
        this.setState({congthuctinhIds : this.state.congthuctinhIds})
    }

    

    handleUpdateFormula = _ => {
        /*
        |--------------------------------------------------------------------------
        | @input: {formula_group_id, banker_id, data: [{isEdit, formulaId, formulaAccountGroupId, random}]}
        |--------------------------------------------------------------------------
        */
        const payload = {
            memberId: this.props.selectedItemList.id,
            data:[]
        }
        this.state.selectedFormulas.forEach(item => {
            payload.data.push({
                isEdit: true,
                formulaId: !_isEmpty(item.newFormulaId) ? item.newFormulaId : item.formmulaId,
                memberId: !_isEmpty(item.newMemberId) ? item.newMemberId : item.memberId,
                congthuctinhId: item.id,
                random: Math.random()
            })
        })
        payload.data = JSON.stringify(payload.data)
        MemberService.updateLinkFormulaDetail(payload).then(async res => {
            if(res.status) {
                this.props.getFormulaByMember({memberId: this.props.selectedItemList.id, selectedItemList: this.props.selectedItemList})
                // //Render List Formula
                this.setState({
                    selectedFormulas: [],
                })
            } else {
               
            }
        })
    }

    handleEditFormula = (type, selectedItem, e) => {
        const selectedItemList = this.props.selectedItemList
        let selectedFormulas = this.state.selectedFormulas
        if(type === 'edit') {
            delete selectedItem.newFormulaId
            delete selectedItem.newMemberId
            selectedFormulas.push({
                bankerId: selectedItem.banker_id,
                formmulaId: selectedItem.congthucmau_id,
                congthuctinhId: selectedItem.id,
                id: selectedItem.id,
                memberId: selectedItemList.id
            })
        }

        if(type === 'close') {
            selectedFormulas = selectedFormulas.filter(item => item.id !== selectedItem.id)
        }

        if(type === 'change') {
            selectedFormulas = selectedFormulas.map(item => {
                if( item.id === selectedItem.id) item.newFormulaId = e.target.value
                return item
            })
        }

        if(type === 'multiple_change') {
            selectedFormulas = selectedFormulas.map(item => {
                if( item.bankerId === selectedItem.bankerId) item.newFormulaId = e.target.value
                return item
            })
        }

        if(type === 'change_member') {
            selectedFormulas = selectedFormulas.map(item => {
                if( item.id === selectedItem.id) item.newMemberId = e.target.value
                return item
            })
        }
        
        this.setState({selectedFormulas})
    }

    renderChangeFormula = selectedItem => {
        const formulaList =  this.props.formulaList.filter(obj => obj.banker_id === selectedItem.banker_id)
        
        const selectedEdit = this.state.selectedFormulas.find(item => item.id === selectedItem.id && !_isEmpty(item.newFormulaId))
        let selectValue = _isEmpty(selectedEdit) ? selectedItem.congthucmau_id : selectedEdit.newFormulaId
        return (
            <select className="form-control" onChange={e => this.handleEditFormula('change', selectedItem, e)} value={selectValue}>
                {
                    formulaList.map(item => {
                        return (
                            <option className="text-uppercase" key={item.id} value={item.id}>
                                {item.tenct.toUpperCase()}
                            </option>
                        )
                    })
                }
            </select>
        )
    }

    renderChangeMember = selectedItem => {
        const selectedItemList = this.props.selectedItemList
        const optMember = this.props.optMember
        const selectedEdit = this.state.selectedFormulas.find(item => item.id === selectedItem.id && !_isEmpty(item.newMemberId))
        let selectValue = _isEmpty(selectedEdit) ? selectedItemList.id : selectedEdit.newMemberId
        return (
            <select className="form-control" onChange={e => this.handleEditFormula('change_member', selectedItem, e)} value={selectValue}>
                {
                    optMember.map(item => {
                        return (
                            <option className="text-uppercase" key={item.id} value={item.id}>
                                {item.fullname.toUpperCase()}
                            </option>
                        )
                    })
                }
            </select>
        )
    }

    renderFormulaHeader = _ => {
        const selectedFormulas = this.state.selectedFormulas
        const uniqBanker = _uniqBy(selectedFormulas, 'bankerId')
        if(uniqBanker.length === 1 && selectedFormulas.length >= 2) {
            const formulaList =  this.props.formulaList.filter(obj => obj.banker_id === uniqBanker[0].bankerId)
            return (
                <select className="form-control" onChange={e => this.handleEditFormula('multiple_change', uniqBanker[0], e)}>
                    {
                        formulaList.map(item => {
                            return (
                                <option className="text-uppercase" key={item.id} value={item.id}>
                                    {item.tenct.toUpperCase()}
                                </option>
                            )
                        })
                    }
                </select>
            )
        } else {
            return (
                <TransComponent i18nKey="Formula name" />
            )
        }
        
    }

    render() {
        const {currentPage, itemPerPage } = this.state

        let formulaByMemberList = _cloneDeep(this.props.formulaByMemberList)
        const { formulaList, selectedItemList, bankerList } = this.props
        const bankerId = this.state.bankerId
        const searchFormulaName = this.state.search.formulaName

        let totalItem = formulaByMemberList.length

        if(bankerId && bankerId !== 'all') {
            formulaByMemberList = formulaByMemberList.filter(item => item.banker_id === bankerId)
            totalItem = formulaByMemberList.length
        }

        if(searchFormulaName) {
            formulaByMemberList = formulaByMemberList.filter(item => item.acc_name.toLowerCase().indexOf(searchFormulaName.toLowerCase()) !== -1 || formulaList.find(obj => obj.id === item.congthucmau_id).tenct.toLowerCase().indexOf(searchFormulaName.toLowerCase()) !== -1 )
            totalItem = formulaByMemberList.length
        }
        formulaByMemberList = formulaByMemberList.splice((currentPage - 1) * itemPerPage, itemPerPage);

        return (
            <>
                <div className="form-group text-right">
                    <button  onClick={_ => this.props.toggleModalDeleteMemberDetail({typeModal: 'multiple', selectedItemDetail: {memberId: selectedItemList.id, congthuctinhIds: this.state.congthuctinhIds}})} className="btn btn-danger" disabled={!this.state.congthuctinhIds.length}><TransComponent i18nKey="Delete Selected" /></button>
                    <button onClick={_ => this.handleUpdateFormula()} className="btn btn-danger" disabled={!this.state.selectedFormulas.length}><TransComponent i18nKey="Save" /></button>
                </div>
                <div className="portlet box blue-hoki position-relative">
                    {this.props.isInitListMemberDetail ? <LoadingComponent /> : null}
                    <div className="portlet-title">
                        <div className="caption bold uppercase font-size-15"><TransComponent i18nKey="Detail member list" /></div>
                        <div className="actions">
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="sr-only">formula name</label>
                                    <div className="input-icon right">
                                        <i className="fa fa-search"></i>
                                        <input className="form-control" onChange={e => this.handleSearch(e.target.value)} type="text" placeholder={this.props.t("formula name")} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <select className="form-control" value={bankerId} onChange={this.handleChangeSelectBanker}>
                                        <option value="all">{this.props.t('All')}</option>
                                        {
                                            bankerList.map(banker =>
                                                <option className="text-uppercase" key={banker.id} value={banker.id}>
                                                    {banker.name.toUpperCase()}
                                                </option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="portlet-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr className="font-red-sunglo">
                                        <th rowSpan="2">#</th>
                                        <th rowSpan="2"><TransComponent i18nKey="Account"/></th>
                                        <th rowSpan="2"><TransComponent i18nKey="Member" /></th>
                                        <th rowSpan="2"><TransComponent i18nKey="Formula group" /></th>
                                        <th rowSpan="2">{this.renderFormulaHeader()}</th>
                                        <th rowSpan="2"><TransComponent i18nKey="Company" /></th>
                                        <th rowSpan="2"><TransComponent i18nKey="Currency" /></th>
                                        <th rowSpan="2"><TransComponent i18nKey="Pay/Rec" /></th>
                                        <th colSpan="3" className="text-center"><TransComponent i18nKey="Detail" /></th>
                                        <th rowSpan="2"><TransComponent i18nKey="Multi select" /></th>
                                        <th rowSpan="2"><TransComponent i18nKey="Edit" /></th>
                                        <th rowSpan="2"><TransComponent i18nKey="Delete" /></th>
                                    </tr>
                                    <tr className="font-red-sunglo">
                                        <th className="text-center"><TransComponent i18nKey={'Type name'}/></th>
                                        <th colSpan="2" className="text-center"><TransComponent i18nKey={'Value'}/></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    formulaByMemberList.length ?
                                        formulaByMemberList.map( (item, index) => {
                                            let formulaDetail = formulaList.find(obj => obj.id === item.congthucmau_id)
                                            const selectedFormulasItem = this.state.selectedFormulas.find(obj => obj.id === item.id)
                                            
                                            if(!_isEmpty(selectedFormulasItem) && !_isEmpty(selectedFormulasItem.newFormulaId)) {
                                                formulaDetail = formulaList.find(obj => obj.id === selectedFormulasItem.newFormulaId)
                                            }

                                            if(formulaDetail.field_value.length > 1) {
                                                return (
                                                    <Fragment key={index}>
                                                        <tr>
                                                            <td rowSpan="2"> {itemPerPage * (currentPage - 1) + index + 1} </td>
                                                            <td rowSpan="2" className="uppercase"> {item.acc_name} </td>
                                                            <td rowSpan="2" className="uppercase">
                                                                { _isEmpty(selectedFormulasItem) ?
                                                                    selectedItemList.fullname
                                                                    : this.renderChangeMember(item)
                                                                }
                                                            </td>
                                                            <td rowSpan="2" className="uppercase">{item.formula_group_name}</td>
                                                            <td rowSpan="2">
                                                                { _isEmpty(selectedFormulasItem) ?
                                                                    formulaDetail.tenct
                                                                    : this.renderChangeFormula(item)
                                                                }
                                                            </td>
                                                            <td rowSpan="2">{item.banker_name.toUpperCase()}</td>
                                                            <td rowSpan="2">{formulaDetail.currency_name}</td>
                                                            <td rowSpan="2">{formulaDetail.giaonhan === -1 ? <TransComponent i18nKey={'Receive'}/> : <TransComponent i18nKey={'Pay'}/>}</td>
                                                            <td rowSpan="2">{formulaDetail.format_name}</td>
                                                            <td ><TransComponent i18nKey={'Ratio'}/></td>
                                                            <td >{formulaDetail.field_value.find(obj => obj.field_name === "he_so").value}</td>
                                                            <td rowSpan="2" className="text-center">
                                                                <label className="mt-checkbox uppercase" style={{paddingLeft: '0px'}}>
                                                                    <input type="checkbox" onChange={e => this.handleCheckFormula(e, item)} checked={this.state.congthuctinhIds.indexOf(item.id) !== -1}  />
                                                                    <span></span>
                                                                </label>
                                                            </td>
                                                            <td rowSpan="2" className="text-center">
                                                                { _isEmpty(item.formula_group_id) ?
                                                                    _isEmpty(this.state.selectedFormulas.find(obj => obj.id === item.id)) ?
                                                                        <a href="#/" className="green" onClick={_ => this.handleEditFormula('edit', item)}> <i className="fa fa-edit" /> </a>
                                                                        : <a href="#/" className="green" onClick={_ => this.handleEditFormula('close', item)}> <TransComponent i18nKey="Close" /> </a>
                                                                    : null
                                                                }
                                                            </td>
                                                            <td rowSpan="2" className="text-center">
                                                                <button className="text-success btn btn-link font-red" onClick={_ => this.props.toggleModalDeleteMemberDetail({typeModal: 'single', selectedItemDetail: {memberId: selectedItemList.id, congthuctinhId: item.id}})}>
                                                                    <i className="fa fa-close" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td ><TransComponent i18nKey={'Price'}/></td>
                                                            <td >{formulaDetail.field_value.find(obj => obj.field_name === "gia_thau").value}</td>
                                                        </tr>
                                                    </Fragment>
                                                )
                                            } else {
                                                return (
                                                    <Fragment key={index}>
                                                        <tr>
                                                            <td> {itemPerPage * (currentPage - 1) + index + 1} </td>
                                                            <td className="uppercase"> {item.acc_name} </td>
                                                            <td className="uppercase">
                                                                { _isEmpty(this.state.selectedFormulas.find(obj => obj.id === item.id)) ?
                                                                    selectedItemList.fullname
                                                                    : this.renderChangeMember(item)
                                                                }
                                                            </td>
                                                            <td className="uppercase">{item.formula_group_name}</td>
                                                            <td>
                                                                { _isEmpty(this.state.selectedFormulas.find(obj => obj.id === item.id)) ?
                                                                    formulaDetail.tenct
                                                                    : this.renderChangeFormula(item)
                                                                }
                                                            </td>
                                                            <td>{item.banker_name.toUpperCase()}</td>
                                                            <td>{formulaDetail.currency_name}</td>
                                                            <td>{formulaDetail.giaonhan === -1 ? <TransComponent i18nKey={'Receive'}/> : <TransComponent i18nKey={'Pay'}/>}</td>
                                                            <td>{formulaDetail.format_name}</td>
                                                            {formulaDetail.field_value.find(obj => obj.field_name === "he_so") ?
                                                                <>
                                                                    <td ><TransComponent i18nKey={'Ratio'}/></td>
                                                                    <td >{formulaDetail.field_value.find(obj => obj.field_name === "he_so").value}</td>
                                                                </>
                                                                : null
                                                            }
                                                            {formulaDetail.field_value.find(obj => obj.field_name === "gia_thau") ?
                                                                <>
                                                                    <td ><TransComponent i18nKey={'Price'}/></td>
                                                                    <td >{formulaDetail.field_value.find(obj => obj.field_name === "gia_thau").value}</td>
                                                                </>
                                                                : null
                                                            }
                                                            <td className="text-center">
                                                                <label className="mt-checkbox uppercase" style={{paddingLeft: '0px'}}>
                                                                    <input type="checkbox" onChange={e => this.handleCheckFormula(e, item)} checked={this.state.congthuctinhIds.indexOf(item.id) !== -1}  />
                                                                    <span></span>
                                                                </label>
                                                            </td>
                                                            <td className="text-center">
                                                                { _isEmpty(item.formula_group_id) ?
                                                                    _isEmpty(this.state.selectedFormulas.find(obj => obj.id === item.id)) ?
                                                                        <a href="#/" className="green" onClick={_ => this.handleEditFormula('edit', item)}> <i className="fa fa-edit" /> </a>
                                                                        : <a href="#/" className="green" onClick={_ => this.handleEditFormula('close', item)}> <TransComponent i18nKey="Close" /> </a>
                                                                    : null
                                                                }
                                                            </td>
                                                            <td className="text-center">
                                                                <button className="text-success btn btn-link font-red" onClick={_ => this.props.toggleModalDeleteMemberDetail({typeModal: 'single', selectedItemDetail: {memberId: selectedItemList.id, congthuctinhId: item.id}})}>
                                                                    <i className="fa fa-close" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </Fragment>
                                                )
                                            }
                                        })
                                    : <tr><td className="text-center" colSpan="20"><TransComponent i18nKey="Data Empty" /></td></tr>
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="text-center">
                            <PaginationComponent
                                currentPage={currentPage}
                                total={totalItem}
                                perPage={itemPerPage}
                                onClickPage={this.handleChangePage}
                            />
                        </div>
                    </div>
                </div>
                <ModalDeleteMemberDetailContainer />
            </>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        //Handle Loading
        isInitListMemberDetail: state.MemberReducer.isInitListMemberDetail,

        optMember: state.MemberReducer.optMember,
        formulaList: state.FormulaReducer.List,
        bankerList: state.MemberReducer.bankerList,
        selectedItemList: state.MemberReducer.selectedItemList,
        formulaByMemberList: state.MemberReducer.formulaByMemberList,

        formDeleteDetailStatus: state.MemberReducer.formDeleteDetailStatus,
        isOpenModalDeleteDetail: state.MemberReducer.isOpenModalDeleteDetail,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getFormula: _ => dispatch(getFormula()),
        getFormulaByMember: params => {dispatch(getFormulaByMember(params))},
        toggleModalDeleteMemberDetail: params => dispatch(toggleModalDeleteMemberDetail(params)),
    };
};


export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(DetailMemberContainer);