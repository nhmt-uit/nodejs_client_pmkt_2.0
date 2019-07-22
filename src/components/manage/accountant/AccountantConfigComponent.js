import React, {Component} from 'react'
import {Button, Input} from "reactstrap";
import {TransComponent} from 'my-components'
import {Row, Col} from "reactstrap";
import {Field} from "redux-form";


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

    handleChangeCheckAllBanker = () => {

    }

    handleCheckType = (item_child) => e => {
    }

    handleChangeCheckBoxChild = (item_child) => e => {
        console.log(item_child)
        const { accountant } = this.state;
        var checked = e.target.checked
        accountant.forEach( item => {
            if(item.banker === item_child.banker){
                item.child.forEach( child => {
                    if(child.id === item_child.id){
                        child.checked = checked
                    }
                })
            }
        })
        console.log(accountant)
        this.setState({
            accountant: accountant
        })
    }

    render() {
        const { accountant } = this.state;
        var tbody;
        var checkAllBanker, checkAllRadioAll, checkAllSportbooksCasino;
        if(accountant){
            accountant.forEach( item => {
                var arr = item.child;
                checkAllBanker = arr.every(function (sub) {
                    return sub.checked === 1
                })
                checkAllRadioAll = arr.every(function (sub) {
                    return sub.flag_type === 0
                })
                checkAllSportbooksCasino = arr.every(function (sub) {
                    return sub.flag_type === 1
                })
            })
        }
        if(accountant){
            tbody = accountant.map( item => {
                return(
                    <div key={item.banker} className="col-md-6">
                        <div className="portlet box grey-silver position-relative">
                            <div className="portlet-title">
                                <div className="caption form-group">
                                    <label className="mt-checkbox mt-checkbox-outline font-dark" style={{width: 160}}>
                                        <Input
                                            type="checkbox"
                                            checked={checkAllBanker}
                                            onChange={this.handleChangeCheckAllBanker()}
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
                                            <label className="mt-checkbox mt-checkbox-outline font-dark" style={{width: 160}}>
                                                <Input
                                                    type="checkbox"
                                                    checked={checkAllRadioAll}
                                                    onChange={this.handleChangeCheckAllBanker()}
                                                />
                                                <TransComponent i18nKey="All"/>
                                                <span></span>
                                            </label>
                                            :
                                            <>
                                                <label className="mt-checkbox mt-checkbox-outline font-dark" style={{width: 160}}>
                                                    <Input
                                                        type="checkbox"
                                                        checked={checkAllRadioAll}
                                                        onChange={this.handleChangeCheckAllBanker()}
                                                    />
                                                    <TransComponent i18nKey="All"/>
                                                    <span></span>
                                                </label>&nbsp;&nbsp;
                                                <label className="mt-checkbox mt-checkbox-outline font-dark">
                                                    <Input
                                                        type="checkbox"
                                                        checked={checkAllSportbooksCasino}
                                                        onChange={this.handleChangeCheckAllBanker()}
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
                                        var checkedItemAll = item_child.flag_type === 0 ? 'checked' : '';
                                        var checkedSportbooksCasino = item_child.flag_type === 1 ? 'checked' : '';
                                        var checkNew789 = item_child.flag_type === 2 ? 'checked' : '';
                                        return(
                                            <table className="table table-condensed table-hover" key={item_child.acc_name}>
                                                <tbody>
                                                    <tr>
                                                        <td style={{width: 150}}>
                                                            <label className="mt-checkbox mt-checkbox-outline font-dark">
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
                                                                    <td style={{width: 160}}>
                                                                        {
                                                                            item.banker === "sbc168" ? null :
                                                                                <label className="mt-radio">
                                                                                    <Input
                                                                                        type="radio"
                                                                                        name={item_child.acc_name + "~" + item.banker}
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
                                                                                <label className="mt-radio">
                                                                                    <Input
                                                                                        type="radio"
                                                                                        name={item_child.acc_name + "~" + item.banker}
                                                                                        checked={checkedSportbooksCasino}
                                                                                        onChange={this.handleCheckType(item_child)}
                                                                                    />
                                                                                    sb & casino & loto & bullfighting & poker
                                                                                    <span></span>
                                                                                </label>
                                                                                : item.banker === "sbobet" || item.banker === "asbobet" ?
                                                                                    <label className="mt-radio">
                                                                                        <Input
                                                                                            type="radio"
                                                                                            name={item_child.acc_name + "~" + item.banker}
                                                                                            checked={checkedSportbooksCasino}
                                                                                            onChange={this.handleCheckType(item_child)}
                                                                                        />
                                                                                        sb & casino & games-xs & racing & esb
                                                                                        <span></span>
                                                                                    </label>
                                                                                    : item.banker === "pinbet88" ?
                                                                                        <label className="mt-radio">
                                                                                            <Input
                                                                                                type="radio"
                                                                                                name={item_child.acc_name + "~" + item.banker}
                                                                                                checked={checkedSportbooksCasino}
                                                                                                onChange={this.handleCheckType(item_child)}
                                                                                            />
                                                                                            sb & vs & ggl & rng
                                                                                            <span></span>
                                                                                        </label>
                                                                                        : item.banker === "91bets" ?
                                                                                            <label className="mt-radio">
                                                                                                <Input
                                                                                                    type="radio"
                                                                                                    name={item_child.acc_name + "~" + item.banker}
                                                                                                    checked={checkedSportbooksCasino}
                                                                                                    onChange={this.handleCheckType(item_child)}
                                                                                                />
                                                                                                sb & casino & games
                                                                                                <span></span>
                                                                                            </label>
                                                                                            : item.banker === "fishbet" ?
                                                                                            <label className="mt-radio">
                                                                                                <Input
                                                                                                    type="radio"
                                                                                                    name={item_child.acc_name + "~" + item.banker}
                                                                                                    checked={checkedSportbooksCasino}
                                                                                                    onChange={this.handleCheckType(item_child)}
                                                                                                />
                                                                                                sb & csn & lottery & games & p2p & financial
                                                                                                <span></span>
                                                                                            </label>
                                                                                            :
                                                                                            <label className="mt-radio">
                                                                                                <Input
                                                                                                    type="radio"
                                                                                                    name={item_child.acc_name + "~" + item.banker}
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
                                                                    <td style={{width: 160}}>
                                                                        {
                                                                            item.banker === "sv388" || item.banker === "s1288" || item.banker === "cft3388" ?
                                                                                <label className="mt-radio">
                                                                                    <Input
                                                                                        type="radio"
                                                                                        name={item_child.acc_name + "~" + item.banker}
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
                                                                            <label className="mt-radio">
                                                                                <Input
                                                                                    type="radio"
                                                                                    name={item_child.acc_name + "~" + item.banker}
                                                                                    checked={checkedSportbooksCasino}
                                                                                    onChange={this.handleCheckType(item_child)}
                                                                                />
                                                                                Cam & phi & sexy-jdb-jdbf & venus
                                                                                <span></span>
                                                                            </label>
                                                                            : item.banker === "cft3388" ?
                                                                                <label className="mt-radio">
                                                                                    <Input
                                                                                        type="radio"
                                                                                        name={item_child.acc_name + "~" + item.banker}
                                                                                        checked={checkedSportbooksCasino}
                                                                                        onChange={this.handleCheckType(item_child)}
                                                                                    />
                                                                                    CF & WFC
                                                                                    <span></span>
                                                                                </label>
                                                                                : item.banker === "s1288" ?
                                                                                    <label className="mt-radio">
                                                                                        <Input
                                                                                            type="radio"
                                                                                            name={item_child.acc_name + "~" + item.banker}
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
                                                                        <td style={{width: 160}}>
                                                                            {
                                                                                item.banker === "new789" ?
                                                                                    <label className="mt-radio">
                                                                                        <Input
                                                                                            type="radio"
                                                                                            name={item_child.acc_name + "~" + item.banker}
                                                                                            checked={checkNew789}
                                                                                            onChange={this.handleCheckType(item_child)}
                                                                                        />
                                                                                        <TransComponent i18nKey="Loto"/>
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
            <div className="portlet light">
                <div className="portlet-title">
                    <div className="col-md-6">
                        <div className="btn-group-top">
                            <Button color="success"><TransComponent i18nKey="Save"/></Button>
                        </div>
                    </div>
                    <div className="col-md-6 text-right">
                        <label className="mt-checkbox mt-checkbox-outline">
                            <Input type="checkbox"/>
                            <TransComponent i18nKey="Select All"/>
                            <span></span>
                        </label>
                    </div>
                </div>
                {tbody}
            </div>
        )
    }
}

export default AccountantConfigComponent;