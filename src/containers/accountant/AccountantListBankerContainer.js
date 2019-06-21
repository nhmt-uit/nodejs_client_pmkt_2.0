import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Collapse } from 'reactstrap'
import { has as _has } from 'lodash'
import {
    TreeDataState,
    CustomTreeData,
    DataTypeProvider
  } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableTreeColumn } from '@devexpress/dx-react-grid-bootstrap3'
import LazyLoad from 'react-lazyload';

import { collapseBanker, checkBanker, checkBankerAccount } from 'my-actions/AccountantAction';
import { LoadingComponent } from 'my-components';
import { BankerAccountStatusIconComponent } from 'my-components/accountant';

const getChildRows = (row, rootRows) => (row ? row.items : rootRows);
const Cell = (props) => {
    // console.log(props)
    return (
        <Table.Cell {...props} />
    )
};
const Row = props => {
    console.log(props)
    let xhtml = (
        <>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td rowspan="2">7</td>
            <td>8</td>
            <td>9</td>
            <td>10</td>
            <td>11</td>
            <td>12</td>
            <td>13</td>
        </>
    )
    
    return (
        <>
            <Table.Row {...props} />
            {props.row.rowSpan > 1 ? <Table.Row {...props} children={xhtml} /> : null}
        </>
  )};




const treeColumnCell = props => {
    return <TableTreeColumn.Cell {...props} rowSpan={props.row.rowSpan || 1}/>
};


const CurrencyFormatter = ({ value }) => (
    <>
        <div className="td-item">number 001</div>
        <div className="td-item">number 002</div>
        <div className="td-item">number 003</div>
        <div className="td-item">number 004</div>
    </>
  );

  const CurrencyTypeProvider = props => (
    <DataTypeProvider
      formatterComponent={CurrencyFormatter}
      {...props}
    />
  );

class AccountantListBankerContainer extends Component {

       /*
    |--------------------------------------------------------------------------
    | Render List Banker
    |--------------------------------------------------------------------------
    */
    renderListBanker = _ => {
        let xhtml = null

        // Sending request to websocket
        if (!this.props.isSocketInitSuccess) {
            xhtml = <LoadingComponent />
        }

        // Finish socket init & get message
        if (this.props.isSocketInitSuccess && this.props.accountant_payload) {
            const listBankerProcessed = this.props.accountant_payload.listBankerProcessed
            xhtml = listBankerProcessed.map((banker, idx) => {
                let isOpenBanker = _has(this.props.isOpenBanker, banker.id) ? this.props.isOpenBanker[banker.id] : true
                let isCheckBanker = _has(this.props.isCheckBanker, banker.id) ? this.props.isCheckBanker[banker.id] : false
                let classOpenBanker = isOpenBanker ? "fa fa-chevron-down" : "fa fa-chevron-up"
                return (

                    <div key={idx} className="portlet box grey-cascade list-banker-account">
                        <div className="portlet-title">
                            <div className="caption">
                                <label className="mt-checkbox caption-subject bold uppercase">
                                    <input type="checkbox" onChange={_ => this.props.checkBankerAccount("banker", {bankerId: banker.id})} checked={isCheckBanker} /> {banker.name}
                                    <span></span>
                                </label>
                            </div>
                            <div className="tools"><a href="#/"  onClick={_ => this.props.collapseBanker('single', banker.id)}><i className={classOpenBanker}></i></a></div>
                        </div>
                        <Collapse key={idx} isOpen={isOpenBanker} className="portlet-body">
                            {this.renderListBankerAccount(banker.listAccounts)}
                        </Collapse>
                    </div>
                )
            })
            xhtml = <>
                        {this.renderUtilButton()}
                        {xhtml}
                    </>
        }
        return xhtml
    }

    /*
    |--------------------------------------------------------------------------
    | Render List Banker Account
    |--------------------------------------------------------------------------
    */
    renderListBankerAccount = bankerAccounts => {
        let xhtml = null
        let rowData = [
            { id: 123213, account: "Femallele Cha", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", rowSpan:2,
            items:[
                { id: 123214, account: "Femalee Con 01", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
                { id: 123215, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
                { id: 123216, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
                { id: 123217, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213,
                    items:[
                        { id: 123214, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
                        { id: 123215, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
                        { id: 123216, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 ,
                            items:[
                                { id: 123214, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
                                { id: 123215, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
                                { id: 123216, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
                                { id: 123217, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
                            ]},
                        { id: 123217, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
                    ] },
            ]}
            
        ];

        if (bankerAccounts) {
            xhtml = bankerAccounts.map((account, idx) => {
                let isCheckBankerAccount = _has(this.props.isCheckBankerAccount, account.id) ? this.props.isCheckBankerAccount[account.id] : false
                // let isCheckBankerAccount = true
                let objIndex = this.props.payloadBankerAccount ? this.props.payloadBankerAccount.findIndex(obj => obj.id === account.id): null
                let bankerAccountStatus = this.props.payloadBankerAccount ? this.props.payloadBankerAccount[objIndex] : null
                return (
                    <div key={idx} className="panel-group accordion">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <div className="col-sm-6">
                                        <label className="mt-checkbox uppercase">
                                            <input type="checkbox" onChange={_ => this.props.checkBankerAccount("banker_account", {bankerId: account.banker, bankerAccountId: account.id})} checked={isCheckBankerAccount}/>
                                            {account.acc_name} <BankerAccountStatusIconComponent bankerAccountStatus={bankerAccountStatus} />
                                            <span></span>
                                        </label>
                                    </div>
                                    <div className="col-sm-6"><label className="mt-checkbox "> {account.note}</label></div>
                                    <div className="clearfix"></div>
                                </h4>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        return xhtml
    }

    /*
    |--------------------------------------------------------------------------
    | Render Select ALl - select-error - collapse all
    |--------------------------------------------------------------------------
    */
    renderUtilButton = _ =>{
        const { t, isOpenBanker, isCheckBanker } = this.props
        let txtCollapse = "Close all", type_collapse_all = "close_all"
        let isCheckAll = true
        let typeCheckAll = 'uncheck_all'
         
        for (let x in isOpenBanker) {
            if(!isOpenBanker[x]) {
                txtCollapse = "Open all"
                type_collapse_all = "open_all"
            }
        }

        for (let x in isCheckBanker) {
            if(!isCheckBanker[x]) {
                isCheckAll = false
                typeCheckAll = 'check_all'
            }
        }
        
        return (
            <div className="row">
                <div className="form-group col-md-2 col-sm-4">
                    <label className="mt-checkbox uppercase">
                        <input type="checkbox" onChange={_ => this.props.checkBankerAccount(typeCheckAll)} checked={isCheckAll} /> {t("Select All")}
                        <span></span>
                    </label>
                </div>
                <div className="form-group col-md-10 text-right">
                    <label className="mt-checkbox uppercase" style={{marginRight: '50px'}}>
                        <input type="checkbox" onChange={_ => this.props.checkBankerAccount("toggle")} /> {t("show all")}
                        <span></span>
                    </label>
                    <a href="#/" type="submit" className="btn btn-default red" onClick={_ => this.props.checkBankerAccount("check_all_error", {payloadBankerAccount: this.props.payloadBankerAccount})} > {t("Select error accounts")}</a>
                    <a href="#/" type="submit" className="btn btn-default red" onClick={_ => this.props.collapseBanker(type_collapse_all)} > {t(txtCollapse)}</a>
                </div>
                <div className="clearfix"></div>
            </div>
        )
    }


    render() {
        
        return (
            this.renderListBanker()
        );
    }
}



const mapStateToProps = state => {
    return {
        isSocketInitSuccess : state.AccountantReducer.isSocketInitSuccess,
        accountant_payload : state.AccountantReducer.payload,
        isOpenBanker : state.AccountantToggleReducer.isOpenBanker,
        isCheckBanker : state.AccountantToggleReducer.isCheckBanker,
        isCheckBankerAccount : state.AccountantToggleReducer.isCheckBankerAccount,
        payloadBankerAccount : state.AccountantScanReducer.payloadBankerAccount
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        collapseBanker: (type, bankerId) => {dispatch(collapseBanker(type, bankerId))},
        checkBanker: bankerId => {dispatch(checkBanker(bankerId))},
        checkBankerAccount: (type_check, params) => {dispatch(checkBankerAccount(type_check, params))},
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(AccountantListBankerContainer);