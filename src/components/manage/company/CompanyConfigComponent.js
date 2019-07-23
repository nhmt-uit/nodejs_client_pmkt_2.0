import React, {Component} from 'react'
import {Button, Input} from "reactstrap";
import {TransComponent} from 'my-components'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";

import { getCompanyConfig, saveCompanyConfig, resetFormSaveResponse } from 'my-actions/manage/ConfigurationAction';

class CompanyConfigComponent extends Component{
    constructor(props) {
        super(props);
        this.state = {
            company: this.props.company,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.company) {
            this.setState({company: nextProps.company})
        }
    }

    handleSaveData = () => e => {
        const { company } = this.state;
        var data = [], post;
        company.forEach( item => {
            if(item.checked === false){
                data.push(item.id)
            }
        })
        this.props.saveCompanyConfig({'excluded_banker': JSON.stringify(data)})
            .then( () => {
                this.props.getCompanyConfig()
            })
    }

    handleCheckAll = () => e => {
        const { company } = this.state;
        var checked = e.target.checked
        company.forEach( items =>{
            items.checked = checked
        })
        this.setState({
            company: company,
        })
    }

    handleCheck = item => e => {
        const { company } = this.state;
        var checked = e.target.checked
        // let companyById = keyBy(company, 'id');
        company.forEach( items => {
            if(items.id === item.id){
                items.checked = checked
            }
        })
        this.setState({
            company: company,
        })
    }

    renderAlert = _ => {
        const { saveStatus } = this.props
        if(saveStatus === false) {
            setTimeout(()=>{
                this.props.resetFormSaveResponse();
            }, 3000);
            return (
                <div className="alert alert-danger">
                    <button className="close" onClick={this.props.resetFormSaveResponse}/>
                    <span><b> <TransComponent i18nKey="Failure!"/> </b></span>
                </div>
            )
        } else if(saveStatus === true) {
            setTimeout(()=>{
                this.props.resetFormSaveResponse();
            }, 3000);
            return (
                <div className="alert bg-success">
                    <button className="close" onClick={this.props.resetFormSaveResponse}/>
                    <span><b> <TransComponent i18nKey="Successfull!"/> </b></span>
                </div>
            )
        }
        return null
    }

    render() {
        const { company } = this.state;
        var tbody;
        var checkAll = true;
        if(company){
            tbody = company.map( (item) => {
                if (checkAll && !item.checked) {
                    checkAll = false;
                }
                var url = item.logo.replace(".", "")
                return(
                    <tr key={item.id} role="row" className="odd">
                        <td className="text-center">
                            <label className="mt-checkbox mt-checkbox-outline">&nbsp;
                                <Input type="checkbox" name={item.id} onChange={this.handleCheck(item)} checked={item.checked || false}/>
                                <span></span>
                            </label>
                        </td>
                        <td className="text-center font-dark uppercase"><img src={"/assets" + url} alt={item.name} style={{height:35, width:90}} /></td>
                        <td className="font-dark uppercase"> {item.short_name} </td>
                        <td className="font-dark uppercase"> {item.book_name} </td>
                        <td>
                            {
                                item.agent_url.map(items => {
                                    return(
                                        <div key={'item_url'+items}>
                                            <a href={items} target="_blank" rel="noopener noreferrer"> {items} </a>
                                        </div>
                                    )
                                })
                            }
                        </td>
                        <td> <a href={item.member_url} target="_blank" rel="noopener noreferrer"> {item.member_url} </a> </td>
                    </tr>
                )
            })
        }

        return(
            <>
                {this.renderAlert()}
                <div className="btn-group-top text-right">
                    <Button color="success" onClick={this.handleSaveData()}><TransComponent i18nKey="Save"/></Button>
                </div>
                
                <div className="table-responsive">
                    <table className="table table-striped table-hover dataTable no-footer dtr-inline">
                        <thead>
                        <tr>
                            <th className="text-center">
                                <label className="mt-checkbox mt-checkbox-outline">&nbsp;
                                    <Input type="checkbox" onChange={this.handleCheckAll()} checked={checkAll}/>
                                    <span></span>
                                </label>
                            </th>
                            <th className="caption-subject font-red text-center"><TransComponent i18nKey="Company"/></th>
                            <th className="caption-subject font-red"><TransComponent i18nKey="Viết tắt"/></th>
                            <th className="caption-subject font-red"><TransComponent i18nKey="Nhóm"/></th>
                            <th className="caption-subject font-red"><TransComponent i18nKey="Trang quản lý"/></th>
                            <th className="caption-subject font-red"><TransComponent i18nKey="Trang thành viên"/></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {tbody}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        saveStatus: state.ConfigurationReducer.saveStatus,
};
};

const mapDispatchToProps = dispatch => {
    return {
        getCompanyConfig: () => dispatch(getCompanyConfig()),
        saveCompanyConfig: (params) => dispatch(saveCompanyConfig(params)),
        resetFormSaveResponse: params => dispatch(resetFormSaveResponse(params)),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)
(CompanyConfigComponent)