import React, {Component} from "react";
import {get, isEmpty} from 'lodash';

import {getMemberSub, delMemberSub} from "my-actions/account_sub/AccountSubAction";
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {withTranslation} from "react-i18next";
import {TransComponent} from 'my-components'
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
        var isOpenModalEdit = true;
        this.childModalFormEditSubUserContainer.callEditMemberSub(item, isOpenModalEdit);
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
        var self = this;
        this.props.delMemberSub(post)
            .then(function () {
                self.setState({
                    isOpenDelModal: !self.state.isOpenDelModal
                })
            })
            .then(function () {
                self.props.getMemberSub()
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    render() {
        const {t} = this.props
        var DATA = this.props.memberSub.memberSub;
        if(isEmpty(DATA)){
            return null;
        }
        var listMemberSub = DATA.res.data.List;
        const filterTextChange = this.state.filterText;

        var self = this;
        return (
            <div className="col-xs-12">
                <div className="portlet light bordered">
                    <div className="portlet-title">
                        <div className="caption">
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
                                listMemberSub.map(function (item, index) {
                                    if(item.fullname.toUpperCase().indexOf(filterTextChange.toUpperCase()) > -1){
                                        return(
                                            <tr key={index}>
                                                <td className="text-center"> {index + 1} </td>
                                                <td className="text-center uppercase"> {item.fullname} </td>
                                                <td className="text-center uppercase"> {item.username} </td>
                                                <td className="text-center"> {item.status === 1 ? "Online" : "Offline"} </td>
                                                <td className="text-center"> {item.active_password2 === 1 ? (<span className="btn btn-danger label-active-pass2"> <TransComponent i18nKey="activate"/> </span>) : <span />} </td>
                                                <td className="text-center"> <button className="text-success btn btn-link"
                                                                                     onClick={ () => self.toggleEditMemberSub(item)}> <i className="fa fa-edit"></i> </button> </td>
                                                <td className="text-center"> <button className="text-success btn btn-link font-red"
                                                                                     onClick={ () => self.toggleDelMemberSubModal(item.id)}> <i className="fa fa-close"></i> </button> </td>
                                            </tr>
                                        )
                                    }
                                })
                            }
                            </tbody>
                        </table>
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
                                    <Button className="bg-red font-white" onClick={this.handleDelMemberSub}><TransComponent i18nKey="Yes"/></Button>
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
        memberSub: get(state,'AccountSubReducer', {})
    }
};

const mapDispatchToProps = dispatch => {
    return{
        getMemberSub: params => {dispatch(getMemberSub(params))},
        delMemberSub: params => dispatch(delMemberSub(params)),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(ListSubUserContainer);