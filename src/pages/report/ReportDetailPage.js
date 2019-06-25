import React, {Component} from 'react';

import { ReportDetail } from 'my-containers/report';
import { Helpers } from 'my-utils'

class ReportDetailPage extends Component {

    componentDidMount() {
        Helpers.hideLoading();
    }

    render() {
        return (
            <div className="row">
                    <ReportDetail />
            </div>
        );
    }
}

export default ReportDetailPage;