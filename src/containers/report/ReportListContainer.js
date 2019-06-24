import React, { Component, Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import {
    ListGroupItem, ListGroup,
    Modal, ModalFooter,
    ModalHeader, ModalBody, Button
} from 'reactstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { get as _get, cloneDeep } from 'lodash';

import { getCyclePage, getReport } from 'my-actions/ReportAction';
import { LoadingComponent, PaginationComponent } from 'my-components';
import { ReportService } from 'my-services';

class ReportListContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            itemPerPage: 10,
            collapse: {},
            cycleChosen: '',
            cycleChosenSelect: '',
            isOpenModal: false,
            delName: '',
            delValue: {
                chuky_id: '',
                acc_name: '',
            },
            isOpenDelModal: false,
        };
    }

    componentDidMount() {
        const { currentPage, itemPerPage } = this.state;

        this.props.getCyclePage({ currentPage, itemPerPage  });
    }

    toggle = id => () => {
        const collapse = this.state.collapse;

        collapse[id] = !(!!collapse[id]);

        this.setState({ collapse });
    };

    recursiveItem(item, id, isExported = false) {
        const collapse = this.state.collapse;

        if (!item.child) {
            return <a href="https://google.com" target="_blank">{item.name}</a>;
        }

        if (item.level === 3) {
            return Object.keys(item.child).map((elm, index) => {
                const child = item.child[elm];
                const key = child.id;
                const isOpen = !!collapse[`${id}${item.id}${item.name.trim()}`];

                return isOpen ? (
                    <div key={key} className="margin-top-15">
                        <div className="margin-top-10 margin-bottom-10">
                            <a href="https://google.com" target="_blank">{index + 1} - {child.name}</a>
                            { isExported
                                ? ''
                                : <span className="icon-close float-right color-red cursor-pointer" onClick={this.toggleDelModal(child.name, { chuky_id: id, acc_name: child.name })} />
                            }
                        </div>
                    </div>
                ) : '';
            });
        }

        return Object.keys(item.child).map(elm => {
            const child = cloneDeep(item.child[elm]);
            const key = `${id}${child.id}${child.name.trim()}`;
            const isOpen = !!collapse[key];
            const collapseElement = isOpen ? (
                <div className="margin-top-15 margin-bottom-15" style={{ marginLeft: '25px' }}>
                    { this.recursiveItem(child, id, isExported) }
                </div>
            ) : '';

            return (
                <Fragment key={key}>
                    <div className="margin-top-10 margin-bottom-10">
                        { isOpen
                            ? <i className="fa fa-minus cursor-pointer color-grey" onClick={this.toggle(key)} />
                            : <i className="fa fa-plus cursor-pointer color-grey" onClick={this.toggle(key)} />
                        }
                        &nbsp;&nbsp;
                        {
                            child.level === 3
                                ? <a href="https://google.com" target="_blank">{child.name}</a>
                                : <span>{child.name}</span>
                        }
                        {collapseElement}
                    </div>
                </Fragment>
            )
        })
    }

    renderCycleItem(cycle) {
        const collapse = this.state.collapse;
        const collapseElement = !!collapse[cycle.id] ? (
            <div className="margin-top-15" style={{ marginLeft: '25px' }}>
                {this.recursiveItem(cycle, cycle.id, cycle.is_exported)}
            </div>
        ) : '';

        return (
            <ListGroupItem key={cycle.id}>
                <div>
                    {
                        !!collapse[cycle.id]
                            ? <i className="fa fa-minus cursor-pointer color-grey" onClick={this.toggle(cycle.id)} />
                            : <i className="fa fa-plus cursor-pointer color-grey" onClick={this.toggle(cycle.id)} />
                    }
                    &nbsp;&nbsp;<a href="#" onClick={this.handleGetReport(cycle.id)}>{cycle.name}</a>
                    <span className="float-right" >
                        {
                            cycle.is_exported
                                ? <i className="fa fa-check-circle font-green" />
                                : <i className="fa fa-exchange font-green cursor-pointer" onClick={this.toggleModal(cycle.id)} />
                        }
                        &nbsp;&nbsp;<span className="icon-close color-red cursor-pointer" onClick={this.toggleDelModal(cycle.name, { chuky_id: cycle.id, acc_name: '' })} />
                    </span>

                    { collapseElement }
                </div>
            </ListGroupItem>
        );
    }

    handleClickPage = (currentPage) => {
        this.setState({
            currentPage
        }, () => {
            this.props.getCyclePage({
                currentPage: this.state.currentPage,
                itemPerPage: this.state.itemPerPage
            });
        });
    };

    toggleModal = (id) => _ => {
        const state = Object.assign({}, this.state);

        state.isOpenModal = !state.isOpenModal;
        state.cycleChosen = typeof id === 'string' ? id: state.cycleChosen;

        this.setState(state)
    };

    toggleDelModal = (name, value) => () => {
        const newState = Object.assign({}, this.state);

        if (name && value) {
            newState.delName = name;
            newState.delValue = value;
        }

        newState.isOpenDelModal = !newState.isOpenDelModal;

        this.setState(newState);
    };

    handleCloseCycle = _ => {
        const params = {
            chuky_id_from: this.state.cycleChosen,
            chuky_id_to: this.state.cycleChosenSelect,
        };

        ReportService.closeCycle(params).then(_ => {
            const { currentPage, itemPerPage } = this.state;

            this.setState({ isOpenModal: !this.state.isOpenModal }, () => {
                this.props.getCyclePage({ currentPage, itemPerPage });
            });
        })
    };

    handleDelCycle = _ => {
        ReportService.delCycle(this.state.delValue).then(_ => {
            const { currentPage, itemPerPage } = this.state;

            this.setState({ isOpenDelModal: !this.state.isOpenDelModal }, () => {
                this.props.getCyclePage({ currentPage, itemPerPage });
            })
        })
    };

    handleChangeCycleClose = (item) => {
        this.setState({
            cycleChosenSelect: item.value,
        });
    };

    handleGetReport = id => () => {
        this.props.getReport({ chuky_id: id });
    };

    renderModal() {
        const { cyclePage, t } = this.props;
        const arrOptions = [];

        (cyclePage.cycleListOpen || []).forEach(item => {
            if (!item.is_exported && item.id !== this.state.cycleChosen) {
                arrOptions.push({
                    value: item.id,
                    label: item.chuky,
                });
            }
        });

        return (
            <Modal isOpen={this.state.isOpenModal} toggle={this.toggleModal()}>
                <ModalHeader toggle={this.toggleModal()} className="text-uppercase">
                    <strong>
                        {t('Select cycle')}
                    </strong>
                </ModalHeader>
                <ModalBody>
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        name="color"
                        isSearchable={false}
                        placeholder={t('choose')}
                        onChange={this.handleChangeCycleClose}
                        options={arrOptions}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button className="bg-green font-white" onClick={this.handleCloseCycle}>{t('save')}</Button>{' '}
                    <Button color="secondary" onClick={this.toggleModal()}>{t('cancel')}</Button>
                </ModalFooter>
            </Modal>
        );
    }

    renderModalDel() {
        const t = this.props.t;
        const { isOpenDelModal, delName } = this.state;

        return (
            <Modal isOpen={this.state.isOpenDelModal} toggle={this.toggleDelModal()}>
                <ModalHeader toggle={this.toggleDelModal()} className="text-uppercase">
                    <strong>
                        {t('Confirm')}
                    </strong>
                </ModalHeader>
                <ModalBody>
                    {t('Are you sure to delete ')} <span className="font-green">{ delName }</span> ?
                </ModalBody>
                <ModalFooter>
                    <Button className="bg-red font-white" onClick={this.handleDelCycle}>{t('save')}</Button>{' '}
                    <Button color="secondary" onClick={this.toggleDelModal()}>{t('cancel')}</Button>
                </ModalFooter>
            </Modal>
        );
    }

    render() {
        const { t, cyclePage, isFetching } = this.props;
        const { itemPerPage, currentPage } = this.state;
        const cycleList = cyclePage.data || {};

        if (isFetching) {
            return (
                <div className="portlet light bordered">
                    <div className="portlet-title">
                        <div className="caption">
                            <span className="caption-subject font-green sbold uppercase">{t('report')}</span>
                        </div>
                        <div className="actions">
                            <button className="btn btn-danger">{t('Add')}</button>
                        </div>
                    </div>
                    <div className="portlet-body" style={{ minHeight: '60px' }}>
                        <LoadingComponent />
                    </div>
                </div>
            );
        }

        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject font-green sbold uppercase">{t('report')}</span>
                    </div>
                    <div className="actions">
                        <button className="btn btn-danger">{t('Add')}</button>
                    </div>
                </div>
                <div className="portlet-body ">
                    <ListGroup>
                        {Object.keys(cycleList).map(item => {
                            return this.renderCycleItem(cycleList[item]);
                        })}
                    </ListGroup>
                    <div className="text-center">
                        <PaginationComponent
                            total={cyclePage.total || 0}
                            perPage={itemPerPage}
                            currentPage={currentPage}
                            onClickPage={this.handleClickPage}
                        />
                    </div>
                </div>
                {this.renderModal()}
                {this.renderModalDel()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cyclePage: _get(state, 'ReportReducer.cyclePage', {}),
        isFetching: _get(state, 'ReportReducer.isFetching', false),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCyclePage: pagination => dispatch(getCyclePage(pagination)),
        getReport: post => dispatch(getReport(post)),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(ReportListContainer);