import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';

class ReportStatisticContainer extends Component {
    render() {
        const t = this.props.t;

        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject font-green sbold uppercase">{t('Statistical')}</span>
                    </div>
                </div>
                <div className="portlet-body ">

                </div>
            </div>
        );
    }
}

export default withTranslation()(ReportStatisticContainer);