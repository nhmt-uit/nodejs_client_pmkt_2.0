import React, {Component} from 'react'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";

import {TransComponent} from 'my-components'
import {get as _get} from 'lodash';
import {renderError} from 'my-utils/components/redux-form/render-form'

import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import AccountSubServices from 'my-services/account_sub/AccountSubServices';
import { createMemberSub, getMemberSub } from 'my-actions/account_sub/AccountSubAction'
import {reduxForm, Field} from "redux-form";

const optSubMemberNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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

    changeIsOpenCreateUserModal = () =>{
        var isOpenCreateUserModal = this.state.isOpenCreateUserModal;
        this.setState({
            isOpenCreateUserModal : !isOpenCreateUserModal,
        })
    }

    createNewSubAccount = () => {
        var isOpenCreateUserModal = this.state.isOpenCreateUserModal;
        var self = this;
        const post = {
            status: _get(this.props.initialValues, 'status', false),
            fullname: _get(this.props.initialValues, 'fullname'),
            username: _get(this.props.initialValues, 'username'),
            s1: _get(this.props.initialValues, 's1'),
            s2: _get(this.props.initialValues, 's2'),
            s3: _get(this.props.initialValues, 's3'),
            password: _get(this.props.initialValues, 'password'),
            re_password: _get(this.props.initialValues, 're_password'),
        }
        this.props.createMemberSub(post)
            .then(function () {
                self.props.getMemberSub()
            })
            .then(function () {
                self.setState({
                    isOpenCreateUserModal : !isOpenCreateUserModal,
                })
            })
            .then(function () {
                self.props.reset('createSubUser');
            })
            .catch(function (err) {
                console.log(err)
            })

    }

    render() {
        const { t }  = this.props;
        return (
            <div className="row">
                <div className="form-group col-xs-11 text-right">
                    <a type="submit" className="btn btn-default red" onClick={this.changeIsOpenCreateUserModal}><TransComponent i18nKey="Add new"/></a>
                </div>
                <div className="clearfix"></div>
                <div>
                    <Modal isOpen={this.state.isOpenCreateUserModal} toggle={() => this.changeIsOpenCreateUserModal()}>
                        <ModalHeader toggle={() => this.changeIsOpenCreateUserModal()} className="text-uppercase">
                            <strong>
                                <TransComponent i18nKey="Sub account"/>
                            </strong>
                        </ModalHeader>
                        <ModalBody>
                            <form name="form_member">
                                <div className="form-body">
                                    <div className="form-group">
                                        <label><TransComponent i18nKey="Full name"/></label>
                                        <Field
                                            name="fullname"
                                            type="text"
                                            component="input"
                                            className="form-control form-control-solid placeholder-no-fix"
                                            autoComplete="off"
                                        />
                                        <Field name="fullname" component={renderError}/>
                                    </div>
                                    <div className="form-group">
                                        <label><TransComponent i18nKey="Username"/></label>
                                        <div className="row">
                                            <div className="col-md-4" style={{paddingRight: '0px'}}>
                                                <Field
                                                    name="username"
                                                    component="input"
                                                    className="form-control form-control-solid placeholder-no-fix"
                                                    autoComplete="off"
                                                    readOnly={true}
                                                />
                                            </div>
                                            <div className="col-md-2" style={{paddingRight: '0px'}}>
                                                <Field name="s1" component="select" className="form-control">
                                                    {
                                                        optSubMemberNumber.map(item => {
                                                            return (<option key={item} value={item}>{item}</option>)
                                                        })
                                                    }
                                                </Field>
                                            </div>
                                            <div className="col-md-2" style={{paddingRight: '0px'}}>
                                                <Field name="s2" component="select" className="form-control">
                                                    {
                                                        optSubMemberNumber.map(item => {
                                                            return (<option key={item} value={item}>{item}</option>)
                                                        })
                                                    }
                                                </Field>
                                            </div>
                                            <div className="col-md-2" style={{paddingRight: '0px'}}>
                                                <Field name="s3" component="select" className="form-control">
                                                    {
                                                        optSubMemberNumber.map(item => {
                                                            return (<option key={item} value={item}>{item}</option>)
                                                        })
                                                    }
                                                </Field>
                                            </div>
                                        </div>
                                        <Field name="username" component={renderError}/>
                                    </div>
                                    <div className="form-group">
                                        <label><TransComponent i18nKey="Password"/></label>
                                        <Field
                                            name="password"
                                            type="password"
                                            component="input"
                                            className="form-control form-control-solid placeholder-no-fix"
                                            autoComplete="off"
                                        />
                                        <Field name="password" component={renderError}/>
                                    </div>
                                    <div className="form-group">
                                        <label><TransComponent i18nKey="Re-password"/></label>
                                        <Field
                                            name="re_password"
                                            type="password"
                                            component="input"
                                            className="form-control form-control-solid placeholder-no-fix"
                                            autoComplete="off"
                                        />
                                        <Field name="re_password" component={renderError}/>
                                    </div>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="button" className="bg-red font-white" disabled={this.props.invalid}
                                    onClick={this.createNewSubAccount}><TransComponent i18nKey="Save"/></Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        );
    }
}

const asyncValidate = (values, dispatch, props, currentFieldName) => {
    const errors = {}
    return new Promise((resolve, reject) => {
        //Validate fullname
        if (currentFieldName === "fullname") {
            AccountSubServices.validateMemberSubName(values.fullname).then(res => {
                if (res.status === false) {
                    errors.fullname = res.res.data.message
                    return reject(errors)
                }
            })
        }

        //Validate username suffixes
        if (["s1", "s2", "s3"].includes(currentFieldName)) {
            const username = values.username + values.s1 + values.s2 + values.s3
            AccountSubServices.validateMemberSubUser(username).then(res => {
                if (res.status === false) {
                    errors.username = res.res.data.message
                    return reject(errors)
                } else {
                    return resolve()
                }
            })
        }
    });
}

const validate = values => {
    const errors = {}
    if (!values.fullname) {
        errors.fullname = '"fullname" is not allowed to be empty'
    }
    if (!values.member) {
        errors.member = '"member" is not allowed to be empty'
    }

    if (!values.password) {
        errors.password = '"Password" is not allowed to be empty'
    } else if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z!@#$%]{8,}$/).test(values.password)) {
        errors.password = '"password" had at least 8 char & contain 1 uppercase letter, 1 lowercase letter, 1 number, 1 special letter'
    }

    if (!values.re_password || values.re_password !== values.password) {
        errors.re_password = 'confirm password fail'
    }
    return errors
};

const mapStateToProps = state => {
    console.log(state)
    return {
        initialValues: _get(state, 'form.createSubUser.values'),
        formSaveStatus: state.AccountSubReducer.formSaveStatus,
        formSaveResponse: state.AccountSubReducer.formSaveResponse,

    }
};

const mapDispatchToProps = dispatch => {
    return{
        createMemberSub: post => dispatch(createMemberSub(post)),
        getMemberSub: params => {dispatch(getMemberSub(params))},
    }
};

export default compose(
    reduxForm({
        form: 'createSubUser',
        validate,
        asyncValidate: asyncValidate,
        asyncChangeFields: ['fullname', 's1', 's2', 's3']
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(CreateSubUserContainer);