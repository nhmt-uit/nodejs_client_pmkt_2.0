import React, {Component} from "react";
import {get, isEmpty} from 'lodash';

import {getMemberSub, delMemberSub, toggleModalMemberSub} from "my-actions/account_sub/AccountSubAction";
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {withTranslation} from "react-i18next";
import {TransComponent, LoadingComponent} from 'my-components'
import ModalFormEditSubUserContainer from "my-containers/user_sub/ModalFormEditSubUserContainer"

class ListSubUserContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            delValueID: '',
            filterText: '',
            isOpenDelModal: false,
        }
    }

    componentWillMount() {
        this.props.getMemberSub()
    }

    handleSearchChange = (e) => {
        this.setState({
            filterText: e.target.value
        })
    }

    toggleEditMemberSub = (item) => {
        this.childModalFormEditSubUserContainer.callEditMemberSub(item);
    }

    toggleDelMemberSubModal = value_id => {
        if(value_id){
            this.setState({
                delValueID: value_id,
            })
        }
        var isOpenDelModal = this.state.isOpenDelModal;
        this.setState({
            isOpenDelModal : !isOpenDelModal,
        })
    };

    handleDelMemberSub = () => {
        var post = {
            id: this.state.delValueID
        }
        this.props.delMemberSub(post)
            .then( () => {
                this.setState({
                    isOpenDelModal: !this.state.isOpenDelModal
                })
            })
            .then( () => {
                this.props.getMemberSub()
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    render() {
        const {t, memberSub} = this.props
        var listMemberSub = memberSub
        const filterTextChange = this.state.filterText;
        var x = 0;
        return (
            <div className="col-xs-12">
                <div className="portlet light bordered">
                    <div className="portlet-title">
                        <div className="caption font-red-sunglo">
                            <span className="caption-subject font-dark bold"><TransComponent i18nKey="sub list"/></span>
                        </div>
                        <div className="actions">
                            <div className="input-icon right">
                                <i className="icon-magnifier"></i>
                                <input type="text" className="form-control" placeholder={t("sub")} value={this.state.filterText} onChange={this.handleSearchChange}/>
                            </div>
                        </div>
                    </div>
                    <div className="portlet-body">
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                                <thead>
                                    <tr role="row">
                                        <th className="caption-subject font-red text-center"> # </th>
                                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Name"/></th>
                                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Username"/></th>
                                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Status"/></th>
                                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Password 2"/></th>
                                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Edit"/></th>
                                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Delete"/></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    listMemberSub.length ?
                                    listMemberSub.map((item, index) => {
                                        if(item.fullname.toUpperCase().indexOf(filterTextChange.toUpperCase()) > -1){
                                            x++;
                                            return(
                                                <tr key={index}>
                                                    <td className="text-center"> {x} </td>
                                                    <td className="uppercase"> {item.fullname} </td>
                                                    <td className="text-center uppercase"> {item.username} </td>
                                                    <td className="text-center"> {item.status === 1 ? t("Online") : t("Offline")} </td>
                                                    <td className="text-center"> {item.active_password2 === 1 ? (<span className="btn btn-danger label-active-pass2"> <TransComponent i18nKey="activate"/> </span>) : <span />} </td>
                                                    <td className="text-center"> <button className="text-success btn btn-link"
                                                                                        onClick={ () => this.toggleEditMemberSub(item)}> <i className="fa fa-edit font-green cursor-pointer"></i> </button> </td>
                                                    <td className="text-center"> <button className="text-success btn btn-link font-red"
                                                                                        onClick={ () => this.toggleDelMemberSubModal(item.id)}> <i className="fa fa-times-circle cursor-pointer"></i> </button> </td>
                                                </tr>
                                            )
                                        }
                                    })
                                    : <tr><td className="text-center" colSpan="20"><TransComponent i18nKey="Data Empty" /></td></tr>
                                }
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <Modal isOpen={this.state.isOpenDelModal} toggle={() => this.toggleDelMemberSubModal()}>
                                <ModalHeader toggle={() => this.toggleDelMemberSubModal()} className="text-uppercase">
                                    <strong>
                                        <TransComponent i18nKey="xac nhan"/>
                                    </strong>
                                </ModalHeader>
                                <ModalBody>
                                    <TransComponent i18nKey="Are you sure want to delete ?"/>
                                </ModalBody>
                                <ModalFooter>
                                    <Button className="bg-red font-white" onClick={this.handleDelMemberSub}><TransComponent i18nKey="Confirm"/></Button>
                                    <Button color="secondary" onClick={() => this.toggleDelMemberSubModal()}><TransComponent i18nKey="Cancel"/></Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </div>
                </div>
                <ModalFormEditSubUserContainer onRef={ref => (this.childModalFormEditSubUserContainer = ref)}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        memberSub: state.AccountSubReducer.memberSub,
        formMemberSubSaveStatus: state.AccountSubReducer.formSaveStatus,
    }
};

const mapDispatchToProps = dispatch => {
    return{
        getMemberSub: params => {dispatch(getMemberSub(params))},
        delMemberSub: params => dispatch(delMemberSub(params)),
        toggleModalMemberSub:  params => dispatch(toggleModalMemberSub(params)),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(ListSubUserContainer);