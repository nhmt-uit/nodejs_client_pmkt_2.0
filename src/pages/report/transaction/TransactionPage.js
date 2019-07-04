import React, {Component} from 'react'
import {ListOfTransaction, CreateTransaction, BillTransaction} from "my-containers/report/transaction";
import { TransComponent } from 'my-components'


class TransactionPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            memberValues: '',
            cycleValues: '',
        }
    }

    callbackListOfTransaction = item =>{
        this.child.callCreateTransaction(item)
    };

    getDataFromCreateTransaction = (memberValues, cycleValues, typeOfMoney, transactionMethod, amount) => {
        this.childBillTransaction.callBillTransaction(memberValues, cycleValues, typeOfMoney, transactionMethod, amount)
    };

    render() {
        return (
            <div className='row'>
                <div className="portlet light bordered" style={{marginLeft: 15, marginRight:15}}>
                    <div className="caption font-red-sunglo"><h4><span className="caption-subject bold uppercase"> <TransComponent i18nKey="List of Transaction"/> </span></h4></div>
                    <div className="tools"><span className="collapse"> </span></div>
                </div>
                <div className="col-xs-5">
                    <CreateTransaction onRef={ref => (this.child = ref)}
                                        callParentFromCreateTransaction={this.getDataFromCreateTransaction}/>
                </div>
                <div className="col-xs-7">
                    <BillTransaction onRef={ref => (this.childBillTransaction = ref)}/>
                </div>
                <div className="col-xs-12">
                    <ListOfTransaction handleParent={this.callbackListOfTransaction}/>
                </div>
            </div>
        );
    }
}

export default TransactionPage