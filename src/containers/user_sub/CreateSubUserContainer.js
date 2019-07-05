import React, {Component} from 'react'
import {withTranslation} from "react-i18next";
import {compose} from "redux/es/redux";
import {connect} from "react-redux";

import {TransComponent} from 'my-components'
import {get as _get} from 'lodash';
import {renderError} from 'my-utils/components/redux-form/render-form'

import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import AccountSubServices from 'my-services/account_sub/AccountSubServices'
import {reduxForm, Field} from "redux-form";

const optSubMemberNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

class CreateSubUserContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOpenCreateUserModal: false
        }
    }

    componentWillMount() {
        AccountSubServices.getSuffixesMember().then(res =>{
            if(res.status){
                this.props.initialize({
                    ...this.props.initialValues,
                    username: res.res.username,
                    s1: res.res.s1,
                    s2: res.res.s2,
                    s3: res.res.s3,
                })
            }
        })
    }

    // onChangeUserNameS1 = (e) => {
    //     this.setState({
    //         s1: e.target.value
    //     })
    // }
    //
    // onChangeUserNameS2 = (e) => {
    //     this.setState({
    //         s2: e.target.value
    //     })
    // }
    //
    // onChangeUserNameS3 = (e) => {
    //     this.setState({
    //         s3: e.target.value
    //     })
    // }

    createNewSubAccount = () => {
        var isOpenCreateUserModal = this.state.isOpenCreateUserModal;
        this.setState({
            isOpenCreateUserModal : !isOpenCreateUserModal,
        })
    }

    render() {
        const { t }  = this.props;
        return (
            <div className="row">
                <div className="form-group col-xs-11 text-right">
                    <a href="#/" type="submit" className="btn btn-default red" onClick={this.createNewSubAccount}> Add new </a>
                </div>
                <div className="clearfix"></div>
                <div>
                    <Modal isOpen={this.state.isOpenCreateUserModal} toggle={() => this.createNewSubAccount()}>
                        <ModalHeader toggle={() => this.createNewSubAccount()} className="text-uppercase">
                            <strong>
                                {t('Sub Account')}
                            </strong>
                        </ModalHeader>
                        <ModalBody>
                            <form className="form_member">
                                <div className="form-body">
                                    <div className="form-group">
                                        <label className="col-md-3 control-label"> Name </label>
                                        <div className="col-md-9">
                                            <div className="input-group">
                                                <Field
                                                    name="name"
                                                    component="input"
                                                    className="form-control"
                                                    type="text"
                                                />
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 control-label"> Username </label>
                                        <div className="row col-md-9">
                                            <div className="col-md-5">
                                                <Field
                                                    name="username"
                                                    component="input"
                                                    className="form-control placeholder-no-fix"
                                                    autoComplete="off"
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <Field name="s1" component="select" className="form-control">
                                                    {
                                                        optSubMemberNumber.map(item => {
                                                            return (<option key={item} value={item}>{item}</option>)
                                                        })
                                                    }
                                                </Field>
                                            </div>
                                            <div className="col-md-2">
                                                <Field name="s2" component="select" className="form-control">
                                                    {
                                                        optSubMemberNumber.map(item => {
                                                            return (<option key={item} value={item}>{item}</option>)
                                                        })
                                                    }
                                                </Field>
                                            </div>
                                            <div className="col-md-2">
                                                <Field name="s3" component="select" className="form-control">
                                                    {
                                                        optSubMemberNumber.map(item => {
                                                            return (<option key={item} value={item}>{item}</option>)
                                                        })
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 control-label"> Password </label>
                                        <div className="col-md-9">
                                            <Field
                                                name="password"
                                                component="input"
                                                className="form-control"
                                                type="password"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Re-password</label>
                                        <div className="col-md-9">
                                            <div className="input-icon right">
                                                <Field
                                                    name="re-password"
                                                    component="input"
                                                    className="form-control"
                                                    type="password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="bg-red font-white" onClick={this.createNewSubAccount}> {t('Save')} </Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.createSubUser.values'),
    }
}

const mapDispatchToProps = dispatch => {
    return{
    }
}

export default compose(
    reduxForm({
        form: 'createSubUser',
    }),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(CreateSubUserContainer);