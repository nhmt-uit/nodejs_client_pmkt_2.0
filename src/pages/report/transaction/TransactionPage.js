import React, {Component} from 'react'
import ListOfTransaction from "my-containers/report/transaction/ListOfTransaction";
import CreateTransaction from "my-containers/report/transaction/CreateTransaction";

class TransactionPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            editValueID: '',
        }
    }

    callbackListOfTransaction = valueID =>{
        this.setState({
            editValueID: valueID,
        })
    };

    render() {
        return (
            <div>
                <div className="col-xs-5">
                    <CreateTransaction editValueID ={this.state.editValueID} />
                </div>
                <div></div>
                <div className="row">
                    <ListOfTransaction handleParent={this.callbackListOfTransaction}/>
                </div>
            </div>
        );
    }
}

export default TransactionPage