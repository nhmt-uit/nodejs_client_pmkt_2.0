import React, {Component} from 'react'
import {ListOfTransaction, CreateTransaction, BillTransaction} from "my-containers/report/transaction";

class TransactionPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            editValue: '',

            showBill: '',
            memberId: '',
            cycleId: '',
        }
    }

    callbackListOfTransaction = item =>{
        this.setState({
            editValue: item,
        })
        this.child.callCreateTransaction(item)
    };

    getDataFromCreateTransaction = (Data) => {
        if(Data.memberId){
            this.setState({
                showBill: Data.showBill,
                memberId: Data.memberId,
            })
        } else if (Data.cycleId){
            this.setState({
                showBill: Data.showBill,
                cycleId: Data.cycleId,
            })
        } else{
            this.setState({
                showBill: Data.showBill,
                memberId: '',
                cycleId: '',
            })
        }

    };

    render() {
        return (
            <div className='row'>
                <div className="portlet light bordered" style={{marginLeft: 15, marginRight:15}}>
                    <div className="caption font-red-sunglo"><h4><span className="caption-subject bold uppercase"> List of Transaction </span></h4></div>
                    <div className="tools"><span className="collapse"> </span></div>
                </div>
                <div className="col-xs-5">
                    <CreateTransaction editValue = {this.state.editValue} onRef={ref => (this.child = ref)}
                                        callParentFromCreateTransaction={this.getDataFromCreateTransaction}/>
                </div>
                <div className="col-xs-7">
                    { this.state.showBill ? (<BillTransaction {...this.state}/>) : ''}
                </div>
                <div className="col-xs-12">
                    <ListOfTransaction handleParent={this.callbackListOfTransaction}/>
                </div>
            </div>
        );
    }
}

export default TransactionPage