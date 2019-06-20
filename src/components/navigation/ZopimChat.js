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
        const { t } = this.props;
        return (
            <li className="pointer" id="zopim-chat">
                <a className="text-red" href="javascript:void($zopim.livechat.window.openPopout());"><span className="fa fa-wechat"/> {t("Live support")}</a>
            </li>
        )
    }
}

export default withTranslation()(ZopimChat);