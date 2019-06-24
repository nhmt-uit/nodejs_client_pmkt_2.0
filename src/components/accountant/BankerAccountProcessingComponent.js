import React, { Component } from 'react';
import { isEmpty as _isEmpty} from 'lodash'

class BankerAccountProcessingComponent extends Component {
    renderBankerAccount() {
        const { bankerAccounts } = this.props
        return bankerAccounts.map((item, idx) => {
            return (
                <span key={idx} className="col-md-3"> <b className="uppercase">{item.acc_name}</b> : {item.message} </span>
            )
        })
    }

    render() {
        const { bankerAccounts } = this.props
        if (_isEmpty(bankerAccounts)) return false
        return (
            <div className="note note-success row" style={{maxHeight: '400px', overflowY: 'auto'}}>
                {this.renderBankerAccount()}
            </div>
        );
    }
}

export default BankerAccountProcessingComponent