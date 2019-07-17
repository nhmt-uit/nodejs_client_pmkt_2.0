import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { isEmpty as _isEmpty, cloneDeep as _cloneDeep } from 'lodash'

import { TransComponent, PaginationComponent, LoadingComponent } from 'my-components';
import { getMember, getFormulaByMember, toggleModalMember, toggleModalDeleteMember } from "my-actions/member/MemberAction";
import { ModalFormMemberContainer, ModalDeleteMemberContainer } from 'my-containers/member'

class ListMemberContainer extends Component {
    state = {
        currentPage: 1,
        itemPerPage: 10,
        search: {
            fullname : null
        }
    }
    componentWillMount() {
        this.props.getMember();
    }

    componentDidUpdate() {
        // Hide modal after save success
        if((this.props.formSaveStatus && this.props.isOpenModal)
            || (this.props.formDeleteStatus && this.props.isOpenModalDelete)
        ) {
            this.props.getMember();
        }
    }

    handleGetFormulaByMember = item => {
        this.props.getFormulaByMember({memberId: item.id, selectedItemList: item})
    }

    handleSearch = value => {
        this.setState({
            search: {
                fullname : value
            },
            currentPage: 1,
        })
    }

    handleChangePage = currentPage => {
        this.setState({
            currentPage,
        });
    }

    render() {
        let optMember = _cloneDeep(this.props.optMember)
        let totalItem = optMember.length
        const {currentPage, itemPerPage, search } = this.state
        const searchFullname = search.fullname
        
        if(searchFullname) {
            optMember = optMember.filter(item => item.fullname.toLowerCase().indexOf(searchFullname.toLowerCase()) !== -1)
            totalItem = optMember.length
        }
        optMember = optMember.splice((currentPage - 1) * itemPerPage, itemPerPage);

        const formType = _isEmpty(this.props.selectedItem) ? "create" : "update"
        return (
            <>
                <div className="form-group text-right">
                    <button onClick={_ => this.props.toggleModalMember()} className="btn btn-danger"><TransComponent i18nKey="Add new" /></button>
                </div>
                <div className="portlet box blue-hoki position-relative">
                    {this.props.isInitListMember ? <LoadingComponent /> : null }
                    <div className="portlet-title">
                        <div className="caption bold uppercase font-size-15"><TransComponent i18nKey="Member list" /></div>
                        <div className="actions">
                            <div className="form-inline">
                                <div className="form-group">
                                    <label className="sr-only">formula name</label>
                                    <div className="input-icon right">
                                        <i className="fa fa-search"></i>
                                        <input className="form-control" onChange={e => this.handleSearch(e.target.value)} type="text" placeholder={this.props.t("Member")} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="portlet-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr className="font-red-sunglo">
                                        <th>#</th>
                                        <th><TransComponent i18nKey="Full name"/></th>
                                        <th><TransComponent i18nKey="Username" /></th>
                                        <th><TransComponent i18nKey="Status" /></th>
                                        <th><TransComponent i18nKey="password 2" /></th>
                                        <th><TransComponent i18nKey="Edit" /></th>
                                        <th><TransComponent i18nKey="Delete" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    optMember.length ?
                                        optMember.map( (item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td> {itemPerPage * (currentPage - 1) + index + 1} </td>
                                                    <td className="uppercase">
                                                        <a href="#/" onClick={_ => this.handleGetFormulaByMember(item)} > {item.fullname} </a>
                                                    </td>
                                                    <td className="uppercase">{item.username}</td>
                                                    <td className="text-center"> {item.status === 1 ? <TransComponent i18nKey="Online"/> : <TransComponent i18nKey="Offline"/>} </td>
                                                    <td className="text-center"> {item.active_password2 === 1  ?  <button onClick={_ => null} className="btn btn-danger"><TransComponent i18nKey="Activate" /></button> : null } </td>
                                                    <td className="text-center">
                                                        <a href="#/" className="text-success btn btn-link" onClick={ _ => this.props.toggleModalMember({selectedItem:item})}>
                                                            <i className="fa fa-edit" />
                                                        </a>
                                                    </td>
                                                    <td className="text-center">
                                                        <button className="text-success btn btn-link font-red" onClick={ _ => this.props.toggleModalDeleteMember({selectedItem:item})}>
                                                            <i className="fa fa-close" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    : <tr><td className="text-center" colSpan="20"><TransComponent i18nKey="Data Empty" /></td></tr>
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="text-center">
                            <PaginationComponent
                                currentPage={currentPage}
                                total={totalItem}
                                perPage={itemPerPage}
                                onClickPage={this.handleChangePage}
                            />
                        </div>
                    </div>
                </div>
                
                <ModalFormMemberContainer formType={formType} />
                <ModalDeleteMemberContainer />
            </>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        //Handle Loading
        isInitListMember: state.MemberReducer.isInitListMember,


        optMember: state.MemberReducer.optMember,
        isOpenModal: state.MemberReducer.isOpenModal,
        selectedItem: state.MemberReducer.selectedItem,
        formSaveStatus: state.MemberReducer.formSaveStatus,

        formDeleteStatus: state.MemberReducer.formDeleteStatus,
        isOpenModalDelete: state.MemberReducer.isOpenModalDelete,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMember: _ => {dispatch(getMember())},
        getFormulaByMember: params => {dispatch(getFormulaByMember(params))},
        
        // Handel Modal Form Member
        toggleModalMember:  params => dispatch(toggleModalMember(params)),
        // Handel Modal Delete Member
        toggleModalDeleteMember:  params => dispatch(toggleModalDeleteMember(params)),
    };
};


export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(ListMemberContainer);