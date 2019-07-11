import React, {Component} from 'react'
import AccountSubServices from 'my-services/account_sub/AccountSubServices';
import {renderError} from 'my-utils/components/redux-form/render-form'
import {Field, reduxForm} from "redux-form";

import {createMemberSub, getMemberSub} from 'my-actions/account_sub/AccountSubAction'

import {TransComponent} from 'my-components'
import {get as _get} from "lodash";
import {connect} from "react-redux";
import {compose} from "redux/es/redux";

const optSubMemberNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

class FormSubUserContainer extends Component {

    componentWillMount() {
        console.log("Props", this.props)
        const {formType, item} = this.props
        if (formType === "create") {
            AccountSubServices.getSuffixesMember().then(res => {
                if (res.status) {
                    this.props.initialize({
                        ...this.props.initialValues,
                        username: res.res.username,
                        s1: res.res.s1,
                        s2: res.res.s2,
                        s3: res.res.s3,
                    })
                }
            })
        } else if (formType === "update") {
            var subUserId = item.id;
            var fullname = item.fullname.toUpperCase();
            var subUserName = item.username;
            var suffixes = item.username.slice(-3);
            var subUserStatus = item.status === 1;
            var username = subUserName.replace(suffixes, '');
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
        }
    }

    handleSubmit = e => {
        const post = {
            status: _get(this.props.initialValues, 'status', false),
            fullname: _get(this.props.initialValues, 'fullname'),
            username: _get(this.props.initialValues, 'username'),
            s1: _get(this.props.initialValues, 's1'),
            s2: _get(this.props.initialValues, 's2'),
            s3: _get(this.props.initialValues, 's3'),
            password: _get(this.props.initialValues, 'password',''),
            re_password: _get(this.props.initialValues, 're_password',''),

            id: _get(this.props.initialValues, 'id', null),
            isEdit: _get(this.props.initialValues, 'isEdit', false),
            except: _get(this.props.initialValues, 'username'),
            reset_pass_2: _get(this.props.initialValues, 'reset_pass_2', false),
            changePassword: _get(this.props.initialValues, 'change_pass', false),
        }
        console.log(post)
        this.props.createMemberSub(post)
            .then(() => {
                this.props.getMemberSub()
            })
    }

    render() {
        const {formType, item} = this.props;
        const changePassStatus = _get(this.props.initialValues, 'change_pass');
        const status = _get(this.props.initialValues, 'status');
        return (
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
                                    disabled={true}
                                />
                            </div>
                            <div className="col-md-2" style={{paddingRight: '0px'}}>
                                {formType === "create" ?
                                    <Field name="s1" component="select" className="form-control">
                                        {
                                            optSubMemberNumber.map(item => {
                                                return (<option key={item} value={item}>{item}</option>)
                                            })
                                        }
                                    </Field>
                                    :
                                    <Field name="s1" component="select" className="form-control" readOnly={true}
                                           disabled={true}>
                                        {
                                            optSubMemberNumber.map(item => {
                                                return (<option key={item} value={item}>{item}</option>)
                                            })
                                        }
                                    </Field>
                                }
                            </div>
                            <div className="col-md-2" style={{paddingRight: '0px'}}>
                                {formType === "create" ?
                                    <Field name="s2" component="select" className="form-control">
                                        {
                                            optSubMemberNumber.map(item => {
                                                return (<option key={item} value={item}>{item}</option>)
                                            })
                                        }
                                    </Field>
                                    :
                                    <Field name="s2" component="select" className="form-control" readOnly={true}
                                           disabled={true}>
                                        {
                                            optSubMemberNumber.map(item => {
                                                return (<option key={item} value={item}>{item}</option>)
                                            })
                                        }
                                    </Field>
                                }
                            </div>
                            <div className="col-md-2" style={{paddingRight: '0px'}}>
                                {formType === "create" ?
                                    <Field name="s3" component="select" className="form-control">
                                        {
                                            optSubMemberNumber.map(item => {
                                                return (<option key={item} value={item}>{item}</option>)
                                            })
                                        }
                                    </Field>
                                    :
                                    <Field name="s3" component="select" className="form-control" readOnly={true}
                                           disabled={true}>
                                        {
                                            optSubMemberNumber.map(item => {
                                                return (<option key={item} value={item}>{item}</option>)
                                            })
                                        }
                                    </Field>
                                }
                            </div>
                        </div>
                        <Field name="username" component={renderError}/>
                    </div>
                    {
                        formType === "create" ?
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
                            </>
                            : <>
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
                                    changePassStatus === true && status === true ?
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
                            </>
                    }
                    <div className="form-actions text-right">
                        <button type="button" className="btn red" disabled={this.props.invalid}
                                onClick={this.handleSubmit}><TransComponent i18nKey="Save"/></button>
                    </div>
                </div>
            </form>
        )
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
        initialValues: _get(state, 'form.sub_user_form.values'),
    }
};

const mapDispatchToProps = dispatch => {
    return {
        createMemberSub: post => dispatch(createMemberSub(post)),
        getMemberSub: params => {
            dispatch(getMemberSub(params))
        },
    };
};

export default compose(
    reduxForm({
        form: 'sub_user_form',
        validate,
        asyncValidate: asyncValidate,
        asyncChangeFields: ['fullname', 's1', 's2', 's3']
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(FormSubUserContainer);