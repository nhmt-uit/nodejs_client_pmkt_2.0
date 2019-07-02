import React, {Component} from 'react'
import {get, isEmpty} from 'lodash';
import {withTranslation} from "react-i18next";
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import { getSuffixesMember } from "my-actions/account_sub/AccountSubAction";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

class CreateSubUserContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            isOpenDelModal: false,
            username: '',
            s1: '',
            s2: '',
            s3: '',
        }

    }
    componentWillMount() {
        this.props.getSuffixesMember();
    }

    onChangeUserNameS1 = (e) => {
        this.setState({
            s1: e.target.value
        })
    }

    onChangeUserNameS2 = (e) => {
        this.setState({
            s2: e.target.value
        })
    }

    onChangeUserNameS3 = (e) => {
        this.setState({
            s3: e.target.value
        })
    }

    createNewSubAccount = () => {
        var isOpenDelModal = this.state.isOpenDelModal;
        this.setState({
            isOpenDelModal : !isOpenDelModal,
            s1: '',
            s2: '',
            s3: '',
        })
    }

    render() {
        const {t} = this.props
        var suffixesMember = this.props.suffixesMember.suffixesMember;
        if(isEmpty(suffixesMember)){
            return null;
        }
        var Data = suffixesMember.res;
        const {username, s1, s2, s3} = this.state;

        return (
            <div className="row">
                <div className="form-group col-xs-11 text-right">
                    <a href="#/" type="submit" className="btn btn-default red" onClick={this.createNewSubAccount}> Add new </a>
                </div>
                <div className="clearfix"></div>
                <div>
                    <Modal isOpen={this.state.isOpenDelModal} toggle={() => this.createNewSubAccount()}>
                        <ModalHeader toggle={() => this.createNewSubAccount()} className="text-uppercase">
                            <strong>
                                {t('Sub Account')}
                            </strong>
                        </ModalHeader>
                        <ModalBody>
                            <form className="form-horizontal" role="form">
                                <div className="form-body">
                                    <div className="form-group">
                                        <label className="col-md-3 control-label"> Name </label>
                                        <div className="col-md-9">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Name"/>
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 control-label"> Username </label>
                                        <div className="col-md-9">
                                            <div className="form-group col-md-6">
                                                <input type="text" className="form-control" disabled value={Data.username || username}/>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="style-select">
                                                    <div className="form-group">
                                                        <select className="form-control form-control" type="select" value={s1 || Data.s1} onChange={this.onChangeUserNameS1}>
                                                            <option value="0"> 0 </option>
                                                            <option value="1"> 1 </option>
                                                            <option value="2"> 2 </option>
                                                            <option value="3"> 3 </option>
                                                            <option value="4"> 4 </option>
                                                            <option value="5"> 5 </option>
                                                            <option value="6"> 6 </option>
                                                            <option value="7"> 7 </option>
                                                            <option value="8"> 8 </option>
                                                            <option value="9"> 9 </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="style-select">
                                                    <div className="form-group">
                                                        <select className="form-control form-control" type="select" value={s2 || Data.s2} onChange={this.onChangeUserNameS2}>
                                                            <option value="0"> 0 </option>
                                                            <option value="1"> 1 </option>
                                                            <option value="2"> 2 </option>
                                                            <option value="3"> 3 </option>
                                                            <option value="4"> 4 </option>
                                                            <option value="5"> 5 </option>
                                                            <option value="6"> 6 </option>
                                                            <option value="7"> 7 </option>
                                                            <option value="8"> 8 </option>
                                                            <option value="9"> 9 </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <div className="style-select">
                                                    <div className="form-group">
                                                        <select className="form-control form-control" type="select" value={s3 || Data.s3} onChange={this.onChangeUserNameS3}>
                                                            <option value="0"> 0 </option>
                                                            <option value="1"> 1 </option>
                                                            <option value="2"> 2 </option>
                                                            <option value="3"> 3 </option>
                                                            <option value="4"> 4 </option>
                                                            <option value="5"> 5 </option>
                                                            <option value="6"> 6 </option>
                                                            <option value="7"> 7 </option>
                                                            <option value="8"> 8 </option>
                                                            <option value="9"> 9 </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 control-label"> Password </label>
                                        <div className="col-md-9">
                                            <input type="password" className="form-control" placeholder="Password"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">re-Password</label>
                                        <div className="col-md-9">
                                            <div className="input-icon right">
                                                <input type="password" className="form-control" placeholder="re-Password"/>
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
        suffixesMember: get(state, 'AccountSubReducer',{})
    }
}

const mapDispatchToProps = dispatch => {
    return{
        getSuffixesMember: params => {dispatch(getSuffixesMember(params))}
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(CreateSubUserContainer);