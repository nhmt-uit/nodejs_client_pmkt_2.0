import React, { Component } from 'react';
import { Table } from 'react-bootstrap'
import PropTypes from 'prop-types';
import { 
    sortBy as _sortBy,
    toArray as _toArray
 } from 'lodash';
 import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { CookieService } from 'my-utils/core';
import { TransComponent } from 'my-components';
import { Helpers } from 'my-utils';

export default class ReportByMember extends Component {
    static propTypes = {
        reportStore: PropTypes.object
    };

    static defaultProps = {
        reportStore: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            memberName: '',
            accountDetail: {},
        };
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    renderModalDetail() {
        const { isOpen, memberName, accountDetail } = this.state;
        const formulaDetail = accountDetail.formula_detail ? JSON.parse(JSON.parse(accountDetail.formula_detail)) : {};

        return (
            <Modal isOpen={isOpen} toggle={this.toggle} size="lg">
                <ModalHeader toggle={this.toggle}><strong>{ memberName }</strong></ModalHeader>
                <ModalBody>
                    <div className="table-responsive">
                        <Table responsive striped bordered condensed>
                            <thead className="font-red">
                                <tr>
                                    <th><TransComponent i18nKey={'Formula name'}/></th>
                                    <th key="formatName"><TransComponent i18nKey="Type"/></th>
                                    { (formulaDetail.fieldList || []).map(function (field) {
                                        return (<th key={field['dis']}
                                                    className="text-right"><TransComponent i18nKey={field['dis']}/></th>);
                                    })}
                                    <th><TransComponent i18nKey={'Currency'}/></th>
                                    <th><TransComponent i18nKey={'Giao/Nhan'}/></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{formulaDetail.hasOwnProperty('tenct') ? formulaDetail['tenct'] : ''}</td>
                                    <td className="text-uppercase">{accountDetail.flag}</td>
                                    { (formulaDetail.fieldList || []).map(function (field) {
                                        return (<td key={field['dis']}
                                                    className="text-right">{field['value']}</td>);
                                    })}
                                    <td>{formulaDetail.hasOwnProperty('currencyName') ? formulaDetail.currencyName :
                                        <TransComponent i18nKey={'Currency'}/>}</td>
                                    <td>{formulaDetail.hasOwnProperty('giaonhan') ? formulaDetail['giaonhan'] == 1 ?
                                        <TransComponent i18nKey={'Pay'}/> :
                                        <TransComponent i18nKey={'Receive'}/> : ''}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </ModalBody>
            </Modal>
        );
    }

    handleClickDetail = ( memberName, accountDetail) => _ => {
        this.setState({
            memberName,
            accountDetail,
            isOpen: true
        });
    }

    renderBody() {
        let { data = {}, currencyMap = [] } = this.props.reportStore;

        currencyMap = _sortBy(currencyMap, 'dv_tien_te_id');

        const roles = Number(CookieService.get('roles'));

        data = _sortBy(data, 'name');

        return data.map((member, index) => {
            const memberChild = member.child ? _sortBy(_toArray(member.child), 'name') : [];

            return (
                <tbody key={member.id}>
                    {
                        memberChild.map((item, i) => {
                            const formulaDetail = item.formula_detail ? JSON.parse(JSON.parse(item.formula_detail)) : {};
                            const isFirstChild = i === 0;

                            return (
                                <tr key={item.id}>
                                    { isFirstChild ? <td rowSpan={memberChild.length}>{ index + 1 }</td> : null }
                                    { isFirstChild ? <td rowSpan={memberChild.length}>{ member.name }</td> : null }
                                    <td>{item.name1 ? item.name1 : item.name}</td>
                                    { currencyMap.map(currency => {
                                        const value = currency.dv_tien_te_id === item.dv_tien_te_id ? item.result : 0;
                                        const classCurrency = Number(value) < 0 ? 'font-red' : 'font-blue-steel';

                                        return <td className={`text-right ${classCurrency}`} key={currency.dv_tien_te_id}>{ Helpers.formatMoney(value, 0) }</td>;
                                        }) 
                                    }
                                    { currencyMap.map(currency => {
                                        const value = member.total[currency.dv_tien_te_id] ? member.total[currency.dv_tien_te_id].result : 0;
                                        const classCurrency = Number(value) < 0 ? 'font-red' : 'font-blue-steel';

                                        return isFirstChild 
                                        ? <td className={`text-right ${classCurrency}`} rowSpan={memberChild.length} key={currency.dv_tien_te_id}>
                                            { Helpers.formatMoney(value, 0) }
                                        </td>
                                        : null
                                    })
                                    }
                                    <td>{ roles !== 12 ? formulaDetail.tenct : null }</td>
                                    <td>{ item.dv_tien_te }</td>
                                    <td>
                                        {
                                            formulaDetail.hasOwnProperty('giaonhan')
                                                ? !!Number(formulaDetail['giaonhan'])
                                                    ? <TransComponent i18nKey='Pay'/>
                                                    : <TransComponent i18nKey='Receive'/> 
                                                : null
                                        }
                                    </td>
                                    <td>
                                        { roles !== 12
                                            ? <a className="pointer" href="#/" onClick={this.handleClickDetail(member.name, item)}><TransComponent i18nKey={'Detail'}/></a>
                                            : null
                                        }
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            )
        })
    }

    render() {
        const { currencyMap = [], data, total = {} } = this.props.reportStore;
        console.log(currencyMap, data);
        const currencyList = _sortBy(currencyMap, 'dv_tien_te_id');

        return (
            <div className="tab-pane active" id="banker" key="banker">
                <div className="portlet-body">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="font-red">
                            <tr className="text-center">
                                <td rowSpan={0}><span className="glyphicon glyphicon-sort-by-alphabet" /></td>
                                <td rowSpan={2} className="text-left" ><TransComponent i18nKey="Member" /></td>
                                <td rowSpan={2} className="text-left" ><TransComponent i18nKey="Account" /></td>
                                <td colSpan={currencyList.length}><TransComponent i18nKey="Result" /></td>
                                <td colSpan={currencyList.length}><TransComponent i18nKey="Total" /></td>
                                <td colSpan={4}><TransComponent i18nKey="Formula" /></td>
                            </tr>
                            <tr className="text-center">
                                {
                                    currencyList.map((item, index) => {
                                        return <td key={index}>{ item.dv_tien_te }</td>;
                                    })
                                }
                                {
                                    currencyList.map((item, index) => {
                                        return <td key={index}>{ item.dv_tien_te }</td>;
                                    })
                                }
                                <td className="text-left"><TransComponent i18nKey="Formula name" /></td>
                                <td className="text-left"><TransComponent i18nKey="Currency" /></td>
                                <td className="text-left"><TransComponent i18nKey="Giao/Nhan" /></td>
                                <td className="text-left"><TransComponent i18nKey="Detail" /></td>
                            </tr>
                        </thead>
                        { this.renderBody() }
                        <tfoot>
                            <tr>
                                <td colSpan={currencyList.length + 3} className="text-center">
                                    <strong><TransComponent i18nKey={'Total'}/></strong>
                                </td>
                                {currencyList.map((item) => {
                                    const value = total[item.dv_tien_te_id] ? total[item.dv_tien_te_id].result : 0;
                                    const classCurrency = Number(value) < 0 ? 'font-red' : 'font-blue-steel';

                                    return <td key={item.dv_tien_te_id} className={`text-right ${classCurrency}`}>{ Helpers.formatMoney(value, 0) }</td>;
                                })}
                                <td colSpan="4" />
                            </tr>
                        </tfoot>
                    </table>
                </div>
                { this.renderModalDetail() }
            </div>
        )
    }
}
