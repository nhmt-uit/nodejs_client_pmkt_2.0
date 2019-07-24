import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import moment  from 'moment'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import MultiSelect from "@khanacademy/react-multi-select";
import { join, filter, isEmpty as _isEmpty, map as _map, isEqual as _isEqual } from 'lodash'


import { AppConfig } from 'my-constants'
import BootstrapInputIcon from 'my-utils/components/date-picker/BootstrapInputIcon'
import { FormScanGroupDateComponent, FormScanFlagTypeComponent } from 'my-components/accountant'
import { checkBankerAccount, resetWhenChangeDate } from 'my-actions/AccountantAction';
import { TransComponent } from 'my-components'
import { AccountantFormScanButtonContainer, AccountantFormButtonFullScreenContainer } from 'my-containers/accountant'


const today = moment().format('YYYY-MM-DD')
const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
const start_this_week = moment().startOf('week').add(1, 'days').format('YYYY-MM-DD')
const end_this_week = moment().endOf('week').add(1, 'days').format('YYYY-MM-DD')
const start_last_week = moment().startOf('week').subtract(6, 'days').format('YYYY-MM-DD')
const end_last_week = moment().endOf('week').subtract(6, 'days').format('YYYY-MM-DD')

class AccountantFormScanContainer extends Component {
    state = {
        flagType: 0,
        accountRole: 0,
        typeGroupDate: 'today',
        from_date: new Date(),
        to_date: new Date()
    }

    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.member, this.props.member)
            || !_isEqual(newProps.isProcessing, this.props.isProcessing)
            || !_isEqual(newState.typeGroupDate, this.state.typeGroupDate)
            || !_isEqual(newState.from_date, this.state.from_date)
            || !_isEqual(newState.typeGroupDate, this.state.typeGroupDate)
            || !_isEqual(newState.to_date, this.state.to_date)
            || !_isEqual(newState.flagType, this.state.flagType)
            || !_isEqual(newState.accountRole, this.state.accountRole)
            )
            return true
        return false;
    }

    componentDidMount() {
        Array.from(document.getElementsByClassName('multi-select')).forEach((el) => {
            el.getElementsByClassName('dropdown')[0].removeAttribute('tabindex');
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Handle date picker change from_date
    |--------------------------------------------------------------------------
    */
    onChangeDateFrom = date  => {
        this.setState({from_date: date})
        setTimeout(_ => {
            this.checkDateToSelectGroupDate()
        }, 200)
    }

    /*
    |--------------------------------------------------------------------------
    | Handle date picker change to_date
    |--------------------------------------------------------------------------
    */
    onChangeDateTo = date  => {
        this.setState({to_date: date})
        setTimeout(_ => {
            this.checkDateToSelectGroupDate()
        }, 200)
    }

    /*
    |--------------------------------------------------------------------------
    | Generate to_date & from_date when change radio date type
    |--------------------------------------------------------------------------
    */
    checkDateToSelectGroupDate() {
        let date_form = moment(this.state.from_date).format('YYYY-MM-DD')
        let to_date = moment(this.state.to_date).format('YYYY-MM-DD')
        this.setState({typeGroupDate: null})
        if (date_form === to_date) {
            if (date_form === today) {
                this.setState({typeGroupDate: 'today'})
            }
            if (date_form === yesterday) {
                this.setState({typeGroupDate: 'yesterday'})
            }
        } else {
            if (start_this_week === date_form && end_this_week === to_date) {
                this.setState({typeGroupDate: 'this_week'})
            }
            if (start_last_week === date_form && end_last_week === to_date) {
                this.setState({typeGroupDate: 'last_week'})
            }
        }

        // Reset data banker account
        this.props.resetWhenChangeDate()
    }

    /*
    |--------------------------------------------------------------------------
    | Handle change radio date type
    |--------------------------------------------------------------------------
    */
    changeGroupDate = type => {
        // Reset data banker account
        this.props.resetWhenChangeDate()

        this.setState({typeGroupDate: type})
        switch (type) {
            case 'today':
                this.setState({from_date: new Date(today), to_date: new Date(today)})
            break
            case 'yesterday':
                this.setState({from_date: new Date(yesterday), to_date: new Date(yesterday)})
            break
            case 'this_week':
                this.setState({from_date: new Date(start_this_week), to_date: new Date(end_this_week)})
            break
            case 'last_week':
                this.setState({from_date: new Date(start_last_week), to_date: new Date(end_last_week)})
            break
            default:break
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Handle change radio account_role **** accountant-manual
    |--------------------------------------------------------------------------
    */
    changeAccountRole = type => {
        
        // Reset data banker account
        this.props.resetWhenChangeDate()
        
        this.setState({accountRole: type})
    }

    /*
    |--------------------------------------------------------------------------
    | Handle change radio flag_type **** accountant-manual
    |--------------------------------------------------------------------------
    */
    changeFlagType = type => {
        
        // Reset data banker account
        this.props.resetWhenChangeDate()
        this.setState({flagType: type})
    }

    renderOption = ({ checked, option, onClick }) => (
        <label className="mt-checkbox uppercase">
            <input type="checkbox" checked={checked} onChange={onClick} /> {option.label}
            <span></span>
        </label>
    )
    
    renderValue = (selected, options) => {
        let label = 'Select member'
        if (selected.length) {
            let labels = []
            for (let x in selected) {
                let check = filter(options, ['value', selected[x]]);
                labels.push(check[0].label)
            }
            label = join(labels, ", ")
        }
        return <span className="uppercase" style={{'color': 'ccc'}}><TransComponent i18nKey={label}/></span>
    }

    handleSelectMember = selected => {
        this.props.checkBankerAccount("member", {memberId: selected})
    }

    /*
    |--------------------------------------------------------------------------
    | Filter list member checked = true
    |--------------------------------------------------------------------------
    */
    handleIsCheckMember = _ => {
        const isCheckMember = this.props.member.filter(item => item.checked)
        return _map(isCheckMember, 'id')
    }

    /*
    |--------------------------------------------------------------------------
    | Custom filter react-multiple-select
    |--------------------------------------------------------------------------
    */
    filterSearch = (options, filter) => {
        if (!filter) return options
        return options.filter(item => {
            let label = item.label.toLowerCase()
            filter = filter.toLowerCase()
            if(label.search(filter) !== -1) return item
        })
    }

    render() {
        const { from_date, to_date, typeGroupDate, flagType, accountRole } = this.state
        const selectChecked = this.handleIsCheckMember()
        const bankerName = this.props.match.params.bankerName

        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo">
                        <span className="caption-subject bold uppercase">
                            {_isEmpty(bankerName) ? <TransComponent i18nKey="Accountant" /> : (<> <TransComponent i18nKey="Accountant Manual" /> {bankerName} </> ) }
                        </span>
                    </div>
                    <div className="actions">
                        <AccountantFormButtonFullScreenContainer />
                    </div>
                </div>
                <div className="portlet-body form">
                    <form className="form-inline row">
                        <div className="col-md-3">
                            { !_isEmpty(bankerName) ? <FormScanFlagTypeComponent changeAccountRole={this.changeAccountRole} accountRole={accountRole} changeFlagType={this.changeFlagType} flagType={flagType} bankerName={bankerName} disabled={this.props.isProcessing} /> : null }
                        </div>
                        <div className="col-md-9">
                            <div className="form-group input-xlarge">
                                <MultiSelect
                                    options={this.props.member}
                                    selected={selectChecked}
                                    onSelectedChanged={this.handleSelectMember}
                                    ItemRenderer={this.renderOption}
                                    valueRenderer={this.renderValue}
                                    filterOptions={this.filterSearch}
                                    disabled={this.props.isProcessing}
                                    />
                            </div>
                            <div className="clearfix"></div>
                            <FormScanGroupDateComponent changeGroupDate={this.changeGroupDate} typeGroupDate={typeGroupDate} disabled={this.props.isProcessing} />
                            <div className="clearfix"></div>
                            <div className="form-group">
                                <DatePicker customInput={<BootstrapInputIcon />}
                                    name="from_date"
                                    onChange={this.onChangeDateFrom} selected={from_date}
                                    dateFormat={AppConfig.FORMAT_DATE_DATEPICKER}
                                    disabled={this.props.isProcessing} />
                                
                            </div>
                            <div className="form-group">
                                <DatePicker customInput={<BootstrapInputIcon />}
                                    name="from_date"
                                    onChange={this.onChangeDateTo} selected={to_date}
                                    dateFormat={AppConfig.FORMAT_DATE_DATEPICKER}
                                    disabled={this.props.isProcessing}  />
                            </div>
                            <AccountantFormScanButtonContainer from_date={this.state.from_date} to_date={this.state.to_date} accountRole={accountRole} flagType={flagType} />
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        member : state.AccountantReducer.member,
        isProcessing : state.AccountantReducer.isProcessing,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkBankerAccount: (type_check, params) => {dispatch(checkBankerAccount(type_check, params))},
        resetWhenChangeDate: _ => {dispatch(resetWhenChangeDate())},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountantFormScanContainer));

