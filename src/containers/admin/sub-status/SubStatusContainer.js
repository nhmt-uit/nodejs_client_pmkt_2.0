import React, {Component, Fragment} from 'react';
import { connect } from 'react-redux';
import { cloneDeep as _cloneDeep } from 'lodash';

import { TransComponent, LoadingComponent } from 'my-components';
import { getSubUsers, clearSubUsers } from 'my-actions/sub-status/SubStatusAction';
import { AccountItemContainer, ActionModalContainer } from 'my-containers/admin/sub-status';

class SubStatusContainer extends Component {
    componentDidMount() {
        this.props.getSubUsers();
    }

    componentWillUnmount() {
        this.props.clearSubUsers();
    }

    renderBody(type) {
        const lstSub = this.props.lstSub;
        const lstAccount = lstSub[type] || [];

        let order = 0;

        if (lstAccount.length <= 40) {
            return lstAccount.map((acc, idx) => <AccountItemContainer key={idx} isActive={type === 'active'} account={acc} order={ idx + 1 } />)
        }

        const result = [];
        const loopResult = lst => {
            if (lst.length > 40) {
                const lstMap = lst.splice(0, 40);

                if (!result.length) {
                    result.push(
                        <Fragment key={result.length}>{ lstMap.map(acc => <AccountItemContainer key={acc.id} isActive={type === 'active'} account={acc} order={ ++order } />) }</Fragment>
                    );
                } else {
                    result.push(
                        <Fragment key={result.length}>
                            { lstMap.map(acc => <AccountItemContainer key={acc.id} isActive={type === 'active'} account={acc} order={ ++order } />) }
                        </Fragment>
                    );
                }

                loopResult(lst);
            } else {
                result.push(
                    <Fragment key={result.length}>{ lst.map(acc => <AccountItemContainer key={acc.id} isActive={type === 'active'} account={acc} order={ ++order } />) }</Fragment>
                );
            }
        };

        loopResult(_cloneDeep(lstAccount));

        return result;
    }

    render() {
        return (
            <>
                <div className="portlet box blue-hoki position-relative">
                    <div className="portlet-title tabbable-line padding-top-0">
                        <div className="caption bold uppercase font-size-15"><TransComponent i18nKey="Sub status management" /></div>
                        <ul className="nav nav-tabs nav-tab-account">
                            <li className="active">
                                <a href="#tabpane-locked" data-toggle="tab" className="text-uppercase">
                                    <i className="fa fa-lock font-green" /><TransComponent i18nKey="Locked subs" />
                                </a>
                            </li>
                            <li data-toggle="tab">
                                <a href="#tabpane-active" data-toggle="tab" className="text-uppercase">
                                    <i className="fa fa-unlock font-green" /><TransComponent i18nKey="Active subs" />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="portlet-body position-relative min-height-60">
                        { this.props.isFetchingSub ? <LoadingComponent /> : null }
                        <div className="tab-content">
                            <div className="tab-pane active" id="tabpane-locked">
                                <table className="table table-hover table-formula">
                                    <thead className="font-red-sunglo">
                                        <tr>
                                            <th>#</th>
                                            <th><TransComponent i18nKey='Users' /></th>
                                            <th><TransComponent i18nKey="Status" /></th>
                                            <th className="text-center"><TransComponent i18nKey='Activate' /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.renderBody('locked') }
                                    </tbody>
                                </table>
                            </div>
                            <div className="tab-pane" id="tabpane-active">
                                <table className="table table-hover table-formula">
                                    <thead className="font-red-sunglo">
                                        <tr>
                                            <th>#</th>
                                            <th><TransComponent i18nKey='Users' /></th>
                                            <th><TransComponent i18nKey="Status" /></th>
                                            <th className="text-center"><TransComponent i18nKey='Activate' /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.renderBody('active') }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <ActionModalContainer />
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        lstSub: state.SubStatusReducer.lstSub || {},
        isFetchingSub: state.SubStatusReducer.isFetchingSub || false,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getSubUsers: () => dispatch(getSubUsers()),
        clearSubUsers: () => dispatch(clearSubUsers()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SubStatusContainer);