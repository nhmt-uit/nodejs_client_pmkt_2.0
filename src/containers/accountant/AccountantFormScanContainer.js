import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import moment  from 'moment'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import MultiSelect from "@khanacademy/react-multi-select";
import { join, filter, isEmpty as _isEmpty, map as _map } from 'lodash'
import { withRouter } from 'react-router-dom';


import { AppConfig } from 'my-constants'
import BootstrapInputIcon from 'my-utils/components/date-picker/BootstrapInputIcon'
import { FormScanButtonComponent, FormScanGroupDateComponent } from 'my-components/accountant'
import EventsService from 'my-utils/core/EventsService'
import { socketInitData, socketScanData, socketStopScanData, socketSaveReport, checkBankerAccount } from 'my-actions/AccountantAction';
import { Helpers } from 'my-utils';
import { SocketService } from 'my-utils/core';
import { RoutesService } from 'my-routes'


const today = moment().format('YYYY-MM-DD')
const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
const start_this_week = moment().startOf('week').add(1, 'days').format('YYYY-MM-DD')
const end_this_week = moment().endOf('week').add(1, 'days').format('YYYY-MM-DD')
const start_last_week = moment().startOf('week').subtract(6, 'days').format('YYYY-MM-DD')
const end_last_week = moment().endOf('week').subtract(6, 'days').format('YYYY-MM-DD')

class AccountantFormScanContainer extends Component {
    state = {
        
        typeGroupDate: 'today',
        from_date: new Date(),
        to_date: new Date()
    }

    componentDidMount() {
        Array.from(document.getElementsByClassName('multi-select')).forEach((el) => {
            el.getElementsByClassName('dropdown')[0].removeAttribute('tabindex');
        });
        this.props.socketInitData()
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
    | Call action to scan data
    |--------------------------------------------------------------------------
    */
    handleRequestScan = _ => {
        let bankerAccountIds = []
        for(let x in this.props.isCheckBankerAccount) {
            if (this.props.isCheckBankerAccount[x] === true) bankerAccountIds.push(x)
        }
        this.props.socketScanData({ids: bankerAccountIds, from_date: this.state.from_date, to_date: this.state.to_date})
    }


    /*
    |--------------------------------------------------------------------------
    | Call action to save report
    |--------------------------------------------------------------------------
    */
    handleSaveReport = _ => {
        const { payloadBankerAccount } = this.props
        let bankerAccount = []
        if(payloadBankerAccount) {
            _map(payloadBankerAccount, item => {
                if (item.type === "resolve" && item.data.reportSave) bankerAccount.push(item)
            })
        }
        this.props.socketSaveReport({payloadBankerAccount: bankerAccount})
        this.props.history.push(RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT'))
    }
    


    handleStopScan = _ => {
        const { payloadBankerAccount } = this.props
        let bankerAccountIds = []
        if(payloadBankerAccount) {
            _map(payloadBankerAccount, item => {
                if (item.type === "notify") bankerAccountIds.push(item.id)
            })
        }
        if (!_isEmpty(bankerAccountIds)) this.props.socketStopScanData({ids: bankerAccountIds})
    }

    /*
    |--------------------------------------------------------------------------
    | Detect when component update
    | Display loading when init data
    |--------------------------------------------------------------------------
    */
    componentDidUpdate = _ => {
        if(!this.props.isSocketInitSuccess) {
            // Helpers.showLoading();
        } else {
            // Helpers.hideLoading();
        }
    }

    checkIsProcessingScan = _ => {
        const { payloadBankerAccount } = this.props
        let isProcessing = false
        let isAllowReport = false
        if(payloadBankerAccount) {
            _map(payloadBankerAccount, item => {
                if (item.type === "notify") isProcessing = true
                if (item.type === "resolve") isAllowReport = true
            })
            if (!isProcessing) SocketService.unListenerResponse()
        }
        return {isProcessing, isAllowReport}
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

    handleSelectMember = selected => {
        // let memberOptions = (this.props.accountant_payload) ? this.props.accountant_payload.memberOptionsProcessed : []
        this.props.checkBankerAccount("member", {memberId: selected})
    }

    handleIsCheckMember = _ => {
        const isCheckMember =  this.props.isCheckMember
        let checked = []
        if (_isEmpty(isCheckMember)) return checked

        for(let x in isCheckMember) {
            if (isCheckMember[x]) checked.push(x)
        }
        return checked
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
        const { t, isSocketInitSuccess } = this.props
        let memberOptions = (this.props.accountant_payload) ? this.props.accountant_payload.memberOptionsProcessed : []

        const { from_date, to_date, typeGroupDate } = this.state
        const selectChecked = this.handleIsCheckMember()
        const {isProcessing, isAllowReport} = this.checkIsProcessingScan()

        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo"><span className="caption-subject bold uppercase">{t("Accountant")}</span></div>
                    <div className="tools"><span className="collapse"> </span></div>
                </div>
                <div className="portlet-body form">
                    <form className="form-inline">
                        <div className="form-group input-xlarge">
                            <div className="mt-radio-inline">
                                <label className="mt-radio">
                                    <input type="radio" name="optionsRadios"  /> {t("All")}
                                    <span></span>
                                </label>
                                <label className="mt-radio">
                                    <input type="radio" name="optionsRadios"  /> {t("SB & CSN & GAMES-XS & RACING & ESB")}
                                    <span></span>
                                </label>
                            </div>
                        </div>
                        <FormScanGroupDateComponent changeGroupDate={this.changeGroupDate} typeGroupDate={typeGroupDate} />

                        <div className="clearfix"></div>
                        <div className="form-group input-xlarge">
                            <MultiSelect
                                options={memberOptions}
                                selected={selectChecked}
                                onSelectedChanged={this.handleSelectMember}
                                ItemRenderer={this.renderOption}
                                valueRenderer={this.renderValue}
                                filterOptions={this.filterSearch}
                                />
                        </div>
                        <div className="form-group">
                            <DatePicker customInput={<BootstrapInputIcon />}
                                name="from_date"
                                onChange={this.onChangeDateFrom} selected={from_date}
                                dateFormat={AppConfig.FORMAT_DATE_DATEPICKER} />
                            
                        </div>
                        <div className="form-group">
                            <DatePicker customInput={<BootstrapInputIcon />}
                                name="from_date"
                                onChange={this.onChangeDateTo} selected={to_date}
                                dateFormat={AppConfig.FORMAT_DATE_DATEPICKER} />
                        </div>
                        <FormScanButtonComponent isSocketInitSuccess={isSocketInitSuccess} socketScanData={this.handleRequestScan} socketSaveReport={this.handleSaveReport} socketStopScanData={this.handleStopScan}  isProcessing={isProcessing} isAllowReport={isAllowReport} />
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isSocketInitSuccess : state.AccountantReducer.isSocketInitSuccess,
        accountant_request_type : state.AccountantReducer.request_type,
        accountant_full_payload : state.AccountantReducer.full_payload,
        accountant_payload : state.AccountantReducer.payload,
        isCheckMember : state.AccountantToggleReducer.isCheckMember || [],
        isCheckBankerAccount : state.AccountantToggleReducer.isCheckBankerAccount,
        payloadBankerAccount : state.AccountantScanReducer.payloadBankerAccount
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        socketInitData: _ => {dispatch(socketInitData())},
        socketScanData: params => {dispatch(socketScanData(params))},
        socketStopScanData: bankerAccount => {dispatch(socketStopScanData(bankerAccount))},
        socketSaveReport: bankerAccount => {dispatch(socketSaveReport(bankerAccount))},
        checkBankerAccount: (type_check, params) => {dispatch(checkBankerAccount(type_check, params))},
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
    withRouter
)(AccountantFormScanContainer);

