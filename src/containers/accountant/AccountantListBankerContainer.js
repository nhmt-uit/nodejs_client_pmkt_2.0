import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Collapse } from 'reactstrap'
import { isEmpty as _isEmpty, isEqual as _isEqual } from 'lodash'
import { collapseBanker, checkBanker, checkBankerAccount } from 'my-actions/AccountantAction';
import { LoadingComponent } from 'my-components';
import { AccountantListBankerAccountContainer, ModalDeleteFormulaContainer, ModalFormFormulaContainer } from 'my-containers/accountant';

class AccountantListBankerContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.socketInitStatus, this.props.socketInitStatus)
            || !_isEqual(newProps.banker, this.props.banker)
            )
            return true
        return false;
    }

    render() {
        if (this.props.socketInitStatus !== "finish" && _isEmpty(this.props.banker)) return <LoadingComponent />
        return (
            <>
            {
                this.props.banker.map((banker, idx) => {
                    let classOpenBanker = banker.collapse ? "fa fa-chevron-down" : "fa fa-chevron-up"
                    return (
                        <div key={idx} className={"portlet box grey-cascade list-banker-account " + banker.book_name}>
                            <div className="portlet-title">
                                <div className="caption">
                                    <label className="mt-checkbox caption-subject bold uppercase">
                                        <input type="checkbox" onChange={_ => this.props.checkBankerAccount("banker", {bankerId: banker.id})} checked={banker.checked} /> {banker.name}
                                        <span></span>
                                    </label>
                                </div>
                                <div className="tools"><a href="#/"  onClick={_ => this.props.collapseBanker('single', banker.id)}><i className={classOpenBanker}></i></a></div>
                            </div>
                            <Collapse isOpen={banker.collapse} className="portlet-body">
                                <AccountantListBankerAccountContainer bankerId={banker.id} />
                            </Collapse>
                        </div>
                    )
                })
            }
            {/* Modal Delete Formular */}
            <ModalDeleteFormulaContainer />
            <ModalFormFormulaContainer />
            </>
        )
    }
}



const mapStateToProps = state => {
    return {
        socketInitStatus : state.AccountantReducer.socketInitStatus,
        banker : state.AccountantReducer.banker
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        collapseBanker: (type, bankerId) => {dispatch(collapseBanker(type, bankerId))},
        checkBanker: bankerId => {dispatch(checkBanker(bankerId))},
        checkBankerAccount: (type_check, params) => {dispatch(checkBankerAccount(type_check, params))},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountantListBankerContainer);