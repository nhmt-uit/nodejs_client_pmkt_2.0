import React, { Component } from 'react'
import { compose } from 'redux'
import { withTranslation } from 'react-i18next'
import { Table, Input, Button, Alert } from 'reactstrap';
import { saveCurrencyConfig } from 'my-actions/manage/ConfigurationAction';
import {connect} from "react-redux";

class ListCurrencyComponent extends Component {
    constructor (props) {
        super(props);
        this.state = {
            _error: false,
            currencyList: this.props.currencyList,
            listCheck: []
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
                break;
            case 0:
                return 'X';
                break;
            case 1:
                return '0.X';
                break;
            case 2:
                return '0.0X';
                break;
        }
    }

    handleSave () {
        let isOk = window.confirm("Are you sure ?");
        if (isOk) {
            var post = [];
            this.state.currencyList.forEach(function (item) {
                if (item.checked) {
                    post.push({name: item.name, id: item.id})
                }
            });
            console.log('Save data...', post);
            this.props.saveCurrencyConfig({data: JSON.stringify(post)});
            //Action.save({data: JSON.stringify(post)})
        }
    }

    handleCheckAll (e) {
        let data = this.state.currencyList;
        if(!e.target.checked) {
            let checked = e.target.checked;
            let isOk = window.confirm("Ban co chac chan khong muon su dung bat ky loai tien nao? Viec bo chon nay se xoa tat ca cac cong thuc");
            if (isOk) {
                for (let key in data) {
                    if (!data.hasOwnProperty(key)) continue;
                    data[key].checked = checked;
                }
            }
        }else{
            for (let key in data) {
                if (!data.hasOwnProperty(key)) continue;
                data[key].checked = e.target.checked;
            }
        }
        this.setState({currencyList: data});
    }

    getIndexCurrencyListById (id) {
        for (let key in this.state.currencyList) {
            if (this.state.currencyList[key]._id == id) {
                return key;
            }
        }
        return -1;
    }

    handleCheck = item => e => {
        let idx = this.getIndexCurrencyListById(item._id);
        if (idx == -1) {
            this.setState({_error: true})
            return;
        }
        let total = item.total ?  item.total : 0;
        let checked =  e.target.checked;
        let data = this.state.currencyList;
        if(total > 0 && !checked) {
            let name = item.name;
            let isOk = window.confirm('Ban co chac chan muon xoa loai tien ' + name + '. Viec xoa nay se xoa toan bo cong thuc su dung loai tien nay va khong the phuc hoi.');
            if (isOk) {
                data[idx].checked = checked;
            }
        }else{
            data[idx].checked = e.target.checked;
        }
        this.setState({currencyList: data});
    }

    render() {
        let xhtml = null;
        let checkAll = true;
        const { t } = this.props;
        if (this.state.currencyList) {
            xhtml = this.state.currencyList.map((item, idx) => {
                        if (checkAll && !item.checked) {
                            checkAll = false;
                        }
                        return (
                            <tr key={idx}>
                                <td><Input type="checkbox" name={item._id} onChange={this.handleCheck(item)} checked={item.checked || false}/></td>
                                <td>{item.name}</td>
                                <td>{item.total}</td>
                                <td>{this.typeRound(item.filter)}</td>
                                <td>Edit</td>
                            </tr>
                        )
                    })
        }
        return (
            <div>
                <div className="btn-group-top text-right">
                    <Button color="success" onClick={this.handleSave.bind(this)}>{t('Save')}</Button>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <th><Input type="checkbox" onChange={this.handleCheckAll.bind(this)} checked={checkAll}/></th>
                            <th className={"user_fn"}>{t('Name')}</th>
                            <th className={"user_un"}>{t('Num formula')}</th>
                            <th className={"user_sts"}>{t('Round')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {xhtml}
                    </tbody>
                </Table>
            </div>
        );

    }
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        saveCurrencyConfig: (post) => dispatch(saveCurrencyConfig(post))
    };
};


export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(ListCurrencyComponent)