import React, {Component} from 'react'
import { TransComponent } from 'my-components';
import {get as _get} from "lodash";
import {compose} from "redux/es/redux";
import {connect} from "react-redux";

import {withTranslation} from "react-i18next";
import { getFormulaGroup, delFormulaGroupDetail, delFormulaGroup } from 'my-actions/formula-group/FormulaGroupAction';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import { ModalFormEditFormulaGroup } from 'my-containers/formula-group'

class FormulaGroupListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            bankerId: '',
            delValueID: '',
            formulaGroupId: '',
            delBankerId: '',
            isOpenDelModal: false,
            visible: {},
        }
    }

    componentWillMount() {
        this.props.getFormulaGroup()
    }

    handleShowDetail = id => {
        const visible = this.state.visible;

        visible[id] = visible[id] !== undefined ? !visible[id] : true;

        this.setState({
            visible: visible
        });
    };

    handleCloseModalDel = () => {
        this.setState({
            delValueID: '',
            formulaGroupId: '',
            delBankerId: '',
            isOpenDelModal: false,
        })
    }

    handleOpenModelDel = (item) => {
        if(item){
            if(item.id){
                this.setState({
                    delValueID: item.id,
                })
            }
            if(item.formula_group_id && item.banker){
                this.setState({
                    formulaGroupId: item.formula_group_id,
                    delBankerId: item.banker.id
                })
            }
        }
        let isOpenDelModal = this.state.isOpenDelModal;
        this.setState({
            isOpenDelModal : !isOpenDelModal,
        })
    };

    handleEditFormulaGroup = (item) => {
        this.childModalFormEditFormulaGroup.callEditFormulaGroup(item)
    }

    handleDelFormulaGroup = () => {
        let delBankerId = this.state.delBankerId;
        let formulaGroupId = this.state.formulaGroupId;
        if(delBankerId && formulaGroupId){
            let payload = {
                formula_group_id: formulaGroupId,
                banker_id: delBankerId
            }
            this.props.delFormulaGroup(payload)
                .then( () => {
                    this.setState({
                        isOpenDelModal: !this.state.isOpenDelModal
                    })
                })
                .then( () => {
                    this.props.getFormulaGroup()
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            let payload = {
                id: this.state.delValueID
            };
            this.props.delFormulaGroupDetail(payload)
                .then( () => {
                    this.setState({
                        isOpenDelModal: !this.state.isOpenDelModal
                    })
                })
                .then( () => {
                    this.props.getFormulaGroup()
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    };

    handleSearchChange = (e) => {
        this.setState({
            filterText: e.target.value
        })
    };

    handleChangeSelectBanker = (e) => {
        this.setState({
            bankerId: e.target.value
        })
    };

    render() {
        const { t } = this.props;
        const { formulaGroupList, bankerList } = this.props;
        const { bankerId, filterText, visible } = this.state;
        let level = 0, index = 0;
        const tbody = [];
        formulaGroupList.forEach( (item) => {
            const formulaGroupDetail = (item, level, id) => {
                const marginLeft = `${level * 10}px`;
                const iconChild = visible[item.id] ? <i style={{ marginLeft }} className="fa fa-chevron-down" /> : <i style={{ marginLeft }} className="fa fa-chevron-right" />;
                const elmDOM = (
                    <tr key={item.id} >
                        <td className="text-center"> { level === 0 ? index + 1 : null } </td>
                        <td className="cursor-pointer" onClick={ () => this.handleShowDetail(item.id)}>
                            {
                                level === 0 ?
                                    item.child.length > 0 ?
                                        <>{ iconChild }<span>&nbsp;&nbsp;{item.name}</span></>
                                        : <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.name}</span>
                                    : ''
                            }
                        </td>
                        <td className="text-center"> {level === 0 ? null : item.banker.name.toUpperCase()} </td>
                        <td className="text-center"> {item.num_of_formula} </td>
                        <td className="text-center">
                            <i className="fa fa-edit font-green cursor-pointer" onClick={ () => this.handleEditFormulaGroup(item)} />
                        </td>
                        <td className="text-center">
                            <i className="fa fa-trash-o font-red-sunglo cursor-pointer" onClick={ () => this.handleOpenModelDel(item)} />
                        </td>
                    </tr>
                );

                if (level === 0 || visible[id]){
                    tbody.push(elmDOM);
                    if (item.child) {
                        if(bankerId === '' || bankerId === 'all'){
                            item.child.forEach(childItem => {
                                formulaGroupDetail(childItem, level + 1, item.id);
                            });
                        } else {
                            item.child.forEach(childItem => {
                                if(childItem.banker.id === bankerId){
                                    formulaGroupDetail(childItem, level + 1, item.id);
                                }
                            });
                        }
                    }
                }
                if(level === 0) index++
                return tbody;
            };
            // call formulaGroupDetail => search data by filterText or bankerId
            if(item.name.toUpperCase().indexOf(filterText.toUpperCase()) > -1){
                if(bankerId === '' || bankerId === 'all'){
                    formulaGroupDetail(item, level)
                } else {
                    let data = [];
                    item.child.forEach(function (items) {
                        if(items.banker.id === bankerId){
                            data.push(item)
                        }
                    });
                    data.forEach(function (item) {
                        formulaGroupDetail(item, level)
                    })
                }
            }
        });

        return(
            <div className="portlet box blue-hoki position-relative">
                <div className="portlet-title">
                    <div className="caption bold uppercase font-size-15"><TransComponent i18nKey="formula group list" /></div>
                    <div className="actions">
                        <div className="form-inline">
                            <div className="form-group">
                                <div className="input-icon right">
                                    <i className="fa fa-search"></i>
                                    <input className="form-control" type="text" placeholder={t("formula group name")} value={this.state.filterText} onChange={this.handleSearchChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <select className="form-control" value={bankerId} onChange={this.handleChangeSelectBanker}>
                                    <option value="all">{t('All')}</option>
                                    {
                                        Object.keys(bankerList).map(id =>
                                            <option className="text-uppercase" key={id} value={id}>
                                                {bankerList[id].name.toUpperCase()}
                                            </option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="portlet-body">
                    <table className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                        <thead>
                            <tr role="row">
                                <th className="caption-subject font-red text-center"> # </th>
                                <th className="caption-subject font-red text-center"><TransComponent i18nKey="formula group name"/></th>
                                <th className="caption-subject font-red text-center"><TransComponent i18nKey="Company"/></th>
                                <th className="caption-subject font-red text-center"><TransComponent i18nKey="Total"/></th>
                                <th className="caption-subject font-red text-center"><TransComponent i18nKey="Edit"/></th>
                                <th className="caption-subject font-red text-center"><TransComponent i18nKey="Delete"/></th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            formulaGroupList.length ?
                                tbody : <tr><td className="text-center" colSpan="20"><TransComponent i18nKey="Data Empty" /></td></tr>
                        }
                        </tbody>
                    </table>
                </div>
                <div>
                    <Modal isOpen={this.state.isOpenDelModal} toggle={() => this.handleCloseModalDel()}>
                        <ModalHeader toggle={() => this.handleCloseModalDel()} className="text-uppercase">
                            <strong>
                                <TransComponent i18nKey="xac nhan"/>
                            </strong>
                        </ModalHeader>
                        <ModalBody>
                            <TransComponent i18nKey="Are you sure want to delete ?"/>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="bg-red font-white" onClick={this.handleDelFormulaGroup}><TransComponent i18nKey="Confirm"/></Button>
                            <Button color="secondary" onClick={() => this.handleCloseModalDel()}><TransComponent i18nKey="Cancel"/></Button>
                        </ModalFooter>
                    </Modal>
                </div>
                <ModalFormEditFormulaGroup onRef={ref => (this.childModalFormEditFormulaGroup = ref)}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        formulaGroupList: _get(state, 'FormulaGroupReducer.formulaGroupList', []),
        bankerList: _get(state, 'FormulaGroupReducer.bankerList', []),
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getFormulaGroup: () => dispatch(getFormulaGroup()),
        delFormulaGroupDetail: params => dispatch(delFormulaGroupDetail(params)),
        delFormulaGroup: params => dispatch(delFormulaGroup(params))
    };
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(FormulaGroupListContainer);