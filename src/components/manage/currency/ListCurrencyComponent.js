import React, { Component } from 'react'
import { compose } from 'redux'
import { withTranslation } from 'react-i18next'
import {Table, Input, Button, ModalHeader, ModalBody, ModalFooter, Modal} from 'reactstrap';
import { saveCurrencyConfig, getCurrencyConfig } from 'my-actions/manage/ConfigurationAction';
import { EditForm } from 'my-components/manage';
import {connect} from "react-redux";
import {TransComponent} from 'my-components'

class ListCurrencyComponent extends Component {
    constructor (props) {
        super(props);
        this.state = {
            _error: false,
            currencyList: this.props.currencyList,
            listCheck: [],
            isOpen: false,
            itemSelected: {},

            isOpenModalConfirm: false,
            message: '',
            checkAll: false,
            onSave: false,
            item: '',
        };
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.currencyList) {
            this.setState({currencyList: nextProps.currencyList})
        }
    }

    typeRound (value) {
        switch (value) {
            case -1:
                return 'X0';
            case 0:
                return 'X';
            case 1:
                return '0.X';
            case 2:
                return '0.0X';
            default: break;
        }
    }

    toggleCloseModalConfirm = () => {
        this.setState({
            isOpenModalConfirm: false,
            message: '',
            checkAll: false,
            onSave: false,
            item: '',
        })
    }

    getIndexCurrencyListById (id) {
        for (let key in this.state.currencyList) {
            if (this.state.currencyList[key]._id == id) {
                return key;
            }
        }
        return -1;
    }

    handleConfirmModal = () => {
        var {checkAll, item, onSave} = this.state
        let idx = this.getIndexCurrencyListById(item._id);
        let data = this.state.currencyList;
        if(checkAll){
            console.log(item.checked)
            for (let key in data) {
                if (!data.hasOwnProperty(key)) continue;
                data[key].checked = false;
            }
        } else if(onSave){
            var post = [];
            this.state.currencyList.forEach(function (item) {
                if (item.checked) {
                    post.push({name: item.name, id: item.id})
                }
            });
            this.props.saveCurrencyConfig({data: JSON.stringify(post)})
                .then( () => {
                    this.props.getCurrencyConfig()
                })
        } else {
            data[idx].checked = !item.checked;
        }
        this.toggleCloseModalConfirm();
    }

    handleSave () {
        this.setState({
            isOpenModalConfirm: true,
            message: 'Are you sure ?',
            onSave: true,
        })
    }

    handleCheck = item => e => {
        let idx = this.getIndexCurrencyListById(item._id);
        if (idx === -1) {
            this.setState({_error: true})
            return;
        }
        let total = item.total ?  item.total : 0;
        let checked =  e.target.checked;
        let data = this.state.currencyList;
        if(total > 0 && !checked) {
            this.setState({
                isOpenModalConfirm: true,
                message: 'Ban co chac chan muon xoa loai tien ' + item.name + '. Viec xoa nay se xoa toan bo cong thuc su dung loai tien nay va khong the phuc hoi.',
                checkAll: false,
                item: item
            })
        }else{
            data[idx].checked = e.target.checked;
        }
        this.setState({currencyList: data});
    }

    handleCheckAll (e) {
        let data = this.state.currencyList;
        if(!e.target.checked) {
            this.setState({
                isOpenModalConfirm: true,
                message: 'Ban co chac chan khong muon su dung bat ky loai tien nao? Viec bo chon nay se xoa tat ca cac cong thuc',
                checkAll: true,
            })
        }else{
            for (let key in data) {
                if (!data.hasOwnProperty(key)) continue;
                data[key].checked = e.target.checked;
            }
        }
        this.setState({currencyList: data});
    }

    showHideForm = (item, show) => () => {
        this.setState({isOpen: show, itemSelected: item})
    }

    render() {
        let xhtml = null;
        let checkAll = true;
        const { t } = this.props;
        if (this.state.currencyList) {
            xhtml = this.state.currencyList.map((item, idx) => {
<<<<<<< HEAD
                        if (checkAll && !item.checked) {
                            checkAll = false;
                        }
                        return (
                            <tr key={idx}>
                                <td>
                                    <label className="mt-checkbox mt-checkbox-outline">&nbsp;
                                        <Input type="checkbox" name={item._id} onChange={this.handleCheck(item)} checked={item.checked || false}/>
                                        <span></span>
                                    </label>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.total}</td>
                                <td>{this.typeRound(item.filter)}</td>
                                <td><a href="#/" onClick={this.showHideForm(item, true)}><i className="pointer fa fa-edit"></i></a></td>
                            </tr>
                        )
                    })
=======
                if (checkAll && !item.checked) {
                    checkAll = false;
                }
                return (
                    <tr key={idx}>
                        <td>
                            <label className="mt-checkbox mt-checkbox-outline">&nbsp;
                                <Input type="checkbox" name={item._id} onChange={this.handleCheck(item)} checked={item.checked || false}/>
                                <span></span>
                            </label>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.total}</td>
                        <td>{this.typeRound(item.filter)}</td>
                        <td><a onClick={this.showHideForm(item, true)}><i className="pointer fa fa-edit"></i></a></td>
                    </tr>
                )
            })
>>>>>>> 5e6bd0161a7b943bbca2d610d54df588758af433
        }
        return (
            <>
                <div className="btn-group-top text-right">
                    <Button color="success" onClick={this.handleSave.bind(this)}>{t('Save')}</Button>
                </div>
                <div className="table-responsive">
                    <Table>
                        <thead>
                            <tr>
                                <th>
                                    <label className="mt-checkbox mt-checkbox-outline">&nbsp;
                                        <Input type="checkbox" onChange={this.handleCheckAll.bind(this)} checked={checkAll}/>
                                        <span></span>
                                    </label>
                                </th>
                                <th className={"caption-subject font-red"}>{t('Name')}</th>
                                <th className={"caption-subject font-red"}>{t('Số công thức')}</th>
                                <th className={"caption-subject font-red"}>{t('Round')}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {xhtml}
                        </tbody>
                    </Table>
                </div>
                <EditForm isOpen={this.state.isOpen} showHideForm={this.showHideForm} item={this.state.itemSelected}/>
                <Modal isOpen={this.state.isOpenModalConfirm} toggle={() => this.toggleCloseModalConfirm()}>
                    <ModalHeader toggle={() => this.toggleCloseModalConfirm()} className="text-uppercase">
                        <strong>
                            <TransComponent i18nKey="xac nhan"/>
                        </strong>
                    </ModalHeader>
                    <ModalBody>
                        <TransComponent i18nKey={this.state.message}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button className="bg-red font-white" onClick={this.handleConfirmModal}><TransComponent i18nKey="Confirm"/></Button>
                        <Button color="secondary" onClick={() => this.toggleCloseModalConfirm()}><TransComponent i18nKey="Cancel"/></Button>
                    </ModalFooter>
                </Modal>
            </>
        );

    }
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveCurrencyConfig: (post) => dispatch(saveCurrencyConfig(post)),
        getCurrencyConfig: () => dispatch(getCurrencyConfig()),
    };
};


export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(ListCurrencyComponent)