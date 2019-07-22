import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import {connect} from "react-redux";
import { TransComponent } from 'my-components'
import { saveCurrencyCustomFilter, getCurrencyConfig } from 'my-actions/manage/ConfigurationAction';

class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            // initData: this.props.initCurrency,
            // currencyOptions: [],
            // currencyMap: {},
            // currencyName: '',
            // exampleResult: 0,
            isOpen: false,
            round: -2
        };

    }

    componentWillReceiveProps(nextProps, nextContext) {
        // if (nextProps.initCurrency) {
        //     let currency_id = '';
        //     let exampleResult = '';
        //     let currencyName = '';
        //
        //     this.state.currencyOptions = nextProps.initCurrency;
        //     this.state.exampleResult = this.roundFn(this.state.example, this.state.currencyOptions[0] ? this.state.currencyOptions[0].filter : 0);
        //     nextProps.initCurrency.forEach(function (item) {
        //         this.state.currencyMap[item.id] = {name: item.name, round: item.filter};
        //         if (this.state.id) {
        //             if (this.state.currencyName.toLowerCase().trim() == item.name.toLowerCase().trim()) {
        //                 currency_id = item.id.toString();
        //                 exampleResult = this.roundFn(this.state.example, item.filter);
        //                 currencyName = item.name;
        //             }
        //         }
        //     }.bind(this));
        //     let state = {
        //         currencyName: this.state.currencyOptions[0] ? this.state.currencyOptions[0].name : '',
        //         currency_id: currency_id,
        //         round: this.state.round != -2 ? this.state.round : nextProps.item.filter
        //     };
        //     if (this.state.id) {
        //         state['currencyName'] = currencyName;
        //         state['exampleResult'] = exampleResult;
        //     }
        //     this.setState(state);
        // }
        if (nextProps.isOpen !== undefined) {
            let state = {
                isOpen: nextProps.isOpen,
                round: this.state.round && this.state.round !== -2 ? this.state.round : nextProps.item.filter
            };
            this.setState(state)
        }

    }

    roundFn (base, exponent) {
        let places = Math.pow(10, exponent);
        return Math.round(base * places) / places;
    }

    onClosed = () => {
        this.setState({
            isOpen: false,
            round : -2
        }, this.props.showHideForm( this.props.item, false));
    }

    handleSave = () => {
        let self = this;
        let post = {
            currency_type_id: this.props.item.id,
            round: self.state.round
        };
        self.props.saveCurrencyCustomFilter(post).then(function () {
            self.props.getCurrencyConfig().then(function () {
                self.onClosed();
            });
        })
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={this.onClosed} onClosed={this.onClosed} className={this.props.className}>
                    <ModalHeader toggle={this.onClosed}><TransComponent i18nKey="Update currency" /></ModalHeader>
                    <ModalBody>

                        <div>
                            <div id="alert-message-form"></div>
                            <div className="col-xs-8">
                                <form action="#" className="style-form">
                                    <div className="form-group">
                                        <label className="control-label"><TransComponent i18nKey="Currency name" /></label>
                                        <div className="static-form-control">{this.props.item.name}</div>
                                    </div>
                                    <label><TransComponent i18nKey="Round" /></label>
                                    <Input type="select" name="round" component="select" value={this.state.round} onChange={(e) => {this.setState({round: e.target.value})}} >
                                        <option value={-1}>X0</option>
                                        <option value={0}>X</option>
                                        <option value={1}>0.X</option>
                                        <option value={2}>0.0X</option>
                                    </Input>
                                </form>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleSave}><TransComponent i18nKey="Submit" /></Button>{' '}
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        saveCurrencyCustomFilter: (post) => dispatch(saveCurrencyCustomFilter(post)),
        getCurrencyConfig: () => dispatch(getCurrencyConfig()),
    };
};

export default compose(
    withTranslation(),
    connect(null, mapDispatchToProps)
)(EditForm)
