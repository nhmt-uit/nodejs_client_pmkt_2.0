import React, { Component } from 'react'
import PropTypes, { bool } from 'prop-types'

import { TransComponent } from 'my-components';

export default class BookTabContentContainer extends Component {
    static propTypes = {
        id: PropTypes.any.isRequired,
        isActive: bool,
    }

    static defaultProps = {
        isActive: false
    };

    render() {
        const { id, isActive } = this.props;
        const classActive = isActive ? 'active' : '';

        return (
            <div className={`tab-pane ${classActive}`} id={id}>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="font-red">
                            <tr className="font-red-sunglo">
                                <td><span className="glyphicon glyphicon-sort-by-alphabet" /></td>
                                <th><TransComponent i18nKey="Account name" /></th>
                                <th><TransComponent i18nKey="Login name" /></th>
                                <th><TransComponent i18nKey="Company" /></th>
                                <th>&nbsp;</th>
                                <th>
                                    <TransComponent i18nKey="Test" />
                                    &nbsp;<i className="fa fa-recycle pointer" />
                                </th>
                                <th><TransComponent i18nKey="is active" /></th>
                                <th><TransComponent i18nKey="Link formula" /></th>
                                <th><TransComponent i18nKey="Edit" /></th>
                                <th><TransComponent i18nKey="Delete" /></th>
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
