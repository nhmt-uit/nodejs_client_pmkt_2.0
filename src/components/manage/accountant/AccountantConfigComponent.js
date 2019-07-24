import React, {Component} from 'react'
import {Button, Input} from "reactstrap";
import {TransComponent} from 'my-components'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import { getAccountantConfig, saveAccountantConfig, resetFormSaveResponse } from 'my-actions/manage/ConfigurationAction';

class AccountantConfigComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountant: this.props.accountant,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.accountant) {
            this.setState({accountant: nextProps.accountant})
        }
    }

    handleSaveAccountant = () => {
        const { accountant } = this.state;
        var data = [];
        accountant.forEach( item => {
            data = data.concat(item.child)
        })
        this.props.saveAccountantConfig({'data': JSON.stringify(data)})
            .then( () => {
                this.props.getAccountantConfig()
            })
    }
    // checkbox check all
    handleCheckAll = () => (e) => {
        const { accountant } = this.state;
        var checked = e.target.checked;
        accountant.forEach( item => {
            item.child.forEach( item_child => {
                item_child.checked = checked;
            })
        })
        this.setState({
            accountant: accountant
        })
    }
    //checkbox checkAllSportbookCasino each Banker
    handleChangeCheckAllSportbookCasino = (item) => e => {
        const { accountant } = this.state;
        var checked = e.target.checked;
        accountant.forEach( item_banker => {
            if(item.banker === item_banker.banker){
                if(item.banker === 'new789'){ // banker new789
                    if(checked === true){
                        item_banker.child.forEach(item_child => {
                            item_child.flag_type = 2
                        })
                    }
                } else {
                    item_banker.child.forEach(item_child => {
                        item_child.flag_type = checked
                    })
                }
            }
        })
        this.setState({
            accountant: accountant
        })
    }
    //checkbox checkCheckAllRadio each Banker
    handleChangeCheckAllRadioAll = (item) => e => {
        const { accountant } = this.state;
        var checked = e.target.checked
        accountant.forEach( item_banker => {
            if(item.banker === item_banker.banker){
                if(item.banker === 'new789'){ // banker new789
                    if(checked === true){
                        item_banker.child.forEach(item_child => {
                            item_child.flag_type = 1
                        })
                    }
                } else {
                    item_banker.child.forEach(item_child => {
                        item_child.flag_type = !checked
                    })
                }
            }
        })
        this.setState({
            accountant: accountant
        })
    }
    // checkbox CheckAllBanker each banker
    handleChangeCheckAllBanker = (item) => e => {
        const { accountant } = this.state;
        var checked = e.target.checked
        accountant.forEach( item_banker => {
            if(item.banker === item_banker.banker){
                item_banker.child.forEach(item_child => {
                    item_child.checked = checked
                })
            }
        })
        this.setState({
            accountant: accountant
        })
    }
    // checkbox each child in banker
    handleCheckType = (item_child) => e => {
        const { accountant } = this.state;
        var type = e.target.value;
        accountant.forEach(( item => {
            if(item.banker === item_child.banker){
                item.child.forEach( child => {
                    if(child.id === item_child.id){
                        if(type === '2'){ // flag_type === 2 // banker new789
                            if(child.flag_type === 2 || child.flag_type === true){
                                child.flag_type = 1
                            } else {
                                child.flag_type = 2
                            }
                        } else {
                            if(child.flag_type === 1 || child.flag_type === true){
                                child.flag_type = false
                            } else {
                                child.flag_type = true
                            }
                        }

                    }
                })
            }
        }))
        this.setState({
            accountant: accountant
        })
    }
    // Radio for each child in banker - All or Sportbook
    handleChangeCheckBoxChild = (item_child) => e => {
        const { accountant } = this.state;
        var checked = e.target.checked;
        accountant.forEach( item => {
            if(item.banker === item_child.banker){
                item.child.forEach( child => {
                    if(child.id === item_child.id){
                        child.checked = checked
                    }
                })
            }
        });
        this.setState({
            accountant: accountant
        })
    }

    renderAlert = _ => {
        const { saveStatus } = this.props;
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
        const { accountant } = this.state;
        var tbody;
        var checkAllBanker = true, checkAllRadioAll = true, checkAllSportbooksCasino = true, checkAll = true;
        if(accountant){
            tbody = accountant.map( item => {
                var arr = item.child;
                checkAllBanker = arr.every(function (sub) {
                    if(sub.checked === 1 || sub.checked === true){
                        return true
                    }
                    return false
                });
                // Check All RadioAll and Check All Sportbooks when banker is new789 - flag_type = 2
                if(item.banker === 'new789'){
                    checkAllRadioAll = arr.every(function (sub) {
                        if(sub.flag_type === 1){
                            return true
                        }
                        return false
                    });
                    checkAllSportbooksCasino = arr.every(function (sub) {
                        if(sub.flag_type === 2){
                            return true
                        }
                        return false
                    });
                } else {
                    checkAllRadioAll = arr.every(function (sub) {
                        if(sub.flag_type === 0 || sub.flag_type === false){
                            return true
                        }
                        return false
                    });
                    checkAllSportbooksCasino = arr.every(function (sub) {
                        if(sub.flag_type === 1 || sub.flag_type === true){
                            return true
                        }
                        return false
                    });
                }

                if(checkAll && !checkAllBanker){
                    checkAll = false
                }
                return(
                    <div key={item.banker} className="col-md-6">
                        <div className="portlet box grey-silver">
                            <div className="portlet-title">
                                <div className="caption">
                                    <label className="mt-checkbox mt-checkbox-outline font-dark font-size-15" style={{width: 160}}>
                                        <Input
                                            type="checkbox"
                                            checked={checkAllBanker}
                                            onChange={this.handleChangeCheckAllBanker(item)}
                                        />
                                        {item.banker}
                                        <span></span>
                                    </label>&nbsp;&nbsp;
                                    {
                                        (item.banker.toLowerCase() === "sgd777" ||
                                            item.banker.toLowerCase() === "ok368" ||
                                            item.banker.toLowerCase() === "ld789" ||
                                            item.banker.toLowerCase() === "ldbong88" ||
                                            item.banker.toLowerCase() === "edy688" ||
                                            item.banker.toLowerCase() === "3king" ||
                                            item.banker.toLowerCase() ==="sgs889")
                                            ?
                                            <label className="mt-checkbox mt-checkbox-outline font-dark font-size-15" style={{width: 120}}>
                                                <Input
                                                    type="checkbox"
                                                    checked={checkAllRadioAll}
                                                    onChange={this.handleChangeCheckAllRadioAll(item)}
                                                />
                                                <TransComponent i18nKey="All"/>
                                                <span></span>
                                            </label>
                                            :
                                            <>
                                                <label className="mt-checkbox mt-checkbox-outline font-dark font-size-15" style={{width: 120}}>
                                                    <Input
                                                        type="checkbox"
                                                        checked={checkAllRadioAll}
                                                        onChange={this.handleChangeCheckAllRadioAll(item)}
                                                    />
                                                    <TransComponent i18nKey="All"/>
                                                    <span></span>
                                                </label>&nbsp;&nbsp;
                                                <label className="mt-checkbox mt-checkbox-outline font-dark font-size-15">
                                                    <Input
                                                        type="checkbox"
                                                        checked={checkAllSportbooksCasino}
                                                        onChange={this.handleChangeCheckAllSportbookCasino(item)}
                                                    />
                                                    <TransComponent i18nKey="All type by type"/>
                                                    <span></span>
                                                </label>&nbsp;&nbsp;
                                            </>
                                    }
                                </div>
                            </div>
                            <div className="portlet-body">
                                {
                                    item.child.map( item_child => {
                                        var checkedBanker = (item_child.checked === 1 || item_child.checked === true) ? 'checked' : '';
                                        var checkedItemAll = (item_child.flag_type === 0 || item_child.flag_type === false)? 'checked' : '';
                                        var checkedSportbooksCasino = (item_child.flag_type === 1 || item_child.flag_type === true) ? 'checked' : '';
                                        var checkNew789 = item_child.flag_type === 2 || item_child.flag_type === true ? 'checked' : '';
                                        return(
                                            <table className="table table-condensed table-hover" key={item_child.acc_name}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{width: 160}}>
                                                            <label className="mt-checkbox mt-checkbox-outline font-dark font-size-12">
                                                                <Input
                                                                    type="checkbox"
                                                                    checked={checkedBanker}
                                                                    onChange={this.handleChangeCheckBoxChild(item_child)}
                                                                />
                                                                {item_child.acc_name}
                                                                <span></span>
                                                            </label>
                                                        </td>
                                                        {
                                                            item_child.book_name === "sportsbook" ?
                                                                <>
                                                                    <td style={{width: 130}}>
                                                                        {
                                                                            item.banker === "sbc168" ? null :
                                                                                <label className="mt-radio font-size-12">
                                                                                    <Input
                                                                                        type="radio"
                                                                                        name={item_child.acc_name + "~" + item.banker}
                                                                                        value="0"
                                                                                        checked={checkedItemAll}
                                                                                        onChange={this.handleCheckType(item_child)}
                                                                                    />
                                                                                    <TransComponent i18nKey="All"/>
                                                                                    <span></span>
                                                                                </label>
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.banker === "bong88" || item.banker === "abet" ?
                                                                                <label className="mt-radio font-size-12">
                                                                                    <Input
                                                                                        type="radio"
                                                                                        name={item_child.acc_name + "~" + item.banker}
                                                                                        value="1"
                                                                                        checked={checkedSportbooksCasino}
                                                                                        onChange={this.handleCheckType(item_child)}
                                                                                    />
                                                                                    sb & casino & loto & bullfighting & poker
                                                                                    <span></span>
                                                                                </label>
                                                                                : item.banker === "sbobet" || item.banker === "asbobet" ?
                                                                                    <label className="mt-radio font-size-12">
                                                                                        <Input
                                                                                            type="radio"
                                                                                            name={item_child.acc_name + "~" + item.banker}
                                                                                            value="1"
                                                                                            checked={checkedSportbooksCasino}
                                                                                            onChange={this.handleCheckType(item_child)}
                                                                                        />
                                                                                        sb & casino & games-xs & racing & esb
                                                                                        <span></span>
                                                                                    </label>
                                                                                    : item.banker === "pinbet88" ?
                                                                                        <label className="mt-radio font-size-12">
                                                                                            <Input
                                                                                                type="radio"
                                                                                                name={item_child.acc_name + "~" + item.banker}
                                                                                                value="1"
                                                                                                checked={checkedSportbooksCasino}
                                                                                                onChange={this.handleCheckType(item_child)}
                                                                                            />
                                                                                            sb & vs & ggl & rng
                                                                                            <span></span>
                                                                                        </label>
                                                                                        : item.banker === "91bets" ?
                                                                                            <label className="mt-radio font-size-12">
                                                                                                <Input
                                                                                                    type="radio"
                                                                                                    name={item_child.acc_name + "~" + item.banker}
                                                                                                    value="1"
                                                                                                    checked={checkedSportbooksCasino}
                                                                                                    onChange={this.handleCheckType(item_child)}
                                                                                                />
                                                                                                sb & casino & games
                                                                                                <span></span>
                                                                                            </label>
                                                                                            : item.banker === "fishbet" ?
                                                                                            <label className="mt-radio font-size-12">
                                                                                                <Input
                                                                                                    type="radio"
                                                                                                    name={item_child.acc_name + "~" + item.banker}
                                                                                                    value="1"
                                                                                                    checked={checkedSportbooksCasino}
                                                                                                    onChange={this.handleCheckType(item_child)}
                                                                                                />
                                                                                                sb & csn & lottery & games & p2p & financial
                                                                                                <span></span>
                                                                                            </label>
                                                                                            :
                                                                                            <label className="mt-radio font-size-12">
                                                                                                <Input
                                                                                                    type="radio"
                                                                                                    name={item_child.acc_name + "~" + item.banker}
                                                                                                    value="1"
                                                                                                    checked={checkedSportbooksCasino}
                                                                                                    onChange={this.handleCheckType(item_child)}
                                                                                                />
                                                                                                sb & casino
                                                                                                <span></span>
                                                                                            </label>
                                                                        }
                                                                    </td>
                                                                </>
                                                                :
                                                                item_child.book_name === "other" ?
                                                                <>
                                                                    <td style={{width: 130}}>
                                                                        {
                                                                            item.banker === "sv388" || item.banker === "s1288" || item.banker === "cft3388" ?
                                                                                <label className="mt-radio font-size-12">
                                                                                    <Input
                                                                                        type="radio"
                                                                                        name={item_child.acc_name + "~" + item.banker}
                                                                                        value="0"
                                                                                        checked={checkedItemAll}
                                                                                        onChange={this.handleCheckType(item_child)}
                                                                                    />
                                                                                    <TransComponent i18nKey="All"/>
                                                                                    <span></span>
                                                                                </label>
                                                                                : null
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                        item.banker === "sv388" ?
                                                                            <label className="mt-radio font-size-12">
                                                                                <Input
                                                                                    type="radio"
                                                                                    name={item_child.acc_name + "~" + item.banker}
                                                                                    value="1"
                                                                                    checked={checkedSportbooksCasino}
                                                                                    onChange={this.handleCheckType(item_child)}
                                                                                />
                                                                                Cam & phi & sexy-jdb-jdbf & venus
                                                                                <span></span>
                                                                            </label>
                                                                            : item.banker === "cft3388" ?
                                                                                <label className="mt-radio font-size-12">
                                                                                    <Input
                                                                                        type="radio"
                                                                                        name={item_child.acc_name + "~" + item.banker}
                                                                                        value="1"
                                                                                        checked={checkedSportbooksCasino}
                                                                                        onChange={this.handleCheckType(item_child)}
                                                                                    />
                                                                                    CF & WFC
                                                                                    <span></span>
                                                                                </label>
                                                                                : item.banker === "s1288" ?
                                                                                    <label className="mt-radio font-size-12">
                                                                                        <Input
                                                                                            type="radio"
                                                                                            name={item_child.acc_name + "~" + item.banker}
                                                                                            value="1"
                                                                                            checked={checkedSportbooksCasino}
                                                                                            onChange={this.handleCheckType(item_child)}
                                                                                        />
                                                                                        cockfight & casino & racing & mma
                                                                                        <span></span>
                                                                                    </label>
                                                                                    : null
                                                                        }
                                                                    </td>
                                                                </>
                                                                    : item_child.book_name === "loto" ?
                                                                    <>
                                                                        <td style={{width: 130}}></td>
                                                                        <td>
                                                                            {
                                                                                item.banker === "new789" ?
                                                                                    <label className="mt-radio font-size-12">
                                                                                        <Input
                                                                                            type="radio"
                                                                                            name={item_child.acc_name + "~" + item.banker}
                                                                                            value="2"
                                                                                            checked={checkNew789}
                                                                                            onChange={this.handleCheckType(item_child)}
                                                                                        />
                                                                                        Loto
                                                                                        <span></span>
                                                                                    </label>
                                                                                    : null
                                                                            }
                                                                        </td>
                                                                    </> : null
                                                        }
                                                    </tr>
                                                </tbody>
                                            </table>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )
            })
        }

        return(
            <>
                {this.renderAlert()}
                <div className="row form-group">
                    <div className="col-md-6">
                        <div className="btn-group-top">
                            <Button color="success" onClick={() => this.handleSaveAccountant()}><TransComponent i18nKey="Save"/></Button>
                        </div>
                    </div>
                    <div className="col-md-6 text-right">
                        <label className="mt-checkbox mt-checkbox-outline">
                            <Input
                                type="checkbox"
                                onChange={this.handleCheckAll()}
                                checked={checkAll}
                            />
                            <TransComponent i18nKey="Select All"/>
                            <span></span>
                        </label>
                    </div>
                </div>
                <div className="row">
                    {tbody}
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
        getAccountantConfig: () => dispatch(getAccountantConfig()),
        saveAccountantConfig: (params) => dispatch(saveAccountantConfig(params)),
        resetFormSaveResponse: params => dispatch(resetFormSaveResponse(params)),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(AccountantConfigComponent);