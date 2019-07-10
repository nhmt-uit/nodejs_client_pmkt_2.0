import React, { Component } from 'react'
import PropTypes, { bool } from 'prop-types'

import { TransComponent } from 'my-components';
import { AccountItemContainer } from 'my-containers/account';

export default class BookTabContentContainer extends Component {
    static propTypes = {
        id: PropTypes.any.isRequired,
        isActive: bool,
    }

    static defaultProps = {
        isActive: false
    };

    flatItem(item, level = 0, order = 1) {
        item.__level = level;
        item.__order = order;

        if (item.child && item.child.length) {
            const levelNext = ++level;

            item.child.forEach((child, index) => {
                this.flatItem(child, levelNext, index + 1);
            });
        }

        return item;
    }

    renderBody() {
        const { lstAccount } = this.props;

        return lstAccount.map((item, index) => 
            <AccountItemContainer key={index} account={this.flatItem(item, 0, index + 1)} /> 
        );
    }

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
                                <th className="text-center">
                                    <TransComponent i18nKey="Test" />
                                    &nbsp;<i className="fa fa-recycle pointer" />
                                </th>
                                <th className="text-center"><TransComponent i18nKey="is active" /></th>
                                <th className="text-center"><TransComponent i18nKey="Link formula" /></th>
                                <th className="text-center"><TransComponent i18nKey="Edit" /></th>
                                <th className="text-center"><TransComponent i18nKey="Delete" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.renderBody() }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
