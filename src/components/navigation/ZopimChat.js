import React, {Component} from 'react';
import jQuery from 'jquery';
import { withTranslation } from 'react-i18next';

class ZopimChat extends Component {
    componentDidMount() {
        jQuery('head').append('<script id="zopim-script" src="//v2.zopim.com/?3ARvyQUdhUKhFX0Q3ylrBKs7insu5uQz"/>');
    }

    componentWillUnmount() {
        jQuery('#zopim-script').remove();
        jQuery('body > .zopim').remove();
        jQuery('style.jx_ui_StyleSheet').remove();
    }

    render() {
        const { t, label, ...otherProps } = this.props;

        return (
            <li className="pointer" id="zopim-chat" {...otherProps}>
                <a className={otherProps.className} href="javascript:void($zopim.livechat.window.openPopout());"><span className="fa fa-wechat"/> {t(label)}</a>
            </li>
        )
    }
}

export default withTranslation()(ZopimChat);