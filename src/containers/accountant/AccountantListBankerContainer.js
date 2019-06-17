import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Collapse } from 'reactstrap'
import {
    TreeDataState,
    CustomTreeData,
  } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableTreeColumn } from '@devexpress/dx-react-grid-bootstrap3'
import LazyLoad from 'react-lazyload';

const getChildRows = (row, rootRows) => (row ? row.items : rootRows);
const Cell = (props) => {
    // console.log(props)
    return (
            <Table.Cell {...props}>
            </Table.Cell>
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
            <td>7</td>
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
    return <TableTreeColumn.Cell {...props} rowSpan={props.row.rowSpan || 1}/>;
};

class AccountantListBankerContainer extends Component {
    state = {
        isOpen: true
    }

    handleCollapse = _ => {
        let isOpen = !this.state.isOpen
        this.setState({isOpen})
    }

    renderListBankerAccount = bankerAccounts => {
        let xhtml = null
        console.log(bankerAccounts)
        let rowData = [
            { id: 123213, account: "Femallele Cha", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", rowSpan:2,
            items:[
                { id: 123214, account: "Femalee Con", report_type: "Sandra", turnover: "Las Vegas", company: "Audi A4", parentId: 123213 },
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
                return (
                    <Collapse isOpen={this.handleCollapse} className="portlet-body">
                        <div className="panel-group accordion">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h4 className="panel-title">
                                        <div className="col-sm-6">
                                            <label className="mt-checkbox uppercase">
                                                <input type="checkbox" onChange={_ => null} /> {account.acc_name}
                                                <span></span>
                                            </label>
                                        </div>
                                        <div className="col-sm-6"><label className="mt-checkbox "> {account.note}</label></div>
                                        <div className="clearfix"></div>
                                    </h4>
                                </div>
                                <Collapse isOpen={this.state.isOpen} className="panel-collapse">
                                    <div className="panel-body">
                                        <LazyLoad>
                                            <Grid
                                                rows={rowData}
                                                columns={[
                                                    { name: "account", title: "Account" },
                                                    { name: "report_type", title: "Report Type" },
                                                    { name: "turnover", title: "Turn over" },
                                                    { name: "net_turnover", title: "Net Turn over" },
                                                    { name: "gross_comm", title: "GrossComm" },
                                                    { name: "member_comm", title: "MemberComm" },
                                                    { name: "win_loss", title: "Win lose" },
                                                    { name: "company", title: "Company" },
                                                    { name: "total_code", title: "Total code" },
                                                    { name: "formua", title: "Formula" },
                                                    { name: "member", title: "Member" },
                                                    { name: "result", title: "Result" },
                                                    { name: "currency", title: "Currency" },
                                                    { name: "control_formula", title: "+/- Formula" },
                                                ]}>
                                                <TreeDataState defaultExpandedRowIds={[4]} />
                                                <CustomTreeData getChildRows={getChildRows} />
                                                <Table
                                                    cellComponent={Cell}
                                                    rowComponent={Row}
                                                    columnExtensions={[{ columnName: 'account', width: 300 }]}
                                                />
                                                <TableHeaderRow />
                                                <TableTreeColumn for="account" cellComponent={treeColumnCell}/>
                                            </Grid>
                                    </LazyLoad>
                                    </div>
                                </Collapse>

                            </div>
                        </div>
                    </Collapse>
                )
            })
        }
        return xhtml
    }

    renderListBanker = _ => {
        let xhtml = null
        if (this.props.accountant_payload) {
            const listBankerProcessed = this.props.accountant_payload.listBankerProcessed
            xhtml = listBankerProcessed.map((banker, idx) => {
                return (
                    <div className="portlet box grey-cascade list-banker-account">
                        <div className="portlet-title">
                            <div className="caption">
                                <label className="mt-checkbox caption-subject bold uppercase">
                                    <input type="checkbox"  /> {banker.name}
                                    <span></span>
                                </label>
                            </div>
                            <div className="tools"><a href="#/"  onClick={this.handleCollapse}> hide show </a></div>
                        </div>

                        {this.renderListBankerAccount(banker.listAccounts)}
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
    }
}

export default compose(
    connect(mapStateToProps, null),
    withTranslation()
)(AccountantListBankerContainer);