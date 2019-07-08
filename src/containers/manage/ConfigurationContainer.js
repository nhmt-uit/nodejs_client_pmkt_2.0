import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import {compose} from "redux";
import {connect} from "react-redux";
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';
import { getAccountantConfig, getCompanyConfig, getCurrencyConfig, getInitCurrency } from 'my-actions/manage/ConfigurationAction';
import { ListCurrencyComponent } from 'my-components/manage'

class ConfigurationContainer extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }

    componentDidMount() {
        this.props.getAccountantConfig();
        this.props.getCompanyConfig();
        this.props.getCurrencyConfig();
        this.props.getInitCurrency();

    }

    reloadCurrencyConfig () {
        this.props.getCurrencyConfig();
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }
    render() {
        const { t, configuration } = this.props;
        return (
            <div className="config portlet light bordered">
                    <div className="portlet-title">
                        <div className="caption font-red-sunglo"><span className="caption-subject bold uppercase">{t('Configuration')}</span></div>
                        <div className="actions">
                            <Nav tabs className="tab-right ">
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '3' })}
                                        onClick={() => { this.toggle('3'); }}>
                                        <span><i className="fa fa-bar-chart"></i> {t('Accountant')}</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '2' })}
                                        onClick={() => { this.toggle('2'); }}>
                                        <span><i className="fa fa-graduation-cap"></i> {t('Company')}</span>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => { this.toggle('1'); }}>
                                        <span><i className="fa fa-dollar"></i> {t('Currency')}</span>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </div>
                    </div>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <Col sm="12">
                                    <ListCurrencyComponent reloadCurrencyConfig={this.reloadCurrencyConfig} initCurrency={configuration.init_currency} currencyList={configuration.currency} />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col sm="6">
                                    Company
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="3">
                            <Row>
                                <Col sm="6">
                                    Accountant
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        configuration: state.ConfigurationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAccountantConfig: () => dispatch(getAccountantConfig()),
        getCompanyConfig: () => dispatch(getCompanyConfig()),
        getCurrencyConfig: () => dispatch(getCurrencyConfig()),
        getInitCurrency: () => dispatch(getInitCurrency())
    };
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(ConfigurationContainer);