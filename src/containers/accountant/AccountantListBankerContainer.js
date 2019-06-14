import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Collapse } from 'reactstrap'

class AccountantListBankerContainer extends Component {
    state = {
        isOpen: true
    }

    handleCollapse = _ => {
        let isOpen = !this.state.isOpen
        this.setState({isOpen})
    }

    renderListBankerAccount = bankerAccounts => {
        let xhtml = null
        if (bankerAccounts) {
            console.log(bankerAccounts)
            xhtml = bankerAccounts.map((account, idx) => {
                console.log(account)
                return (
                    <Collapse isOpen={this.handleCollapse} className="portlet-body">
                        <div className="panel-group accordion">
                            <div className="panel panel-default">
                                <div className="panel-heading" onClick={this.handleCollapse}>
                                    <h4 className="panel-title">
                                        <div className="col-sm-6">
                                            <label className="mt-checkbox uppercase">
                                                <input type="checkbox"  /> {account.acc_name}
                                                <span></span>
                                            </label>
                                        </div>
                                        <div className="col-sm-6"><label className="mt-checkbox "> {account.note}</label></div>
                                        <div className="clearfix"></div>
                                    </h4>
                                </div>
                                <Collapse isOpen={this.state.isOpen} className="panel-collapse">
                                    <div className="panel-body">
                                        <p> Duis autem vel eum iriure dolor in hendrerit in vulputate. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut. </p>
                                        <p> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. </p>
                                    </div>
                                </Collapse>
                            </div>
                        </div>
                    </Collapse>
                )
            })
        }
        return xhtml
    }

    renderListBanker = _ => {
        let xhtml = null
        if (this.props.accountant_payload) {
            const listBankerProcessed = this.props.accountant_payload.listBankerProcessed
            xhtml = listBankerProcessed.map((banker, idx) => {
                return (
                    <div className="portlet box grey-cascade list-banker-account">
                        <div className="portlet-title">
                            <div className="caption">
                                <label className="mt-checkbox caption-subject bold uppercase">
                                    <input type="checkbox"  /> {banker.name}
                                    <span></span>
                                </label>
                            </div>
                            <div className="tools"><a href="#/"  onClick={this.handleCollapse}> hide show </a></div>
                        </div>
                        {this.renderListBankerAccount(banker.listAccounts)}
                    </div>
                )
            })
        }
        return xhtml
        // return (
        //     <>
        //     <div className="portlet-title">
        //         <div className="caption">
        //             <label className="mt-checkbox caption-subject bold uppercase">
        //                 <input type="checkbox"  /> 332BET
        //                 <span></span>
        //             </label>
        //         </div>
        //         <div className="tools"><a href="#/"  onClick={this.handleCollapse}> hide show </a></div>
        //     </div>
        //     <Collapse isOpen={this.handleCollapse} className="portlet-body">
        //         <div className="panel-group accordion">
        //             <div className="panel panel-default">
        //                 <div className="panel-heading" onClick={this.handleCollapse}>
        //                     <h4 className="panel-title">
        //                         <div className="col-sm-6">
        //                             <label className="mt-checkbox ">
        //                                 <input type="checkbox"  /> 332BET
        //                                 <span></span>
        //                             </label>
        //                         </div>
        //                         <div className="col-sm-6"><label className="mt-checkbox">332BET</label></div>
        //                         <div className="clearfix"></div>
        //                     </h4>
        //                 </div>
        //                 <Collapse isOpen={this.state.isOpen} className="panel-collapse">
        //                     <div className="panel-body">
        //                         <p> Duis autem vel eum iriure dolor in hendrerit in vulputate. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut. </p>
        //                         <p> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. </p>
        //                     </div>
        //                 </Collapse>
        //             </div>
        //         </div>
        //     </Collapse>
        //     </>
        // )
    }


    render() {
        return (
            this.renderListBanker()
        );
    }
}

const mapStateToProps = state => {
    return {
        accountant_payload : state.AccountantReducer.payload,
    }
}

export default compose(
    connect(mapStateToProps, null),
    withTranslation()
)(AccountantListBankerContainer);