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
        }

    }
    componentWillMount() {
        this.props.getSuffixesMember();
    }

    createNewSubAccount = () => {
        var isOpenDelModal = this.state.isOpenDelModal;
        this.setState({
            isOpenDelModal : !isOpenDelModal,
        })
    }

    render() {
        const {t} = this.props
        console.log("Props", this.props)
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
                                                <input type="password" className="form-control" placeholder="Name"/>
                                                <span className="input-group-addon">
                                                    <i className="fa fa-user"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 control-label"> Username </label>
                                        <div className="col-md-9">
                                            <input type="text" className="form-control" placeholder="Username"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 control-label"> Password </label>
                                        <div className="col-md-9">
                                            <input type="text" className="form-control" placeholder="Password"/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">re-Password</label>
                                        <div className="col-md-9">
                                            <div className="input-icon right">
                                                <input type="text" className="form-control" placeholder="re-Password"/>
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