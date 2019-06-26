import React, { Component } from 'react';
import { withTranslation } from 'react-i18next'

class TransComponent extends Component {
    render() {
        const {t, i18nKey} = this.props
        const i18nObj = this.props.i18nObj || {}
        return (
            t(i18nKey, i18nObj)
        );
    }
}

export default withTranslation()(TransComponent)