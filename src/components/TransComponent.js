import React, { Component } from 'react';
import { withTranslation } from 'react-i18next'

class TransComponent extends Component {
    render() {
        const {t, i18nKey} = this.props
        const i18nObj = this.props.i18nObj || {}

        const keyLower = typeof i18nKey !== "undefined" ? i18nKey.toLowerCase() : i18nKey
        return (
            t(keyLower, i18nObj)
        );
    }
}

export default withTranslation()(TransComponent)