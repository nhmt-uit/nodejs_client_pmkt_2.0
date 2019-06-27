import React, { Component } from 'react';
import { TransComponent } from 'my-components';

export default class ReportByMember extends Component {
    render() {
        return (
            <div className="tab-pane active" id="banker" key="banker">
                <div className="portlet-body">
                    <table className="table table-hover table-light">
                        <thead className="font-red">
                            <tr className="text-center">
                                <td rowSpan={2}><span className="glyphicon glyphicon-sort-by-alphabet" /></td>
                                <td rowSpan={2} className="text-left" ><TransComponent i18nKey="Member" /></td>
                                <td rowSpan={2} className="text-left" ><TransComponent i18nKey="Account" /></td>
                                <td colSpan={2}><TransComponent i18nKey="Result" /></td>
                                <td colSpan={2}><TransComponent i18nKey="Total" /></td>
                                <td colSpan={4}><TransComponent i18nKey="Formula" /></td>
                            </tr>
                            <tr className="text-center">
                                <td key={1}>VND</td>
                                <td key={2}>USD</td>
                                <td key={3}>VND</td>
                                <td key={4}>USD</td>
                                <td className="text-left"><TransComponent i18nKey="Formula name" /></td>
                                <td className="text-left"><TransComponent i18nKey="Currency" /></td>
                                <td className="text-left"><TransComponent i18nKey="Giao/Nhan" /></td>
                                <td className="text-left"><TransComponent i18nKey="Detail" /></td>
                            </tr>
                        </thead>
                        <tbody>
                        
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
