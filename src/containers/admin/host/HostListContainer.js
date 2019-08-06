import React, {Component} from 'react'
import {get as _get, isEmpty as _isEmpty} from "lodash";
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import { TransComponent } from 'my-components';

import { getHostManage, delHostManage } from 'my-actions/host/HostManageAction'
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

class HostListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: {},
            isOpenModal: false,
            delValueId: '',
        }
    }

    componentWillMount() {
        this.props.getHostManage()
    }

    handleShowDetail = id => {
        const visible = this.state.visible;

        visible[id] = visible[id] !== undefined ? !visible[id] : true;

        this.setState({
            visible: visible
        });
    };

    handleOpenModelDel = item => {
        var isOpenModal = this.state.isOpenModal;
        var id = '' ;
        if(item) id = item.id;

        this.setState({
            delValueId: id,
            isOpenModal: !isOpenModal,
        })
    }

    handleDelHost = () => {
        let delValueId = this.state.delValueId;
        this.props.delHostManage({id: delValueId})
            .then(() => {
                this.props.getHostManage()
            })
            .catch((err) => {
                console.log(err)
            })
        let isOpenModal = this.state.isOpenModal;
        this.setState({
            isOpenModal : !isOpenModal,
        })
    }


    render() {
        const { bankerList, dataList } = this.props;
        const { visible } = this.state;
        let tbody = [], level = 0, index = 0;
        if(!_isEmpty(dataList)){
            dataList.forEach (item => {
                const hostList = (item, level, id) => {
                    const marginLeft = `${level * 10}px`;
                    const iconChild = visible[item.id] ? <i style={{ marginLeft }} className="fa fa-chevron-down" /> : <i style={{ marginLeft }} className="fa fa-chevron-right" />;
                    const elmDOM = (
                        <tr key={item.id}>
                            <td className="text-center"> { level === 0 ? index + 1 : null } </td>
                            <td className="cursor-pointer" onClick={ () => this.handleShowDetail(item.id)}>
                                {
                                    level === 0 ?
                                        item.child.length > 0 ?
                                            <>{ iconChild }<span>&nbsp;&nbsp;{item.name.toUpperCase()}</span></>
                                            : <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.name.toUpperCase()}</span>
                                        : <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.name.toUpperCase()}</span>
                                }
                            </td>
                            {level !== 0 ?
                                <>
                                    <td className="text-center">
                                        <i className="fa fa-edit font-green cursor-pointer" onClick={() => this.props.onToggleEditHost(item)}/>
                                    </td>
                                    <td className="text-center">
                                        <i className="fa fa-trash-o font-red-sunglo cursor-pointer" onClick={ () => this.handleOpenModelDel(item)}/>
                                    </td>
                                </>
                                :
                                <>
                                    <td></td>
                                    <td></td>
                                </>
                            }
                        </tr>
                    );
                    if(level === 0 || visible[id]){
                        tbody.push(elmDOM);
                        if(item.child){
                            item.child.forEach( childItem => {
                                hostList(childItem, level + 1, item.id)
                            })
                        }
                    }
                    if(level === 0) index++
                    return tbody;
                }
                hostList(item, level)
            })
        }

        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject caption-subject font-green bold uppercase"><TransComponent i18nKey="Host list"/></span>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                            <thead>
                            <tr role="row">
                                <th className="caption-subject font-red text-center"> # </th>
                                <th className="caption-subject font-red text-center"><TransComponent i18nKey="Key:Value"/></th>
                                <th className="caption-subject font-red text-center"><TransComponent i18nKey="Edit"/></th>
                                <th className="caption-subject font-red text-center"><TransComponent i18nKey="Delete"/></th>
                            </tr>
                            </thead>
                            <tbody>
                            {tbody}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Modal isOpen={this.state.isOpenModal} toggle={() => this.handleOpenModelDel()}>
                    <ModalHeader toggle={() => this.handleOpenModelDel()} className="text-uppercase">
                        <strong>
                            <TransComponent i18nKey="xac nhan"/>
                        </strong>
                    </ModalHeader>
                    <ModalBody>
                        <TransComponent i18nKey="Are you sure ?"/>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="bg-red font-white" onClick={this.handleDelHost}><TransComponent i18nKey="Confirm"/></Button>
                        <Button color="secondary" onClick={() => this.handleOpenModelDel()}><TransComponent i18nKey="Cancel"/></Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        bankerList: _get(state, 'HostManageReducer.bankerList', {}),
        dataList: _get(state, 'HostManageReducer.dataList', {}),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getHostManage: () => dispatch(getHostManage()),
        delHostManage: params => dispatch(delHostManage(params)),

    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps)  ,
)(HostListContainer);