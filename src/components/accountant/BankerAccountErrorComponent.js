import React, { Component } from 'react';
import { withTranslation } from 'react-i18next'
import { isEmpty as _isEmpty} from 'lodash'

class BankerAccountErrorComponent extends Component {
    renderBankerAccount() {
        const { t, bankerAccounts } = this.props
        return bankerAccounts.map((item, idx) => {
            return (
                <span key={idx} className="col-md-12"> <b className="uppercase">{item.acc_name}</b> : {t(item.message)} </span>
            )
        })
    }

    render() {
        const { t, bankerAccounts } = this.props
        if (_isEmpty(bankerAccounts)) return false
        return (
            <div className="col-md-6">
                <div className="portlet box">
                    <div className="portlet-title bg-default">
                        <div className="caption">{t("Error account")}</div>
                        <div className="tools">
                            <a href="#/" title=""> <i className="fa fa-pencil"></i></a>
                            <a href="#/" title=""> <i className="fa fa-trash"></i></a>
                        </div>
                    </div>
                    <div className="portlet-body body-notify-acc-scan bg-danger">
                        <div className="row">
                            {this.renderBankerAccount()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(BankerAccountErrorComponent);