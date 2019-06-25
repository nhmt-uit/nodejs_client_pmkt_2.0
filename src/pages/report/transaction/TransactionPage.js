import React, {Component} from 'react'
import ListOfTransaction from "my-containers/report/transaction/ListOfTransaction";
import CreateTransaction from "my-containers/report/transaction/CreateTransaction";

class TransactionPage extends Component{
    render() {
        return (
            <div>
                <div className="col-xs-5">
                    <CreateTransaction/>
                </div>
                <div></div>
                <div className="row">
                    <ListOfTransaction/>
                </div>
            </div>
        );
    }
}

export default TransactionPage