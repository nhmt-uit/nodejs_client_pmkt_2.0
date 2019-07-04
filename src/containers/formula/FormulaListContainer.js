import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { 
    get as _get, 
    sortBy as _sortBy,
    debounce as _debounce
} from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { TransComponent, LoadingComponent } from 'my-components';
import { getFormula } from 'my-actions/formula/FormulaAction';
import { FormulaItemContainer } from 'my-containers/formula';

class FormulaListContainer extends Component {
    static propTypes = {
        banker: PropTypes.object,
        formulaList: PropTypes.array,
    }

    static defaultProps = {
        banker: {},
        formulaList: [],
    }

    constructor(props) {
        super(props);

        this.state = {
            bankerId: 'all',
            keySearch: '',
        };
    }

    componentDidMount() {
        this.props.getFormula();
    }

    handleGetFormula = () => {
        return this.props.getFormula();
    }

    renderBody() {
        const { isFetching } = this.props;

        let { formulaList } = this.props;

        formulaList = this.filterFormula(formulaList);
        formulaList = _sortBy(formulaList, ['giaonhan', 'tenct']);

        if (isFetching) {
            return (
                <tr>
                    <td style={{ height: '100px' }} colSpan={13}><LoadingComponent /></td>
                </tr>
            );
        }

        return formulaList.map((item, index) => 
            <FormulaItemContainer 
                key={index} 
                formula={item} 
                order={index + 1}
                onGetFormula={this.handleGetFormula}
            />
        );
    }

    filterFormula(formulaList) {
        const { keySearch, bankerId } = this.state;

        if (!keySearch && (!bankerId || bankerId === 'all')) {
            return formulaList;
        }

        const bankerFilter = (bankerId && bankerId !== 'all') ? bankerId : '';
        const searchFilter = keySearch || '';

        return formulaList.filter(item => {
            const tenct = item.tenct ? item.tenct.toLowerCase() : '';
            
            let flagBanker = true;
            let flagSearch = true;

            if (bankerFilter && bankerFilter !== (item.banker_id || '')) {
                flagBanker = false;
            }

            if (searchFilter && tenct.indexOf(searchFilter.toLowerCase()) === -1) {
                flagSearch = false;
            }

            return flagBanker && flagSearch;
        });
    }

    handleChangeSelectBanker = e => {
        this.setState({
            bankerId: e.target.value
        });
    }

    handleSearch = _debounce(key => {
        this.setState({ keySearch: key });
    }, 300);

    render() {
        const { banker } = this.props;
        const { bankerId } = this.state;

        return (
            <div className="portlet box blue-hoki">
                <div className="portlet-title">
                    <div className="caption bold uppercase font-size-15"><TransComponent i18nKey="Formula list" /></div>
                    <div className="actions">
                        <div className="form-inline">
                            <div className="form-group">
                                <label className="sr-only">formula name</label>
                                <div className="input-icon right">
                                    <i className="fa fa-search"></i>
                                    <input className="form-control" onChange={e => this.handleSearch(e.target.value)} placeholder={this.props.t('Formula name')} type="text" />
                                </div>
                            </div>
                            <div className="form-group">
                                <select className="form-control" value={bankerId} onChange={this.handleChangeSelectBanker}>
                                    <option value="all">{this.props.t('ALL')}</option>
                                    {
                                        Object.keys(banker).map(id => 
                                            <option className="text-uppercase" key={id} value={id}>
                                                {banker[id].toUpperCase()}
                                            </option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="portlet-body">
                    <table className="table table-hover table-formula">
                        <thead>
                            <tr>
                                <th rowSpan={2}>#</th>
                                <th rowSpan={2}>
                                    <TransComponent i18nKey={'Formula name'}/>
                                </th>
                                <th rowSpan={2}><TransComponent i18nKey="Book" /></th>
                                <th rowSpan={2}><TransComponent i18nKey={'Company'}/></th>
                                <th rowSpan={2}><TransComponent i18nKey={'Currency'}/></th>
                                <th rowSpan={2}><TransComponent
                                    i18nKey={'Pay'}/>/<TransComponent i18nKey={'Receive'}/></th>
                                <th colSpan={"3"} className="text-center"><TransComponent i18nKey={'Info'}/></th>
                                <th rowSpan={2}><TransComponent i18nKey={'Total used account'}/></th>
                                <th rowSpan={2}><TransComponent i18nKey={'Relink Formula'}/></th>
                                <th rowSpan={2}><TransComponent i18nKey={'Edit'}/></th>
                                <th rowSpan={2} className="text-center"><TransComponent i18nKey={'Delete'}/></th>
                            </tr>
                            <tr>
                                <th className="text-center"><TransComponent i18nKey={'Type name'}/></th>
                                <th className="text-center" colSpan={"2"}><TransComponent i18nKey={'Value'}/></th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.renderBody() }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        banker: _get(state, 'FormulaReducer.banker', {}),
        formulaList: _get(state, 'FormulaReducer.List', []),
        isFetching: _get(state, 'FormulaReducer.isFetching', false),
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getFormula: () => dispatch(getFormula()),
    };
}

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(FormulaListContainer);