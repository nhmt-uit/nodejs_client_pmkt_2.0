import React, { Component } from 'react'

class ListBankerAccountsComponent extends Component {
    render() {
        let xhtml = null
        const { bankerAccounts } = this.props
        if (bankerAccounts) {
            xhtml = bankerAccounts.map((account, idx) => {
                return (
                        <div key={idx} className="panel-group accordion">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h4 className="panel-title">
                                        <div className="col-sm-6">
                                            <label className="mt-checkbox uppercase">
                                                <input type="checkbox" onChange={ _ => null } onClick={ _ => console.log("check") } /> {account.acc_name}
                                                <span></span>
                                            </label>
                                        </div>
                                        <div className="col-sm-6"><label className="mt-checkbox "> {account.note}</label></div>
                                        <div className="clearfix"></div>
                                    </h4>
                                </div>
                            </div>
                        </div>
                )
            })
        }
        return xhtml
    }
}

export default ListBankerAccountsComponent