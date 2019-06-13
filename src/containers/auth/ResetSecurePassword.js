import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';

class ResetSecurePassword extends Component {
    render() {
        const t = this.props.t;

        return (
            <div className="div-top-center">
                <div className="content" style={{ padding: '1rem 2rem' }} >
                    <h3 className="text-center text-uppercase text-red">
                        <strong>{t('announcement')}</strong>
                    </h3>
                    <p>{t('Vietwin\'s accounting software has been updated secondary password function, please read carefully the content as below')}</p>
                    <hr/>
                    <ul className="ul-announcement">
                        <li className="text-red">
                            <strong><span className="glyphicon glyphicon-pushpin" />&nbsp;{t('creating secondary password "new secondary password is not duplicated main password"')}</strong>
                        </li>
                        <li className="text-red">
                            <strong><span className="glyphicon glyphicon-pushpin" />&nbsp;{t('when creating secondary password for vietwin\'s accounting software')}</strong>
                        </li>
                        <li>
                            <span className="glyphicon glyphicon-circle-arrow-right" />&nbsp;{t(`if log in to the software with secondary password, the interface only displays the homepage and the
                             functions will be disabled. after logging into secondary password but still try
                              to log in with the main password, the functions are still disabled. to reopen, please contact customer service department for assistance.`)}
                        </li>
                        <li className="text-red">
                            <strong><span className="glyphicon glyphicon-alert" />&nbsp;{t('recommendations')}</strong>
                        </li>
                        <li>
                            <span className="glyphicon glyphicon-circle-arrow-right" />&nbsp;{t('use only secondary password in an urgent case - eg: having security problems and required to log in, ...')}
                        </li>
                        <li>
                            <span className="glyphicon glyphicon-circle-arrow-right" />&nbsp;{t('the verification and reopening process will take a long time, so please don\'t try logging in for testing the function.')}
                        </li>
                        <li className="text-primary">
                            {t('Note from july 1, 2019, all accounts of accounting software are required to register by using the secondary password.')}
                        </li>
                        <li>
                            <em>{t('If have any questions, please contact customer service department for answers.')}</em>
                        </li>
                    </ul>
                    <p className='text-center'><button className="btn btn-primary red btn-announcement">{t('i accept')}</button></p>
                </div>
            </div>
        );
    }
}

ResetSecurePassword.propTypes = {};

export default withTranslation()(ResetSecurePassword);