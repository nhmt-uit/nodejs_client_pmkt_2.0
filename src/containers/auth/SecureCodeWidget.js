import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { getSecure, checkSecure } from 'my-actions/systems/AuthAction';

class SecureCodeWidget extends Component {
    componentDidMount() {
        this.props.getSecure();
    }

    handleSubmit(e) {
        this.props.checkSecure();
    }

    renderInput() {
        const t = this.props.t;
        const list = [
            t('first'),
            t('second'),
            t('third'),
            t('fourth'),
            t('fifth'),
            t('sixth')
        ];
        const [code1, code2] = [
            _.get(this.props, 'secureCode.code1', false),
            _.get(this.props, 'secureCode.code2', false),
        ];

        let renderData = <div />;

        if (code1 && code2) {
            renderData = list.map((item, index) => {
                const order = index + 1;

                if (order !== code1 && order !== code2) {
                    return (
                        <div className="col-md-2" key={Math.random()}>
                            <Field
                                name="username"
                                type="text"
                                component="input"
                                className="form-control"
                                autoComplete="off"
                            />
                        </div>
                    );
                }

                return (
                    <div className="col-md-2" key={Math.random()}>
                        <Field
                            name={order === code1 ? 'value1' : 'value2'}
                            autoFocus={order === code1}
                            tabIndex={order === code1 ? 1 : 2}
                            key={Math.random()}
                            type="text"
                            component="input"
                            className="form-control"
                            autoComplete="off"
                        />
                    </div>
                );
            })
        }

        return renderData;
    }

    render() {
        const t = this.props.t;

        return (
            <div className="login">
                <div className="content">
                    <div className="logo">
                        <a href="index.html">
                            <img src="/assets/images/logo.png" alt="logo vw3" />
                        </a>
                    </div>
                    <form role="form" onSubmit={this.handleSubmit}>
                        <h3 className="form-title font-green">{t("Please insert your security code")}</h3>
                        <div className="row">
                            {this.renderInput()}
                        </div>
                        <div className="row form-actions text-center">
                            <button type="submit" className="btn green uppercase">{t("Login")}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        code1: _.get(state, 'form.form_secure_code.values.code1', false),
        code2: _.get(state, 'form.form_secure_code.values.code2', false),
        secureCode: _.get(state, 'AuthReducer.secureCode', null),
        checkSecure: !!state.AuthReducer.chekcSecure,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getSecure: () => { dispatch(getSecure()) },
        checkSecure: (secureCode) => { dispatch(checkSecure(secureCode)) },
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({form: 'form_secure_code'}),
    withTranslation()
)(SecureCodeWidget);