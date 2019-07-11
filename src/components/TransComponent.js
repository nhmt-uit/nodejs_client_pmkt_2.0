import React, { Component } from 'react';
import { withTranslation } from 'react-i18next'

class TransComponent extends Component {
    render() {
        const {t, i18nKey} = this.props
        const i18nObj = this.props.i18nObj || {}
        let keyLower = i18nKey
        
        try {
            keyLower = i18nKey.toLowerCase()
        } catch (e) {
            console.log(e)
        }
        return (
            t(keyLower, i18nObj)
        );
    }
}

export default withTranslation()(TransComponent)