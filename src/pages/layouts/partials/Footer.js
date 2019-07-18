import React, { Component } from 'react';

import { AppConfig } from 'my-constants'
import { TransComponent } from 'my-components'

class Footer extends Component {
    render() {
        return (
            <div className="page-footer">
                <div className="page-footer-inner text-center">
                    2019 © VW3 Application | <TransComponent i18nKey="version" /> : {AppConfig.DATE_RELEASE} | <TransComponent i18nKey="release date" /> :  {AppConfig.VERSION_RELEASE}
                </div>
                <div className="scroll-to-top">
                    <i className="icon-arrow-up" />
                </div>
            </div>
        );
    }
}

export default Footer;