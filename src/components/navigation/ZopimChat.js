import React, {Component} from 'react';
import jQuery from 'jquery';
import { TransComponent } from 'my-components'

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
        return (
            <li className="dropdown dropdown-live-chat" id="zopim-chat">
                <a className="dropdown-toggle" href="javascript:void($zopim.livechat.window.openPopout());">
                    <span className="fa fa-wechat"/> &nbsp;
                    <span className="hide-on-mobile"><TransComponent i18nKey="Live support" /></span>
                </a>
            </li>
        )
    }
}

export default ZopimChat