import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import {compose} from "redux";

class CreateNewContainer extends Component {
    render() {
        const { t } = this.props;
        return (
            <>
                CreateNewContainer page

            </>
        );
    }
}

export default compose(
    withTranslation()
)(CreateNewContainer);