import React, {Component} from 'react'
import { TransComponent } from 'my-components';
import {get as _get} from "lodash";
import {compose} from "redux/es/redux";
import {connect} from "react-redux";

import {withTranslation} from "react-i18next";
import { getFormulaGroup } from 'my-actions/formula-group/FormulaGroupAction';

class FormulaGroupListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            bankerId: 'ALL',
        }
    }

    componentWillMount() {
        this.props.getFormulaGroup()
    }

    handleSearchChange = (e) => {
        this.setState({
            filterText: e.target.value
        })
    }

    handleChangeSelectBanker = (e) => {
        this.setState({
            bankerId: e.target.value
        })
    }

    render() {
        const { t } = this.props;
        const { formulaGroupList, bankerList } = this.props;
        const { bankerId, filterText } = this.state;
        var formulaGroupListDetail = [];
        return(
            <div className="portlet box blue-hoki position-relative">
                <div className="portlet-title">
                    <div className="caption bold uppercase font-size-15"><TransComponent i18nKey="formula group list" /></div>
                    <div className="actions">
                        <div className="form-inline">
                            <div className="form-group">
                                <div className="input-icon right">
                                    <i className="fa fa-search"></i>
                                    <input className="form-control" type="text" placeholder="formula group name" value={this.state.filterText} onChange={this.handleSearchChange}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <select className="form-control" value={bankerId} onChange={this.handleChangeSelectBanker}>
                                    <option value="all"> ALL </option>
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
                                <th className="caption-subject font-red text-center"> {t("formula group name")} </th>
                                <th className="caption-subject font-red text-center"> {t("Company")} </th>
                                <th className="caption-subject font-red text-center"> {t("Total")} </th>
                                <th className="caption-subject font-red text-center"> {t("Edit")} </th>
                                <th className="caption-subject font-red text-center"> {t("Delete")} </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            formulaGroupList.map(function (item, index) {
                                if(item.name.toUpperCase().indexOf(filterText.toUpperCase()) > -1){
                                    return (
                                        <tr key={index}>
                                            <td className="text-center"> {index + 1} </td>
                                            <td className="text-center uppercase"> {item.name} </td>
                                            <td className="text-center"></td>
                                            <td className="text-center"> {item.num_of_formula} </td>
                                            <td className="text-center">
                                                <button className="text-success btn btn-link"><i
                                                    className="fa fa-edit"></i></button>
                                            </td>
                                            <td className="text-center">
                                                <button className="text-success btn btn-link font-red"><i
                                                    className="fa fa-close"></i></button>
                                            </td>
                                        </tr>
                                    )
                                }
                            })
                        }
                        </tbody>
                    </table>
                </div>
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
    };
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(FormulaGroupListContainer);