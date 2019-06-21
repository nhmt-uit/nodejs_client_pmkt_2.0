import React, { Component } from 'react';
import { withTranslation } from 'react-i18next'
import { isEmpty as _isEmpty} from 'lodash'

let checkItem = null
class BankerAccountErrorComponent extends Component {
    state = {
        isDelete: false,
        isUpdate: false
    }

    handleControl = type => {
        if (type === "delete") this.setState({isDelete: !this.state.isDelete, isUpdate: false})
        if (type === "edit") this.setState({isUpdate: !this.state.isUpdate, isDelete: false})
    }

    handelToggleModal = (item) => {
        if (this.state.isDelete) this.props.toggleModal('open_delete', item)
        if (this.state.isUpdate) this.props.toggleModal('open_update', item)
    }
    
    renderBankerAccount() {
        const { t, bankerAccounts, isOpenModal } = this.props
        this.checkItem = isOpenModal ? this.checkItem : null
        return bankerAccounts.map((item, idx) => {
            return (
                <div key={idx} className="form-group col-md-12" style={{marginBottom: '0px'}} >
                    <label className="mt-radio" onClick={_ => this.handelToggleModal(item) } style={{marginBottom: '0px'}} >
                        {this.state.isUpdate || this.state.isDelete ? <input type="radio" name="optionsRadios" onChange={_ => this.checkItem = item.id} checked={item.id === this.checkItem} /> : null }
                        <b className="uppercase">{item.acc_name} : </b>
                        {this.state.isUpdate || this.state.isDelete ? <span></span> : null}
                    </label>
                    {t(item.message)}
                </div>
            )
        })
    }

    render() {
        const { t, bankerAccounts } = this.props
        if (_isEmpty(bankerAccounts)) return false
        return (
            <div className="col-md-6">
                <div className="portlet box">
                    <div className="portlet-title bg-default">
                        <div className="caption">{t("Error account")}</div>
                        <div className="tools">
                            <a href="#/" title="" onClick={_ => this.handleControl("edit")}>
                                {this.state.isUpdate ? <i className="fa fa-close"></i> : <i className="fa fa-pencil"></i> }
                            </a>
                            <a href="#/" title="" className="font-red-sunglo"  onClick={_ => this.handleControl("delete")}>
                                {this.state.isDelete ? <i className="fa fa-close"></i> : <i className="fa fa-trash"></i> }
                            </a>
                        </div>
                    </div>
                    <div className="portlet-body body-notify-acc-scan bg-danger">
                        <div className="row">
                            {this.renderBankerAccount()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(BankerAccountErrorComponent);