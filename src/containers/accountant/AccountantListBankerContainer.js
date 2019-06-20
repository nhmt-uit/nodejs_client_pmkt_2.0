import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Collapse } from 'reactstrap'
import {
    TreeDataState,
    CustomTreeData,
    DataTypeProvider
  } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableTreeColumn } from '@devexpress/dx-react-grid-bootstrap3'
import LazyLoad from 'react-lazyload';

import { collapseBanker, checkBanker, checkBankerAccount } from 'my-actions/AccountantAction';

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
        <div class="td-item">number 001</div>
        <div class="td-item">number 002</div>
        <div class="td-item">number 003</div>
        <div class="td-item">number 004</div>
    </>
  );

  const CurrencyTypeProvider = props => (
    <DataTypeProvider
      formatterComponent={CurrencyFormatter}
      {...props}
    />
  );

class AccountantListBankerContainer extends Component {

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
            ]},
            
        ];

        if (bankerAccounts) {
            xhtml = bankerAccounts.map((account, idx) => {
                let isCheckBankerAccount = this.props.isCheckBankerAccount[account.id] || false
                return (
                    <div key={idx} className="panel-group accordion">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <div className="col-sm-6">
                                        <label className="mt-checkbox uppercase">
                                            <input type="checkbox" onChange={_ => this.props.checkBankerAccount(account.banker, account.id)} checked={isCheckBankerAccount}/> {account.acc_name}
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
    | Render List Banker
    |--------------------------------------------------------------------------
    */
    renderListBanker = _ => {
        let xhtml = null
        if (this.props.accountant_payload) {
            const listBankerProcessed = this.props.accountant_payload.listBankerProcessed
            xhtml = listBankerProcessed.map((banker, idx) => {
                let isOpenBanker = this.props.isOpenBanker[banker.id] || false
                let isCheckBanker = this.props.isCheckBanker[banker.id] || false
                let classOpenBanker = isOpenBanker ? "fa fa-chevron-down" : "fa fa-chevron-up"
                return (
                    <div key={idx} className="portlet box grey-cascade list-banker-account">
                        <div className="portlet-title">
                            <div className="caption">
                                <label className="mt-checkbox caption-subject bold uppercase">
                                    <input type="checkbox" onChange={_ => this.props.checkBanker(banker.id)} checked={isCheckBanker} /> {banker.name}
                                    <span></span>
                                </label>
                            </div>
                            <div className="tools"><a href="#/"  onClick={_ => this.props.collapseBanker(banker.id)}><i className={classOpenBanker}></i></a></div>
                        </div>
                        <Collapse key={idx} isOpen={isOpenBanker} className="portlet-body">
                            {this.renderListBankerAccount(banker.listAccounts)}
                        </Collapse>
                    </div>
                )
            })
        }
        return xhtml
    }


    render() {
        return (
            this.renderListBanker()
        );
    }
}

const mapStateToProps = state => {
    return {
        accountant_payload : state.AccountantReducer.payload,
        isOpenBanker : state.AccountantToggleReducer.isOpenBanker,
        isCheckBanker : state.AccountantToggleReducer.isCheckBanker,
        isCheckBankerAccount : state.AccountantToggleReducer.isCheckBankerAccount,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        collapseBanker: bankerId => {dispatch(collapseBanker(bankerId))},
        checkBanker: bankerId => {dispatch(checkBanker(bankerId))},
        checkBankerAccount: (bankerId, bankerAccountId) => {dispatch(checkBankerAccount(bankerId, bankerAccountId))},
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(AccountantListBankerContainer);