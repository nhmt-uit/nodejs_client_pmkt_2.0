import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import moment  from 'moment'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import MultiSelect from "@khanacademy/react-multi-select";
import { join, filter } from 'lodash'


import { AppConfig } from 'my-constants'
import BootstrapInputIcon from 'my-utils/components/date-picker/BootstrapInputIcon'
import { FormScanButtonComponent, FormScanGroupDateComponent } from 'my-components/accountant'
import EventsService from 'my-utils/core/EventsService'
import { socketInitData } from 'my-actions/AccountantAction';
import { Helpers } from 'my-utils';


const today = moment().format('YYYY-MM-DD')
const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
const start_this_week = moment().startOf('week').add(1, 'days').format('YYYY-MM-DD')
const end_this_week = moment().endOf('week').add(1, 'days').format('YYYY-MM-DD')
const start_last_week = moment().startOf('week').subtract(6, 'days').format('YYYY-MM-DD')
const end_last_week = moment().endOf('week').subtract(6, 'days').format('YYYY-MM-DD')

class AccountantFormScanContainer extends Component {
    state = {
        selectedMember: [],
        typeGroupDate: 'today',
        date_from: new Date(),
        date_to: new Date()
    }

    componentDidMount() {
        Array.from(document.getElementsByClassName('multi-select')).forEach((el) => {
            el.getElementsByClassName('dropdown')[0].removeAttribute('tabindex');
        });
        this.props.socketInitData()
    }

    /*
    |--------------------------------------------------------------------------
    | Handle date picker change date_from
    |--------------------------------------------------------------------------
    */
    onChangeDateFrom = date  => {
        this.setState({date_from: date})
        setTimeout(_ => {
            this.checkDateToSelectGroupDate()
        }, 200)
    }

    /*
    |--------------------------------------------------------------------------
    | Handle date picker change date_to
    |--------------------------------------------------------------------------
    */
    onChangeDateTo = date  => {
        this.setState({date_to: date})
        setTimeout(_ => {
            this.checkDateToSelectGroupDate()
        }, 200)
    }

    componentWillUnmount() {
        EventsService.removeAllListeners('hello')
        EventsService.removeAllListeners('hello-world')
    }

    /*
    |--------------------------------------------------------------------------
    | Generate date_to & date_from when change radio date type
    |--------------------------------------------------------------------------
    */
    checkDateToSelectGroupDate() {
        let date_form = moment(this.state.date_from).format('YYYY-MM-DD')
        let date_to = moment(this.state.date_to).format('YYYY-MM-DD')
        this.setState({typeGroupDate: null})
        if (date_form === date_to) {
            if (date_form === today) {
                this.setState({typeGroupDate: 'today'})
            }
            if (date_form === yesterday) {
                this.setState({typeGroupDate: 'yesterday'})
            }
        } else {
            if (start_this_week === date_form && end_this_week === date_to) {
                this.setState({typeGroupDate: 'this_week'})
            }
            if (start_last_week === date_form && end_last_week === date_to) {
                this.setState({typeGroupDate: 'last_week'})
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Handle change radio date type
    |--------------------------------------------------------------------------
    */
    changeGroupDate = type => {
        this.setState({typeGroupDate: type})
        switch (type) {
            case 'today':
                this.setState({date_from: new Date(today), date_to: new Date(today)})
            break
            case 'yesterday':
                this.setState({date_from: new Date(yesterday), date_to: new Date(yesterday)})
            break
            case 'this_week':
                this.setState({date_from: new Date(start_this_week), date_to: new Date(end_this_week)})
            break
            case 'last_week':
                this.setState({date_from: new Date(start_last_week), date_to: new Date(end_last_week)})
            break
            default:break
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Detect when component update
    | Display loading when init data
    |--------------------------------------------------------------------------
    */
    componentDidUpdate = _ => {
        const full_payload = this.props.accountant_full_payload, request_type = this.props.accountant_request_type
        if(request_type === "accountant_init" && full_payload.type === "notify" && full_payload.message === "init_data") {
            Helpers.showLoading();
        } else {
            Helpers.hideLoading();
        }
    }

    renderOption = ({ checked, option, onClick }) => (
        <label className="mt-checkbox uppercase">
            <input type="checkbox" checked={checked} onChange={onClick} /> {option.label}
            <span></span>
        </label>
    )
    
    renderValue = (selected, options) => {
        let label = 'Select the member'
        if (selected.length) {
            let labels = []
            for (let x in selected) {
                let check = filter(options, ['value', selected[x]]);
                labels.push(check[0].label)
            }
            label = join(labels, ", ")
        }
        return <span className="uppercase" style={{'color': 'ccc'}}>{label}</span>
    }

    render() {
        const { t } = this.props
        let memberOptions = (this.props.accountant_payload) ? this.props.accountant_payload.memberOptionsProcessed : []
        const { selectedMember, date_from, date_to, typeGroupDate } = this.state

        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo"><span className="caption-subject bold uppercase">{t("Accountant")}</span></div>
                    <div className="tools"><a href="#/" className="collapse"> </a></div>
                </div>
                <div className="portlet-body form">
                    <form className="form-inline">
                        
                        <div className="form-group input-large"></div>
                        <FormScanGroupDateComponent changeGroupDate={this.changeGroupDate} typeGroupDate={typeGroupDate} />

                        <div className="clearfix"></div>
                        <div className="form-group input-large">
                            <MultiSelect
                                options={memberOptions}
                                selected={selectedMember}
                                onSelectedChanged={selectedMember => this.setState({selectedMember})}
                                ItemRenderer={this.renderOption}
                                valueRenderer={this.renderValue}
                                />
                        </div>
                        <div className="form-group">
                            <DatePicker customInput={<BootstrapInputIcon />}
                                name="date_from"
                                onChange={this.onChangeDateFrom} selected={date_from}
                                dateFormat={AppConfig.FORMAT_DATE_DATEPICKER} />
                            
                        </div>
                        <div className="form-group">
                            <DatePicker customInput={<BootstrapInputIcon />}
                                name="date_from"
                                onChange={this.onChangeDateTo} selected={date_to}
                                dateFormat={AppConfig.FORMAT_DATE_DATEPICKER} />
                        </div>
                        <FormScanButtonComponent />
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        accountant_request_type : state.AccountantReducer.request_type,
        accountant_full_payload : state.AccountantReducer.full_payload,
        accountant_payload : state.AccountantReducer.payload,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        socketInitData: params => {dispatch(socketInitData(params))},
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(AccountantFormScanContainer);

