import React, {Component} from 'react';

import { TransComponent } from 'my-components';

class LogChangePasswordContainer extends Component {
    render() {
        return (
            <div className="table-responsive">
                <table className="table table-hover table-formula">
                    <thead className="font-red-sunglo">
                    <tr>
                        <th>#</th>
                        <th><TransComponent i18nKey='Username' /></th>
                        <th><TransComponent i18nKey="New Pass" /></th>
                        <th><TransComponent i18nKey='Old Pass' /></th>
                        <th><TransComponent i18nKey='Time' /></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan={5} className="text-center"><TransComponent i18nKey="Empty data" /></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default LogChangePasswordContainer;