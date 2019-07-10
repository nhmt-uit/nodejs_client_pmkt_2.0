import React, {Component} from 'react'
import {Field, reduxForm} from "redux-form";
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import {get as _get} from "lodash";
import {TransComponent} from 'my-components'

import { createMemberSub, getMemberSub, resetFormSaveResponse } from 'my-actions/account_sub/AccountSubAction'
import AccountSubServices from 'my-services/account_sub/AccountSubServices';
import {renderError} from 'my-utils/components/redux-form/render-form'
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
const optSubMemberNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

class ModalFormEditSubUserContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isOpenModalEdit: false,
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    changeIsOpenModalEdit = () => {
        var isOpenModalEdit = !this.state.isOpenModalEdit;
        this.setState({
            isOpenModalEdit: isOpenModalEdit
        })
        this.props.destroy('editSubUser');
        this.props.resetFormSaveResponse();
    };

    onClickSaveEditAccount = (e) =>{
        e.preventDefault();
        var isOpenModalEdit = this.state.isOpenModalEdit;
        var post = {
            id: _get(this.props.initialValues, 'id'),
            fullname: _get(this.props.initialValues, 'fullname'),
            username: _get(this.props.initialValues, 'username'),
            s1: _get(this.props.initialValues, 's1'),
            s2: _get(this.props.initialValues, 's2'),
            s3: _get(this.props.initialValues, 's3'),
            status: _get(this.props.initialValues, 'status'),
            isEdit: _get(this.props.initialValues, 'isEdit'),
            except: _get(this.props.initialValues, 'username'),
            reset_pass_2: _get(this.props.initialValues, 'reset_pass_2', false),
            changePassword: _get(this.props.initialValues, 'change_pass', false),
            password: _get(this.props.initialValues, 'password', ''),
            re_password: _get(this.props.initialValues, 're_password', ''),
        }
        this.props.createMemberSub(post)
            .then( () => {
                this.props.getMemberSub()
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    callEditMemberSub = (item, isOpenModalEdit) => {
        var subUserId = item.id;
        var fullname = item.fullname.toUpperCase();
        var subUserName = item.username;
        var suffixes = item.username.slice(-3);
        var subUserStatus = item.status === 1;
        var username = subUserName.replace(suffixes,'');
        this.props.initialize({
            ...this.props.initialValues,
            id: subUserId,
            fullname: fullname,
            username: username,
            s1: suffixes[0],
            s2: suffixes[1],
            s3: suffixes[2],
            status: subUserStatus,
            isEdit: true,
        });

        this.setState({
            isOpenModalEdit: isOpenModalEdit
        })
    };

    renderAlert = _ => {
        const {formSaveStatus, formSaveResponse} = this.props
        if (formSaveStatus === false) {
            return (
                <div className="alert alert-danger">
                    <button className="close" onClick={this.props.resetFormSaveResponse}/>
                    <span><b> {formSaveResponse.data.message} </b></span>
                </div>
            )
        } else if (formSaveStatus === true) {
            return (
                <div className="alert bg-success">
                    <button className="close" onClick={this.props.resetFormSaveResponse} />
                    <span><b> Successful! </b></span>
                </div>
            )
        }
        return null;
    };

    render() {
        const changePassStatus = _get(this.props.initialValues, 'change_pass');
        const status = _get(this.props.initialValues, 'status');
        return (
            <div>
                <Modal isOpen={this.state.isOpenModalEdit} toggle={() => this.changeIsOpenModalEdit()}>
                    <ModalHeader toggle={() => this.changeIsOpenModalEdit()} className="text-uppercase">
                        <strong>
                            <TransComponent i18nKey="Update sub"/>
                        </strong>
                    </ModalHeader>
                    <ModalBody>
                        <form name="form_member">
                            <div className="form-body">
                                {this.renderAlert()}
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
                                            <Field
                                                name="s1"
                                                component="select"
                                                className="form-control form-control-solid placeholder-no-fix"
                                                autoComplete="off"
                                                readOnly={true}
                                                disabled={true}
                                            >
                                                {
                                                    optSubMemberNumber.map(item => {
                                                        return (<option key={item} value={item}>{item}</option>)
                                                    })
                                                }
                                            </Field>
                                        </div>
                                        <div className="col-md-2" style={{paddingRight: '0px'}}>
                                            <Field
                                                name="s2"
                                                component="select"
                                                className="form-control form-control-solid placeholder-no-fix"
                                                autoComplete="off"
                                                readOnly={true}
                                                disabled={true}
                                            >
                                                {
                                                    optSubMemberNumber.map(item => {
                                                        return (<option key={item} value={item}>{item}</option>)
                                                    })
                                                }
                                            </Field>
                                        </div>
                                        <div className="col-md-2" style={{paddingRight: '0px'}}>
                                            <Field
                                                name="s3"
                                                component="select"
                                                className="form-control form-control-solid placeholder-no-fix"
                                                autoComplete="off"
                                                readOnly={true}
                                                disabled={true}
                                            >
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
                                    <label className="mt-checkbox">
                                        <Field
                                            name="status"
                                            type="checkbox"
                                            component="input"
                                            autoComplete="off"
                                        /> <TransComponent i18nKey="Status"/>
                                        <span></span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="mt-checkbox">
                                        <Field
                                            name="reset_pass_2"
                                            type="checkbox"
                                            component="input"
                                            autoComplete="off"
                                        /> <TransComponent i18nKey="Reset password 2"/>
                                        <span></span>
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="mt-checkbox">
                                        <Field
                                            name="change_pass"
                                            type="checkbox"
                                            component="input"
                                            autoComplete="off"
                                        /> <TransComponent i18nKey="Click here to change password"/>
                                        <span></span>
                                    </label>
                                </div>
                                {
                                    changePassStatus === true &&  status === true ?
                                        (
                                            <>
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
                                                    <label><TransComponent i18nKey="re-password"/></label>
                                                    <Field
                                                        name="re_password"
                                                        type="password"
                                                        component="input"
                                                        className="form-control form-control-solid placeholder-no-fix"
                                                        autoComplete="off"
                                                    />
                                                    <Field name="re_password" component={renderError}/>
                                                </div>
                                            </>
                                        )
                                        : null
                                }
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button type="button" className="bg-red font-white" disabled={this.props.invalid}
                                onClick={this.onClickSaveEditAccount}><TransComponent i18nKey="Save"/></Button>
                    </ModalFooter>
                </Modal>
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
    });
}

const validate = values => {
    const errors = {}
    if (!values.fullname) {
        errors.fullname = '"fullname" is not allowed to be empty'
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
    return {
        initialValues: _get(state, 'form.editSubUser.values'),
        formSaveStatus: state.AccountSubReducer.formSaveStatus,
        formSaveResponse: state.AccountSubReducer.formSaveResponse,
    }
};

const mapDispatchToProps = dispatch => {
    return{
        createMemberSub: post => dispatch(createMemberSub(post)),
        getMemberSub: params => {dispatch(getMemberSub(params))},
        resetFormSaveResponse: params => dispatch(resetFormSaveResponse(params)),
    }
};

export default compose(
    reduxForm({
        form: 'editSubUser',
        validate,
        asyncValidate: asyncValidate,
        asyncChangeFields: ['fullname']
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormEditSubUserContainer);