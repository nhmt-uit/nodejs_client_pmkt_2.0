import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { isEqual as _isEqual, cloneDeep as _cloneDeep } from 'lodash'

import { TransComponent, PaginationComponent } from 'my-components';
import { getFormula } from 'my-actions/formula/FormulaAction'

class DetailMemberContainer extends Component {
    state = {
        currentPage: 1,
        itemPerPage: 10,
        search: {
            formulaName : null
        },
        bankerId: 'all'
    }
    

    componentWillMount() {
        this.props.getFormula()
    }

    componentDidUpdate(prevProps) {
        if(!_isEqual(prevProps.selectedItemList, this.props.selectedItemList)) {
            this.setState({bankerId: 'all'})
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

    render() {
        const {currentPage, itemPerPage, search } = this.state

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
                    <button onClick={_ => this.handleToggleNewModal()} className="btn btn-danger"><TransComponent i18nKey="Delete Selected" /></button>
                    <button onClick={_ => this.handleToggleNewModal()} className="btn btn-danger"><TransComponent i18nKey="Save" /></button>
                </div>
                <div className="portlet box blue-hoki position-relative">
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
                                        <th rowSpan="2"><TransComponent i18nKey="Formula name" /></th>
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
                                            const formulaDetail = formulaList.find(obj => obj.id === item.congthucmau_id)
                                            if(formulaDetail.field_value.length > 1) {
                                                return (
                                                    <Fragment key={index}>
                                                        <tr>
                                                            <td rowSpan="2"> {itemPerPage * (currentPage - 1) + index + 1} </td>
                                                            <td rowSpan="2" className="uppercase"> {item.acc_name} </td>
                                                            <td rowSpan="2" className="uppercase">{selectedItemList.fullname}</td>
                                                            <td rowSpan="2" className="uppercase">{item.formula_group_name}</td>
                                                            <td rowSpan="2">{formulaDetail.tenct}</td>
                                                            <td rowSpan="2">{item.banker_name.toUpperCase()}</td>
                                                            <td rowSpan="2">{formulaDetail.currency_name}</td>
                                                            <td rowSpan="2">{formulaDetail.giaonhan === -1 ? <TransComponent i18nKey={'Receive'}/> : <TransComponent i18nKey={'Pay'}/>}</td>
                                                            <td rowSpan="2">{formulaDetail.format_name}</td>
                                                            <td ><TransComponent i18nKey={'Ratio'}/></td>
                                                            <td >{formulaDetail.field_value.find(obj => obj.field_name === "he_so").value}</td>
                                                            <td rowSpan="2" className="text-center">
                                                                <label className="mt-checkbox uppercase" style={{paddingLeft: '0px'}}>
                                                                    <input type="checkbox" onChange={e => null}  />
                                                                    <span></span>
                                                                </label>
                                                            </td>
                                                            <td rowSpan="2" className="text-center">
                                                                <button className="text-success btn btn-link">
                                                                    <i className="fa fa-edit" />
                                                                </button>
                                                            </td>
                                                            <td rowSpan="2" className="text-center">
                                                                <button className="text-success btn btn-link font-red">
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
                                                            <td className="uppercase">{selectedItemList.fullname}</td>
                                                            <td className="uppercase">{item.formula_group_name}</td>
                                                            <td>{formulaDetail.tenct}</td>
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
                                                                    <input type="checkbox" onChange={e => null}  />
                                                                    <span></span>
                                                                </label>
                                                            </td>
                                                            <td className="text-center">
                                                                <button className="text-success btn btn-link">
                                                                    <i className="fa fa-edit" />
                                                                </button>
                                                            </td>
                                                            <td className="text-center">
                                                                <button className="text-success btn btn-link font-red">
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
            </>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        formulaList: state.FormulaReducer.List,
        bankerList: state.MemberReducer.bankerList,
        selectedItemList: state.MemberReducer.selectedItemList,
        formulaByMemberList: state.MemberReducer.formulaByMemberList,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getFormula: _ => dispatch(getFormula())
    };
};


export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(DetailMemberContainer);