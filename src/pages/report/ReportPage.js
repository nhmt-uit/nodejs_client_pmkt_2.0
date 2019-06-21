import React, {Component} from 'react';

import { ReportListContainer, ReportStatisticContainer } from 'my-containers/report';
import { Helpers } from 'my-utils'

class ReportPage extends Component {

    componentDidMount() {
        Helpers.hideLoading();
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <ReportListContainer />
                </div>
                <div className="col-md-8">
                    <ReportStatisticContainer />
                </div>
            </div>
        );
    }
}

export default ReportPage;