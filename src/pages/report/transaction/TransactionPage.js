import React, {Component} from 'react'
import {ListOfTransaction, CreateTransaction, BillTransaction} from "my-containers/report/transaction";
import { TransComponent } from 'my-components'
import ButtonBackTransaction from "my-containers/report/transaction/ButtonBackTransaction";


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
            <div className='portlet light bordered'>
                <div className="portlet-title">
                    <div className="caption font-red-sunglo">
                        <span className="caption-subject bold uppercase">
                            <TransComponent i18nKey="Transaction" />
                        </span>
                    </div>
                    <div className="actions">
                        <ButtonBackTransaction/>
                    </div>
                </div>
                <div className="portlet-body form">
                    <div className="row">
                        <div className="col-md-4">
                            <CreateTransaction onRef={ref => (this.child = ref)}
                                               callParentFromCreateTransaction={this.getDataFromCreateTransaction}/>
                        </div>
                        <div className="col-md-8">
                            <BillTransaction onRef={ref => (this.childBillTransaction = ref)}/>

                        </div>
                        <div className="clearFix"></div>
                        <div className="col-md-12">
                            <ListOfTransaction handleParent={this.callbackListOfTransaction}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TransactionPage