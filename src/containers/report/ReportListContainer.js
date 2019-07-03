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

import { getCyclePage, getReport, getReportByBanker, getReportByMember } from 'my-actions/ReportAction';
import { LoadingComponent, PaginationComponent } from 'my-components';
import { ReportService } from 'my-services';
import { CookieService } from 'my-utils/core';

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

        // this.props.getCyclePage({ currentPage, itemPerPage  });
    }

    toggle = id => () => {
        const collapse = this.state.collapse;

        collapse[id] = !(!!collapse[id]);

        this.setState({ collapse });
    };

    recursiveItem(item, id, itemActive, isExported = false) {
        const collapse = this.state.collapse;

        if (!item.child) {
            return <a href="/#" target="_blank">{item.name}</a>;
        }

        if (item.level === 3) {
            return Object.keys(item.child).map((elm, index) => {
                const child = item.child[elm];
                const key = child.id;
                const isOpen = !!collapse[`${id}${item.id}${item.name.trim()}`];

                return isOpen ? (
                    <div key={key} className="margin-top-15">
                        <div className="margin-top-10 margin-bottom-10">
                            <a href="#" onClick={this.handleGetReport({ chuky_id: id, memberName: child.name }, { ...itemActive, member_name: child.name }, 'member')} >{index + 1} - {child.name}</a>
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
                    { this.recursiveItem(child, id, itemActive, isExported) }
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
                                ? <a href="#" onClick={this.handleGetReport({ chuky_id: id, bankerId: child.id }, { ...itemActive, banker_id: child.id }, 'banker')} >{child.name}</a>
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
                {this.recursiveItem(cycle, cycle.id, cycle, cycle.is_exported)}
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
                    &nbsp;&nbsp;<a href="#" onClick={this.handleGetReport({ chuky_id: cycle.id }, cycle, 'cycle')}>{cycle.name}</a>
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

    handleGetReport = (post, itemActive, type) => () => {
        switch(type) {
            case 'cycle':
                this.props.getReport(post, itemActive);
                break;
            case 'banker':
                this.props.getReportByBanker(post, itemActive);
                break;
            default:
                this.props.getReportByMember(post, itemActive);
        }
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
        const roles = CookieService.get('roles');
        const btnAdd =
            (Number(roles) === 11 || Number(roles) === 12)
                ? null
                : (<div className="actions">
                    <button className="btn btn-danger">{t('Add')}</button>
                </div>);

        if (isFetching) {
            return (
                <div className="portlet light bordered">
                    <div className="portlet-title">
                        <div className="caption">
                            <span className="caption-subject font-red bold uppercase">{t('report')}</span>
                        </div>
                        {btnAdd}
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
                        <span className="caption-subject font-red bold uppercase">{t('report')}</span>
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
        // cyclePage: _get(state, 'ReportReducer.cyclePage', {}),
        cyclePage: {
          "data": {
            "5ca43b4ab5e0b8e9e7f6cae6": {
              "id": "5ca43b4ab5e0b8e9e7f6cae6",
              "name": "04/01/2019-04/02/2019",
              "sort_value": "1554091200",
              "is_exported": false,
              "level": 0,
              "expend": false,
              "child": {
                "accounting": {
                  "id": "5ca43b4ab5e0b8e9e7f6cae6",
                  "name": "Accounting",
                  "level": 1,
                  "expend": false,
                  "child": {
                    "56850ba0097802b9f23929af": {
                      "id": "56850ba0097802b9f23929af",
                      "name": "casino",
                      "level": 2,
                      "expend": false,
                      "child": {
                        "56850ba0097802b9f23929b5": {
                          "id": "56850ba0097802b9f23929b5",
                          "name": "sgd777",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "22875197D1": {
                              "id": "22875197D1",
                              "name": "22875197D1",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        },
                        "56850ba0097802b9f23929c6": {
                          "id": "56850ba0097802b9f23929c6",
                          "name": "edy688",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "AT": {
                              "id": "AT",
                              "name": "AT",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "5ca58aaab5e0b8e9e7f6ce99": {
              "id": "5ca58aaab5e0b8e9e7f6ce99",
              "name": "04/01/2019-04/03/2019",
              "sort_value": "1554091200",
              "is_exported": false,
              "level": 0,
              "expend": false,
              "child": {
                "accounting": {
                  "id": "5ca58aaab5e0b8e9e7f6ce99",
                  "name": "Accounting",
                  "level": 1,
                  "expend": false,
                  "child": {
                    "56850ba0097802b9f23929af": {
                      "id": "56850ba0097802b9f23929af",
                      "name": "casino",
                      "level": 2,
                      "expend": false,
                      "child": {
                        "56850ba0097802b9f23929b5": {
                          "id": "56850ba0097802b9f23929b5",
                          "name": "sgd777",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "22875197D1": {
                              "id": "22875197D1",
                              "name": "22875197D1",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        },
                        "56850ba0097802b9f23929c6": {
                          "id": "56850ba0097802b9f23929c6",
                          "name": "edy688",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "AT": {
                              "id": "AT",
                              "name": "AT",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "5ca6cb09b5e0b8e9e7f6d1f0": {
              "id": "5ca6cb09b5e0b8e9e7f6d1f0",
              "name": "04/01/2019-04/04/2019",
              "sort_value": "1554091200",
              "is_exported": false,
              "level": 0,
              "expend": false,
              "child": {
                "accounting": {
                  "id": "5ca6cb09b5e0b8e9e7f6d1f0",
                  "name": "Accounting",
                  "level": 1,
                  "expend": false,
                  "child": {
                    "56850ba0097802b9f23929af": {
                      "id": "56850ba0097802b9f23929af",
                      "name": "casino",
                      "level": 2,
                      "expend": false,
                      "child": {
                        "56850ba0097802b9f23929b5": {
                          "id": "56850ba0097802b9f23929b5",
                          "name": "sgd777",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "22875197D1": {
                              "id": "22875197D1",
                              "name": "22875197D1",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        },
                        "56850ba0097802b9f23929c6": {
                          "id": "56850ba0097802b9f23929c6",
                          "name": "edy688",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "AT": {
                              "id": "AT",
                              "name": "AT",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "5ca81cf6b5e0b8e9e7f6d5ae": {
              "id": "5ca81cf6b5e0b8e9e7f6d5ae",
              "name": "04/01/2019-04/05/2019",
              "sort_value": "1554091200",
              "is_exported": false,
              "level": 0,
              "expend": false,
              "child": {
                "accounting": {
                  "id": "5ca81cf6b5e0b8e9e7f6d5ae",
                  "name": "Accounting",
                  "level": 1,
                  "expend": false,
                  "child": {
                    "56850ba0097802b9f23929af": {
                      "id": "56850ba0097802b9f23929af",
                      "name": "casino",
                      "level": 2,
                      "expend": false,
                      "child": {
                        "56850ba0097802b9f23929b5": {
                          "id": "56850ba0097802b9f23929b5",
                          "name": "sgd777",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "22875197D1": {
                              "id": "22875197D1",
                              "name": "22875197D1",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        },
                        "56850ba0097802b9f23929c6": {
                          "id": "56850ba0097802b9f23929c6",
                          "name": "edy688",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "AT": {
                              "id": "AT",
                              "name": "AT",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "5ca97245b5e0b8e9e7f6d974": {
              "id": "5ca97245b5e0b8e9e7f6d974",
              "name": "04/01/2019-04/06/2019",
              "sort_value": "1554091200",
              "is_exported": false,
              "level": 0,
              "expend": false,
              "child": {
                "accounting": {
                  "id": "5ca97245b5e0b8e9e7f6d974",
                  "name": "Accounting",
                  "level": 1,
                  "expend": false,
                  "child": {
                    "56850ba0097802b9f23929af": {
                      "id": "56850ba0097802b9f23929af",
                      "name": "casino",
                      "level": 2,
                      "expend": false,
                      "child": {
                        "56850ba0097802b9f23929b5": {
                          "id": "56850ba0097802b9f23929b5",
                          "name": "sgd777",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "22875197D1": {
                              "id": "22875197D1",
                              "name": "22875197D1",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        },
                        "56850ba0097802b9f23929c6": {
                          "id": "56850ba0097802b9f23929c6",
                          "name": "edy688",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "AT": {
                              "id": "AT",
                              "name": "AT",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "5caafa332d62da4c4649e4ae": {
              "id": "5caafa332d62da4c4649e4ae",
              "name": "04/01/2019-04/07/2019",
              "sort_value": "1554091200",
              "is_exported": false,
              "level": 0,
              "expend": false,
              "child": {
                "accounting": {
                  "id": "5caafa332d62da4c4649e4ae",
                  "name": "Accounting",
                  "level": 1,
                  "expend": false,
                  "child": {
                    "56850ba0097802b9f23929af": {
                      "id": "56850ba0097802b9f23929af",
                      "name": "casino",
                      "level": 2,
                      "expend": false,
                      "child": {
                        "56850ba0097802b9f23929b5": {
                          "id": "56850ba0097802b9f23929b5",
                          "name": "sgd777",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "22875197D1": {
                              "id": "22875197D1",
                              "name": "22875197D1",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        },
                        "56850ba0097802b9f23929c6": {
                          "id": "56850ba0097802b9f23929c6",
                          "name": "edy688",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "AT": {
                              "id": "AT",
                              "name": "AT",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "5cac318b2d62da4c4649eb16": {
              "id": "5cac318b2d62da4c4649eb16",
              "name": "04/08/2019-04/08/2019",
              "sort_value": "1554696000",
              "is_exported": false,
              "level": 0,
              "expend": false,
              "child": {
                "accounting": {
                  "id": "5cac318b2d62da4c4649eb16",
                  "name": "Accounting",
                  "level": 1,
                  "expend": false,
                  "child": {
                    "56850ba0097802b9f23929af": {
                      "id": "56850ba0097802b9f23929af",
                      "name": "casino",
                      "level": 2,
                      "expend": false,
                      "child": {
                        "56850ba0097802b9f23929b5": {
                          "id": "56850ba0097802b9f23929b5",
                          "name": "sgd777",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "22875197D1": {
                              "id": "22875197D1",
                              "name": "22875197D1",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        },
                        "56850ba0097802b9f23929c6": {
                          "id": "56850ba0097802b9f23929c6",
                          "name": "edy688",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "AT": {
                              "id": "AT",
                              "name": "AT",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "5cad682a2d62da4c4649efee": {
              "id": "5cad682a2d62da4c4649efee",
              "name": "04/08/2019-04/09/2019",
              "sort_value": "1554696000",
              "is_exported": false,
              "level": 0,
              "expend": false,
              "child": {
                "accounting": {
                  "id": "5cad682a2d62da4c4649efee",
                  "name": "Accounting",
                  "level": 1,
                  "expend": false,
                  "child": {
                    "56850ba0097802b9f23929af": {
                      "id": "56850ba0097802b9f23929af",
                      "name": "casino",
                      "level": 2,
                      "expend": false,
                      "child": {
                        "56850ba0097802b9f23929b5": {
                          "id": "56850ba0097802b9f23929b5",
                          "name": "sgd777",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "22875197D1": {
                              "id": "22875197D1",
                              "name": "22875197D1",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        },
                        "56850ba0097802b9f23929c6": {
                          "id": "56850ba0097802b9f23929c6",
                          "name": "edy688",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "AT": {
                              "id": "AT",
                              "name": "AT",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "5caebac52d62da4c4649f66b": {
              "id": "5caebac52d62da4c4649f66b",
              "name": "02/01/2019-04/07/2019",
              "sort_value": "1548993600",
              "is_exported": false,
              "level": 0,
              "expend": false,
              "child": {
                "accounting": {
                  "id": "5caebac52d62da4c4649f66b",
                  "name": "Accounting",
                  "level": 1,
                  "expend": false,
                  "child": {
                    "56850ba0097802b9f23929af": {
                      "id": "56850ba0097802b9f23929af",
                      "name": "casino",
                      "level": 2,
                      "expend": false,
                      "child": {
                        "56850ba0097802b9f23929c6": {
                          "id": "56850ba0097802b9f23929c6",
                          "name": "edy688",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "AT": {
                              "id": "AT",
                              "name": "AT",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "5cb06d5c2d62da4c4649fb27": {
              "id": "5cb06d5c2d62da4c4649fb27",
              "name": "04/08/2019-04/11/2019",
              "sort_value": "1554696000",
              "is_exported": false,
              "level": 0,
              "expend": false,
              "child": {
                "accounting": {
                  "id": "5cb06d5c2d62da4c4649fb27",
                  "name": "Accounting",
                  "level": 1,
                  "expend": false,
                  "child": {
                    "56850ba0097802b9f23929af": {
                      "id": "56850ba0097802b9f23929af",
                      "name": "casino",
                      "level": 2,
                      "expend": false,
                      "child": {
                        "56850ba0097802b9f23929b5": {
                          "id": "56850ba0097802b9f23929b5",
                          "name": "sgd777",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "22875197D1": {
                              "id": "22875197D1",
                              "name": "22875197D1",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        },
                        "56850ba0097802b9f23929c6": {
                          "id": "56850ba0097802b9f23929c6",
                          "name": "edy688",
                          "is_exported": false,
                          "level": 3,
                          "is_banker": true,
                          "book_id": "56850ba0097802b9f23929af",
                          "child": {
                            "AT": {
                              "id": "AT",
                              "name": "AT",
                              "is_exported": false,
                              "level": 4,
                              "child": null
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "cycleListOpen": [
            {
              "_id": "5cb06d5c2d62da4c4649fb27",
              "chuky": "04/08/2019-04/11/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1554696000",
              "id": "5cb06d5c2d62da4c4649fb27"
            },
            {
              "_id": "5caebac52d62da4c4649f66b",
              "chuky": "02/01/2019-04/07/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1548993600",
              "id": "5caebac52d62da4c4649f66b"
            },
            {
              "_id": "5cad682a2d62da4c4649efee",
              "chuky": "04/08/2019-04/09/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1554696000",
              "id": "5cad682a2d62da4c4649efee"
            },
            {
              "_id": "5cac318b2d62da4c4649eb16",
              "chuky": "04/08/2019-04/08/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1554696000",
              "id": "5cac318b2d62da4c4649eb16"
            },
            {
              "_id": "5caafa332d62da4c4649e4ae",
              "chuky": "04/01/2019-04/07/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1554091200",
              "id": "5caafa332d62da4c4649e4ae"
            },
            {
              "_id": "5ca97245b5e0b8e9e7f6d974",
              "chuky": "04/01/2019-04/06/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1554091200",
              "id": "5ca97245b5e0b8e9e7f6d974"
            },
            {
              "_id": "5ca81cf6b5e0b8e9e7f6d5ae",
              "chuky": "04/01/2019-04/05/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1554091200",
              "id": "5ca81cf6b5e0b8e9e7f6d5ae"
            },
            {
              "_id": "5ca6cb09b5e0b8e9e7f6d1f0",
              "chuky": "04/01/2019-04/04/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1554091200",
              "id": "5ca6cb09b5e0b8e9e7f6d1f0"
            },
            {
              "_id": "5ca58aaab5e0b8e9e7f6ce99",
              "chuky": "04/01/2019-04/03/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1554091200",
              "id": "5ca58aaab5e0b8e9e7f6ce99"
            },
            {
              "_id": "5ca43b4ab5e0b8e9e7f6cae6",
              "chuky": "04/01/2019-04/02/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1554091200",
              "id": "5ca43b4ab5e0b8e9e7f6cae6"
            },
            {
              "_id": "5ca30a5fb5e0b8e9e7f6c633",
              "chuky": "04/01/2019-04/01/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1554091200",
              "id": "5ca30a5fb5e0b8e9e7f6c633"
            },
            {
              "_id": "5ca1b990b5e0b8e9e7f6be2e",
              "chuky": "03/25/2019-03/31/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1553486400",
              "id": "5ca1b990b5e0b8e9e7f6be2e"
            },
            {
              "_id": "5ca0390cb5e0b8e9e7f6b660",
              "chuky": "03/25/2019-03/30/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1553486400",
              "id": "5ca0390cb5e0b8e9e7f6b660"
            },
            {
              "_id": "5c9ef8bbb5e0b8e9e7f6b2a0",
              "chuky": "03/25/2019-03/29/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1553486400",
              "id": "5c9ef8bbb5e0b8e9e7f6b2a0"
            },
            {
              "_id": "5c9dae83b5e0b8e9e7f6afd0",
              "chuky": "03/25/2019-03/28/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1553486400",
              "id": "5c9dae83b5e0b8e9e7f6afd0"
            },
            {
              "_id": "5c9c4423b5e0b8e9e7f6ad60",
              "chuky": "03/25/2019-03/27/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1553486400",
              "id": "5c9c4423b5e0b8e9e7f6ad60"
            },
            {
              "_id": "5c9b188cb5e0b8e9e7f6ab6c",
              "chuky": "03/25/2019-03/26/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1553486400",
              "id": "5c9b188cb5e0b8e9e7f6ab6c"
            },
            {
              "_id": "5c99f6eeb5e0b8e9e7f6a8af",
              "chuky": "03/25/2019-03/25/2019",
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "__v": 0,
              "sort_value": "1553486400",
              "id": "5c99f6eeb5e0b8e9e7f6a8af"
            },
            {
              "_id": "5c970e26b5e0b8e9e7f696d5",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/18/2019-03/23/2019",
              "sort_value": "1552881600",
              "id": "5c970e26b5e0b8e9e7f696d5"
            },
            {
              "_id": "5c95ae62b5e0b8e9e7f691fa",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/18/2019-03/22/2019",
              "sort_value": "1552881600",
              "id": "5c95ae62b5e0b8e9e7f691fa"
            },
            {
              "_id": "5c944d6fb5e0b8e9e7f68da6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/18/2019-03/21/2019",
              "sort_value": "1552881600",
              "id": "5c944d6fb5e0b8e9e7f68da6"
            },
            {
              "_id": "5c93091db5e0b8e9e7f68a7f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/18/2019-03/20/2019",
              "sort_value": "1552881600",
              "id": "5c93091db5e0b8e9e7f68a7f"
            },
            {
              "_id": "5c91c212b5e0b8e9e7f686f5",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/18/2019-03/19/2019",
              "sort_value": "1552881600",
              "id": "5c91c212b5e0b8e9e7f686f5"
            },
            {
              "_id": "5c909335b5e0b8e9e7f683ea",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/18/2019-03/18/2019",
              "sort_value": "1552881600",
              "id": "5c909335b5e0b8e9e7f683ea"
            },
            {
              "_id": "5c8f467cb5e0b8e9e7f67dc5",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/11/2019-03/17/2019",
              "sort_value": "1552276800",
              "id": "5c8f467cb5e0b8e9e7f67dc5"
            },
            {
              "_id": "5c8dc756b5e0b8e9e7f67291",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/11/2019-03/16/2019",
              "sort_value": "1552276800",
              "id": "5c8dc756b5e0b8e9e7f67291"
            },
            {
              "_id": "5c8c67c4b5e0b8e9e7f66c3f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/11/2019-03/15/2019",
              "sort_value": "1552276800",
              "id": "5c8c67c4b5e0b8e9e7f66c3f"
            },
            {
              "_id": "5c8b1389b5e0b8e9e7f668a2",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/11/2019-03/14/2019",
              "sort_value": "1552276800",
              "id": "5c8b1389b5e0b8e9e7f668a2"
            },
            {
              "_id": "5c89d596b5e0b8e9e7f6657d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/11/2019-03/13/2019",
              "sort_value": "1552276800",
              "id": "5c89d596b5e0b8e9e7f6657d"
            },
            {
              "_id": "5c8887b5b5e0b8e9e7f6615f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/11/2019-03/12/2019",
              "sort_value": "1552276800",
              "id": "5c8887b5b5e0b8e9e7f6615f"
            },
            {
              "_id": "5c8735c0b5e0b8e9e7f65bc1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/11/2019-03/11/2019",
              "sort_value": "1552276800",
              "id": "5c8735c0b5e0b8e9e7f65bc1"
            },
            {
              "_id": "5c860657b5e0b8e9e7f656d5",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/04/2019-03/10/2019",
              "sort_value": "1551672000",
              "id": "5c860657b5e0b8e9e7f656d5"
            },
            {
              "_id": "5c8489acb5e0b8e9e7f64efc",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/04/2019-03/09/2019",
              "sort_value": "1551672000",
              "id": "5c8489acb5e0b8e9e7f64efc"
            },
            {
              "_id": "5c81eb66b5e0b8e9e7f64997",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/04/2019-03/08/2019",
              "sort_value": "1551672000",
              "id": "5c81eb66b5e0b8e9e7f64997"
            },
            {
              "_id": "5c81eb92b5e0b8e9e7f64999",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/04/2019-03/07/2019",
              "sort_value": "1551672000",
              "id": "5c81eb92b5e0b8e9e7f64999"
            },
            {
              "_id": "5c808bc6b5e0b8e9e7f646f6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/04/2019-03/06/2019",
              "sort_value": "1551672000",
              "id": "5c808bc6b5e0b8e9e7f646f6"
            },
            {
              "_id": "5c7f3f3eb5e0b8e9e7f6443f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/04/2019-03/05/2019",
              "sort_value": "1551672000",
              "id": "5c7f3f3eb5e0b8e9e7f6443f"
            },
            {
              "_id": "5c7df3b579282518c5a04be2",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/04/2019-03/04/2019",
              "sort_value": "1551672000",
              "id": "5c7df3b579282518c5a04be2"
            },
            {
              "_id": "5c7cc91379282518c5a043e3",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/25/2019-03/03/2019",
              "sort_value": "1551067200",
              "id": "5c7cc91379282518c5a043e3"
            },
            {
              "_id": "5c7b7afc79282518c5a03ea1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/25/2019-03/02/2019",
              "sort_value": "1551067200",
              "id": "5c7b7afc79282518c5a03ea1"
            },
            {
              "_id": "5c7a499879282518c5a03c07",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/25/2019-03/01/2019",
              "sort_value": "1551067200",
              "id": "5c7a499879282518c5a03c07"
            },
            {
              "_id": "5c78e26479282518c5a038f3",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/25/2019-02/28/2019",
              "sort_value": "1551067200",
              "id": "5c78e26479282518c5a038f3"
            },
            {
              "_id": "5c77bac179282518c5a035af",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/25/2019-02/27/2019",
              "sort_value": "1551067200",
              "id": "5c77bac179282518c5a035af"
            },
            {
              "_id": "5c762b1b79282518c5a03076",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/25/2019-02/26/2019",
              "sort_value": "1551067200",
              "id": "5c762b1b79282518c5a03076"
            },
            {
              "_id": "5c751a7f79282518c5a02bdf",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/25/2019-02/25/2019",
              "sort_value": "1551067200",
              "id": "5c751a7f79282518c5a02bdf"
            },
            {
              "_id": "5c738d4479282518c5a022a2",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/18/2019-02/24/2019",
              "sort_value": "1550462400",
              "id": "5c738d4479282518c5a022a2"
            },
            {
              "_id": "5c7222d579282518c5a01ba8",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/18/2019-02/23/2019",
              "sort_value": "1550462400",
              "id": "5c7222d579282518c5a01ba8"
            },
            {
              "_id": "5c70cb5f79282518c5a017e3",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/18/2019-02/22/2019",
              "sort_value": "1550462400",
              "id": "5c70cb5f79282518c5a017e3"
            },
            {
              "_id": "5c6f778c79282518c5a01419",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/18/2019-02/21/2019",
              "sort_value": "1550462400",
              "id": "5c6f778c79282518c5a01419"
            },
            {
              "_id": "5c6e1a0279282518c5a01240",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/18/2019-02/20/2019",
              "sort_value": "1550462400",
              "id": "5c6e1a0279282518c5a01240"
            },
            {
              "_id": "5c6cd9c279282518c5a00e27",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/18/2019-02/19/2019",
              "sort_value": "1550462400",
              "id": "5c6cd9c279282518c5a00e27"
            },
            {
              "_id": "5c6bb07779282518c5a00b75",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/18/2019-02/18/2019",
              "sort_value": "1550462400",
              "id": "5c6bb07779282518c5a00b75"
            },
            {
              "_id": "5c6a36f279282518c5a002d8",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/11/2019-02/17/2019",
              "sort_value": "1549857600",
              "id": "5c6a36f279282518c5a002d8"
            },
            {
              "_id": "5c68e48279282518c59ffe1f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/11/2019-02/16/2019",
              "sort_value": "1549857600",
              "id": "5c68e48279282518c59ffe1f"
            },
            {
              "_id": "5c6792da79282518c59ffb1c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/11/2019-02/15/2019",
              "sort_value": "1549857600",
              "id": "5c6792da79282518c59ffb1c"
            },
            {
              "_id": "5c66436479282518c59ff934",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/11/2019-02/14/2019",
              "sort_value": "1549857600",
              "id": "5c66436479282518c59ff934"
            },
            {
              "_id": "5c64f3c279282518c59ff693",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/11/2019-02/13/2019",
              "sort_value": "1549857600",
              "id": "5c64f3c279282518c59ff693"
            },
            {
              "_id": "5c626b5b79282518c59ff1cc",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/11/2019-02/11/2019",
              "sort_value": "1549857600",
              "id": "5c626b5b79282518c59ff1cc"
            },
            {
              "_id": "5c60ff1f79282518c59fec56",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/04/2019-02/10/2019",
              "sort_value": "1549252800",
              "id": "5c60ff1f79282518c59fec56"
            },
            {
              "_id": "5c5fb37a79282518c59fe927",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/04/2019-02/09/2019",
              "sort_value": "1549252800",
              "id": "5c5fb37a79282518c59fe927"
            },
            {
              "_id": "5c58f70c79282518c59fe40c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/04/2019-02/04/2019",
              "sort_value": "1549252800",
              "id": "5c58f70c79282518c59fe40c"
            },
            {
              "_id": "5c57c8f479282518c59fe0b8",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/28/2019-02/03/2019",
              "sort_value": "1548648000",
              "id": "5c57c8f479282518c59fe0b8"
            },
            {
              "_id": "5c5556cf79282518c59fdbd1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/28/2019-02/01/2019",
              "sort_value": "1548648000",
              "id": "5c5556cf79282518c59fdbd1"
            },
            {
              "_id": "5c54082d79282518c59fdaa2",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/28/2019-01/31/2019",
              "sort_value": "1548648000",
              "id": "5c54082d79282518c59fdaa2"
            },
            {
              "_id": "5c5264c679282518c59fd84f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/28/2019-01/30/2019",
              "sort_value": "1548648000",
              "id": "5c5264c679282518c59fd84f"
            },
            {
              "_id": "5c51811c79282518c59fd76e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/28/2019-01/29/2019",
              "sort_value": "1548648000",
              "id": "5c51811c79282518c59fd76e"
            },
            {
              "_id": "5c4e883e79282518c59fcc68",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/21/2019-01/27/2019",
              "sort_value": "1548043200",
              "id": "5c4e883e79282518c59fcc68"
            },
            {
              "_id": "5c4d456c79282518c59fc85b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/21/2019-01/26/2019",
              "sort_value": "1548043200",
              "id": "5c4d456c79282518c59fc85b"
            },
            {
              "_id": "5c4c3a7979282518c59fc675",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/21/2019-01/25/2019",
              "sort_value": "1548043200",
              "id": "5c4c3a7979282518c59fc675"
            },
            {
              "_id": "5c4a8f3e79282518c59fc448",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/21/2019-01/24/2019",
              "sort_value": "1548043200",
              "id": "5c4a8f3e79282518c59fc448"
            },
            {
              "_id": "5c46c38279282518c59fbcf2",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/21/2019-01/21/2019",
              "sort_value": "1548043200",
              "id": "5c46c38279282518c59fbcf2"
            },
            {
              "_id": "5c454c0c79282518c59fb4f0",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/14/2019-01/20/2019",
              "sort_value": "1547438400",
              "id": "5c454c0c79282518c59fb4f0"
            },
            {
              "_id": "5c43e5d779282518c59fae20",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/14/2019-01/19/2019",
              "sort_value": "1547438400",
              "id": "5c43e5d779282518c59fae20"
            },
            {
              "_id": "5c42995879282518c59fab8f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/14/2019-01/18/2019",
              "sort_value": "1547438400",
              "id": "5c42995879282518c59fab8f"
            },
            {
              "_id": "5c41403d79282518c59fa90e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/14/2019-01/17/2019",
              "sort_value": "1547438400",
              "id": "5c41403d79282518c59fa90e"
            },
            {
              "_id": "5c3ff48a79282518c59fa6f2",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/14/2019-01/16/2019",
              "sort_value": "1547438400",
              "id": "5c3ff48a79282518c59fa6f2"
            },
            {
              "_id": "5c3ea43979282518c59fa463",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/14/2019-01/15/2019",
              "sort_value": "1547438400",
              "id": "5c3ea43979282518c59fa463"
            },
            {
              "_id": "5c3de6b479282518c59fa29f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/14/2019-01/14/2019",
              "sort_value": "1547438400",
              "id": "5c3de6b479282518c59fa29f"
            },
            {
              "_id": "5c3c339779282518c59f9b88",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/07/2019-01/13/2019",
              "sort_value": "1546833600",
              "id": "5c3c339779282518c59f9b88"
            },
            {
              "_id": "5c3ac46f79282518c59f9506",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/07/2019-01/12/2019",
              "sort_value": "1546833600",
              "id": "5c3ac46f79282518c59f9506"
            },
            {
              "_id": "5c3989d879282518c59f931c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/07/2019-01/11/2019",
              "sort_value": "1546833600",
              "id": "5c3989d879282518c59f931c"
            },
            {
              "_id": "5c3804f579282518c59f9067",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/07/2019-01/10/2019",
              "sort_value": "1546833600",
              "id": "5c3804f579282518c59f9067"
            },
            {
              "_id": "5c36d00d79282518c59f8e78",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/07/2019-01/09/2019",
              "sort_value": "1546833600",
              "id": "5c36d00d79282518c59f8e78"
            },
            {
              "_id": "5c35ad1e79282518c59f8bfb",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/07/2019-01/08/2019",
              "sort_value": "1546833600",
              "id": "5c35ad1e79282518c59f8bfb"
            },
            {
              "_id": "5c32ee0879282518c59f82d0",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/31/2018-01/06/2019",
              "sort_value": "1546228800",
              "id": "5c32ee0879282518c59f82d0"
            },
            {
              "_id": "5c31ce0d79282518c59f7e5c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/31/2018-01/05/2019",
              "sort_value": "1546228800",
              "id": "5c31ce0d79282518c59f7e5c"
            },
            {
              "_id": "5c3037d979282518c59f7bfd",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/31/2018-01/04/2019",
              "sort_value": "1546228800",
              "id": "5c3037d979282518c59f7bfd"
            },
            {
              "_id": "5c2d8ff779282518c59f78a1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/31/2018-01/02/2019",
              "sort_value": "1546228800",
              "id": "5c2d8ff779282518c59f78a1"
            },
            {
              "_id": "5c2ad89779282518c59f7446",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/31/2018-12/31/2018",
              "sort_value": "1546228800",
              "id": "5c2ad89779282518c59f7446"
            },
            {
              "_id": "5c299ce479282518c59f6fd8",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/24/2018-12/30/2018",
              "sort_value": "1545624000",
              "id": "5c299ce479282518c59f6fd8"
            },
            {
              "_id": "5c28380779282518c59f6c2a",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/24/2018-12/29/2018",
              "sort_value": "1545624000",
              "id": "5c28380779282518c59f6c2a"
            },
            {
              "_id": "5c26e2b979282518c59f6aa3",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/24/2018-12/28/2018",
              "sort_value": "1545624000",
              "id": "5c26e2b979282518c59f6aa3"
            },
            {
              "_id": "5c25b36f79282518c59f6945",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/24/2018-12/27/2018",
              "sort_value": "1545624000",
              "id": "5c25b36f79282518c59f6945"
            },
            {
              "_id": "5c2450c279282518c59f677b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/24/2018-12/26/2018",
              "sort_value": "1545624000",
              "id": "5c2450c279282518c59f677b"
            },
            {
              "_id": "5c23129f79282518c59f65a6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/24/2018-12/25/2018",
              "sort_value": "1545624000",
              "id": "5c23129f79282518c59f65a6"
            },
            {
              "_id": "5c219ea579282518c59f635c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/24/2018-12/24/2018",
              "sort_value": "1545624000",
              "id": "5c219ea579282518c59f635c"
            },
            {
              "_id": "5c20638b79282518c59f5e00",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/17/2018-12/23/2018",
              "sort_value": "1545019200",
              "id": "5c20638b79282518c59f5e00"
            },
            {
              "_id": "5c1db23279282518c59f5917",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/17/2018-12/21/2018",
              "sort_value": "1545019200",
              "id": "5c1db23279282518c59f5917"
            },
            {
              "_id": "5c1c5b8a79282518c59f5754",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/17/2018-12/20/2018",
              "sort_value": "1545019200",
              "id": "5c1c5b8a79282518c59f5754"
            },
            {
              "_id": "5c1b10ca79282518c59f55d0",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/17/2018-12/19/2018",
              "sort_value": "1545019200",
              "id": "5c1b10ca79282518c59f55d0"
            },
            {
              "_id": "5c19bab079282518c59f53d1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/17/2018-12/18/2018",
              "sort_value": "1545019200",
              "id": "5c19bab079282518c59f53d1"
            },
            {
              "_id": "5c189ff579282518c59f5223",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/17/2018-12/17/2018",
              "sort_value": "1545019200",
              "id": "5c189ff579282518c59f5223"
            },
            {
              "_id": "5c172ffb79282518c59f4c8e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/10/2018-12/16/2018",
              "sort_value": "1544414400",
              "id": "5c172ffb79282518c59f4c8e"
            },
            {
              "_id": "5c15d0f179282518c59f47cc",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/10/2018-12/15/2018",
              "sort_value": "1544414400",
              "id": "5c15d0f179282518c59f47cc"
            },
            {
              "_id": "5c14698179282518c59f45f7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/10/2018-12/14/2018",
              "sort_value": "1544414400",
              "id": "5c14698179282518c59f45f7"
            },
            {
              "_id": "5c1326de79282518c59f441d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/10/2018-12/13/2018",
              "sort_value": "1544414400",
              "id": "5c1326de79282518c59f441d"
            },
            {
              "_id": "5c11d7e079282518c59f4275",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/10/2018-12/12/2018",
              "sort_value": "1544414400",
              "id": "5c11d7e079282518c59f4275"
            },
            {
              "_id": "5c10c4a479282518c59f40d7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/10/2018-12/11/2018",
              "sort_value": "1544414400",
              "id": "5c10c4a479282518c59f40d7"
            },
            {
              "_id": "5c0f449f79282518c59f3bfe",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/10/2018-12/10/2018",
              "sort_value": "1544414400",
              "id": "5c0f449f79282518c59f3bfe"
            },
            {
              "_id": "5c0def2779282518c59f3523",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/03/2018-12/09/2018",
              "sort_value": "1543809600",
              "id": "5c0def2779282518c59f3523"
            },
            {
              "_id": "5c0ca79979282518c59f2ff8",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/03/2018-12/08/2018",
              "sort_value": "1543809600",
              "id": "5c0ca79979282518c59f2ff8"
            },
            {
              "_id": "5c0b5d0579282518c59f2c5e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/03/2018-12/07/2018",
              "sort_value": "1543809600",
              "id": "5c0b5d0579282518c59f2c5e"
            },
            {
              "_id": "5c0a13d579282518c59f29b2",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/03/2018-12/06/2018",
              "sort_value": "1543809600",
              "id": "5c0a13d579282518c59f29b2"
            },
            {
              "_id": "5c08ba7079282518c59f2616",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/03/2018-12/05/2018",
              "sort_value": "1543809600",
              "id": "5c08ba7079282518c59f2616"
            },
            {
              "_id": "5c075f3579282518c59f2307",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/03/2018-12/04/2018",
              "sort_value": "1543809600",
              "id": "5c075f3579282518c59f2307"
            },
            {
              "_id": "5c06132b79282518c59f1fdb",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "12/03/2018-12/03/2018",
              "sort_value": "1543809600",
              "id": "5c06132b79282518c59f1fdb"
            },
            {
              "_id": "5c04c8bd79282518c59f1a35",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/26/2018-12/02/2018",
              "sort_value": "1543204800",
              "id": "5c04c8bd79282518c59f1a35"
            },
            {
              "_id": "5c036aeb79282518c59f1521",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/26/2018-12/01/2018",
              "sort_value": "1543204800",
              "id": "5c036aeb79282518c59f1521"
            },
            {
              "_id": "5c02184c79282518c59f130d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/26/2018-11/30/2018",
              "sort_value": "1543204800",
              "id": "5c02184c79282518c59f130d"
            },
            {
              "_id": "5c00b2b079282518c59f104d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/26/2018-11/29/2018",
              "sort_value": "1543204800",
              "id": "5c00b2b079282518c59f104d"
            },
            {
              "_id": "5bff5f0e79282518c59f0dcb",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/26/2018-11/28/2018",
              "sort_value": "1543204800",
              "id": "5bff5f0e79282518c59f0dcb"
            },
            {
              "_id": "5bfe047279282518c59f0b00",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/26/2018-11/27/2018",
              "sort_value": "1543204800",
              "id": "5bfe047279282518c59f0b00"
            },
            {
              "_id": "5bfcc16b79282518c59f078f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/26/2018-11/26/2018",
              "sort_value": "1543204800",
              "id": "5bfcc16b79282518c59f078f"
            },
            {
              "_id": "5bfb793e79282518c59f01e0",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/19/2018-11/25/2018",
              "sort_value": "1542600000",
              "id": "5bfb793e79282518c59f01e0"
            },
            {
              "_id": "5bfa0b1c79282518c59efc0d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/19/2018-11/24/2018",
              "sort_value": "1542600000",
              "id": "5bfa0b1c79282518c59efc0d"
            },
            {
              "_id": "5bf8cf3279282518c59ef9b7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/19/2018-11/23/2018",
              "sort_value": "1542600000",
              "id": "5bf8cf3279282518c59ef9b7"
            },
            {
              "_id": "5bf62f1979282518c59ef713",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/19/2018-11/21/2018",
              "sort_value": "1542600000",
              "id": "5bf62f1979282518c59ef713"
            },
            {
              "_id": "5bf389dc79282518c59ef29e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/19/2018-11/19/2018",
              "sort_value": "1542600000",
              "id": "5bf389dc79282518c59ef29e"
            },
            {
              "_id": "5bf2409f79282518c59eed9f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/12/2018-11/18/2018",
              "sort_value": "1541995200",
              "id": "5bf2409f79282518c59eed9f"
            },
            {
              "_id": "5bf0eada79282518c59eea4e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/12/2018-11/17/2018",
              "sort_value": "1541995200",
              "id": "5bf0eada79282518c59eea4e"
            },
            {
              "_id": "5bef99c379282518c59ee7ce",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/12/2018-11/16/2018",
              "sort_value": "1541995200",
              "id": "5bef99c379282518c59ee7ce"
            },
            {
              "_id": "5bee382179282518c59ee61d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/12/2018-11/15/2018",
              "sort_value": "1541995200",
              "id": "5bee382179282518c59ee61d"
            },
            {
              "_id": "5becf048787dcb61d729a53e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/12/2018-11/14/2018",
              "sort_value": "1541995200",
              "id": "5becf048787dcb61d729a53e"
            },
            {
              "_id": "5beb8924787dcb61d729a134",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/12/2018-11/13/2018",
              "sort_value": "1541995200",
              "id": "5beb8924787dcb61d729a134"
            },
            {
              "_id": "5bea4a05787dcb61d7299f5a",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/12/2018-11/12/2018",
              "sort_value": "1541995200",
              "id": "5bea4a05787dcb61d7299f5a"
            },
            {
              "_id": "5be909c8787dcb61d7299aa6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/05/2018-11/11/2018",
              "sort_value": "1541390400",
              "id": "5be909c8787dcb61d7299aa6"
            },
            {
              "_id": "5be79c36787dcb61d7299704",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/05/2018-11/10/2018",
              "sort_value": "1541390400",
              "id": "5be79c36787dcb61d7299704"
            },
            {
              "_id": "5be6640f787dcb61d72994eb",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/05/2018-11/09/2018",
              "sort_value": "1541390400",
              "id": "5be6640f787dcb61d72994eb"
            },
            {
              "_id": "5be50e0a787dcb61d72993c7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/05/2018-11/08/2018",
              "sort_value": "1541390400",
              "id": "5be50e0a787dcb61d72993c7"
            },
            {
              "_id": "5be3bca4787dcb61d7299152",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/05/2018-11/07/2018",
              "sort_value": "1541390400",
              "id": "5be3bca4787dcb61d7299152"
            },
            {
              "_id": "5be25d4e787dcb61d7298e62",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/05/2018-11/06/2018",
              "sort_value": "1541390400",
              "id": "5be25d4e787dcb61d7298e62"
            },
            {
              "_id": "5be117c0787dcb61d7298c06",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "11/05/2018-11/05/2018",
              "sort_value": "1541390400",
              "id": "5be117c0787dcb61d7298c06"
            },
            {
              "_id": "5bdfcc5c787dcb61d7298510",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/29/2018-11/04/2018",
              "sort_value": "1540785600",
              "id": "5bdfcc5c787dcb61d7298510"
            },
            {
              "_id": "5bde6c56787dcb61d7298110",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/29/2018-11/03/2018",
              "sort_value": "1540785600",
              "id": "5bde6c56787dcb61d7298110"
            },
            {
              "_id": "5bdd1def787dcb61d7297ef6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/29/2018-11/02/2018",
              "sort_value": "1540785600",
              "id": "5bdd1def787dcb61d7297ef6"
            },
            {
              "_id": "5bda79b5787dcb61d7297a31",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/29/2018-10/31/2018",
              "sort_value": "1540785600",
              "id": "5bda79b5787dcb61d7297a31"
            },
            {
              "_id": "5bd933d2787dcb61d7297723",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/29/2018-10/30/2018",
              "sort_value": "1540785600",
              "id": "5bd933d2787dcb61d7297723"
            },
            {
              "_id": "5bd7faed787dcb61d729741e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/29/2018-10/29/2018",
              "sort_value": "1540785600",
              "id": "5bd7faed787dcb61d729741e"
            },
            {
              "_id": "5bd692aa787dcb61d7296ced",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/22/2018-10/28/2018",
              "sort_value": "1540180800",
              "id": "5bd692aa787dcb61d7296ced"
            },
            {
              "_id": "5bd51fe2787dcb61d729693d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/22/2018-10/27/2018",
              "sort_value": "1540180800",
              "id": "5bd51fe2787dcb61d729693d"
            },
            {
              "_id": "5bd3dd03787dcb61d7296755",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/22/2018-10/26/2018",
              "sort_value": "1540180800",
              "id": "5bd3dd03787dcb61d7296755"
            },
            {
              "_id": "5bd28837787dcb61d7296607",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/22/2018-10/25/2018",
              "sort_value": "1540180800",
              "id": "5bd28837787dcb61d7296607"
            },
            {
              "_id": "5bcfeca9787dcb61d72961ba",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/22/2018-10/23/2018",
              "sort_value": "1540180800",
              "id": "5bcfeca9787dcb61d72961ba"
            },
            {
              "_id": "5bcea5c7787dcb61d7295ecd",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/22/2018-10/22/2018",
              "sort_value": "1540180800",
              "id": "5bcea5c7787dcb61d7295ecd"
            },
            {
              "_id": "5bcd5814787dcb61d7295833",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/15/2018-10/21/2018",
              "sort_value": "1539576000",
              "id": "5bcd5814787dcb61d7295833"
            },
            {
              "_id": "5bcbf1ec787dcb61d7295390",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/15/2018-10/20/2018",
              "sort_value": "1539576000",
              "id": "5bcbf1ec787dcb61d7295390"
            },
            {
              "_id": "5bc9616c787dcb61d7294f20",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/15/2018-10/18/2018",
              "sort_value": "1539576000",
              "id": "5bc9616c787dcb61d7294f20"
            },
            {
              "_id": "5bc8075b787dcb61d7294dbf",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/15/2018-10/17/2018",
              "sort_value": "1539576000",
              "id": "5bc8075b787dcb61d7294dbf"
            },
            {
              "_id": "5bc6c2b2787dcb61d7294be4",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/15/2018-10/16/2018",
              "sort_value": "1539576000",
              "id": "5bc6c2b2787dcb61d7294be4"
            },
            {
              "_id": "5bc564c2787dcb61d72948b2",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/15/2018-10/15/2018",
              "sort_value": "1539576000",
              "id": "5bc564c2787dcb61d72948b2"
            },
            {
              "_id": "5bc41f35787dcb61d729424f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/08/2018-10/14/2018",
              "sort_value": "1538971200",
              "id": "5bc41f35787dcb61d729424f"
            },
            {
              "_id": "5bc2b55e787dcb61d7293e93",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/08/2018-10/13/2018",
              "sort_value": "1538971200",
              "id": "5bc2b55e787dcb61d7293e93"
            },
            {
              "_id": "5bc1715b787dcb61d7293d3b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/08/2018-10/12/2018",
              "sort_value": "1538971200",
              "id": "5bc1715b787dcb61d7293d3b"
            },
            {
              "_id": "5bc00df7787dcb61d7293af9",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/08/2018-10/11/2018",
              "sort_value": "1538971200",
              "id": "5bc00df7787dcb61d7293af9"
            },
            {
              "_id": "5bbed46b787dcb61d7293906",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/08/2018-10/10/2018",
              "sort_value": "1538971200",
              "id": "5bbed46b787dcb61d7293906"
            },
            {
              "_id": "5bbd89ba787dcb61d72936bf",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/08/2018-10/09/2018",
              "sort_value": "1538971200",
              "id": "5bbd89ba787dcb61d72936bf"
            },
            {
              "_id": "5bbc2adf787dcb61d7293347",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/08/2018-10/08/2018",
              "sort_value": "1538971200",
              "id": "5bbc2adf787dcb61d7293347"
            },
            {
              "_id": "5bbad462787dcb61d7292c36",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/01/2018-10/07/2018",
              "sort_value": "1538366400",
              "id": "5bbad462787dcb61d7292c36"
            },
            {
              "_id": "5bb99a6d787dcb61d729290f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/01/2018-10/06/2018",
              "sort_value": "1538366400",
              "id": "5bb99a6d787dcb61d729290f"
            },
            {
              "_id": "5bb849f3787dcb61d7292638",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/01/2018-10/05/2018",
              "sort_value": "1538366400",
              "id": "5bb849f3787dcb61d7292638"
            },
            {
              "_id": "5bb6e229787dcb61d72923cc",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/01/2018-10/04/2018",
              "sort_value": "1538366400",
              "id": "5bb6e229787dcb61d72923cc"
            },
            {
              "_id": "5bb58ce7787dcb61d72921eb",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/01/2018-10/03/2018",
              "sort_value": "1538366400",
              "id": "5bb58ce7787dcb61d72921eb"
            },
            {
              "_id": "5bb44e45787dcb61d7291f2b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/01/2018-10/02/2018",
              "sort_value": "1538366400",
              "id": "5bb44e45787dcb61d7291f2b"
            },
            {
              "_id": "5bb2f4f8787dcb61d72919d7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "10/01/2018-10/01/2018",
              "sort_value": "1538366400",
              "id": "5bb2f4f8787dcb61d72919d7"
            },
            {
              "_id": "5bb1a362787dcb61d72911e6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/24/2018-09/30/2018",
              "sort_value": "1537761600",
              "id": "5bb1a362787dcb61d72911e6"
            },
            {
              "_id": "5bb0451e787dcb61d7290e71",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/24/2018-09/29/2018",
              "sort_value": "1537761600",
              "id": "5bb0451e787dcb61d7290e71"
            },
            {
              "_id": "5baf0c88787dcb61d7290c03",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/24/2018-09/28/2018",
              "sort_value": "1537761600",
              "id": "5baf0c88787dcb61d7290c03"
            },
            {
              "_id": "5bad9e24787dcb61d7290883",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/24/2018-09/27/2018",
              "sort_value": "1537761600",
              "id": "5bad9e24787dcb61d7290883"
            },
            {
              "_id": "5bac4f8c787dcb61d7290611",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/24/2018-09/26/2018",
              "sort_value": "1537761600",
              "id": "5bac4f8c787dcb61d7290611"
            },
            {
              "_id": "5bab18b5787dcb61d729037d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/24/2018-09/25/2018",
              "sort_value": "1537761600",
              "id": "5bab18b5787dcb61d729037d"
            },
            {
              "_id": "5ba9cf1d787dcb61d728fe90",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/24/2018-09/24/2018",
              "sort_value": "1537761600",
              "id": "5ba9cf1d787dcb61d728fe90"
            },
            {
              "_id": "5ba86f97787dcb61d728f8b1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/17/2018-09/23/2018",
              "sort_value": "1537156800",
              "id": "5ba86f97787dcb61d728f8b1"
            },
            {
              "_id": "5ba70c64787dcb61d728f432",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/17/2018-09/22/2018",
              "sort_value": "1537156800",
              "id": "5ba70c64787dcb61d728f432"
            },
            {
              "_id": "5ba5b22b787dcb61d728f205",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/17/2018-09/21/2018",
              "sort_value": "1537156800",
              "id": "5ba5b22b787dcb61d728f205"
            },
            {
              "_id": "5ba4ab56787dcb61d728efe7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/17/2018-09/20/2018",
              "sort_value": "1537156800",
              "id": "5ba4ab56787dcb61d728efe7"
            },
            {
              "_id": "5ba304e8787dcb61d728edb1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/17/2018-09/19/2018",
              "sort_value": "1537156800",
              "id": "5ba304e8787dcb61d728edb1"
            },
            {
              "_id": "5b9f2b7e787dcb61d728e289",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/10/2018-09/16/2018",
              "sort_value": "1536552000",
              "id": "5b9f2b7e787dcb61d728e289"
            },
            {
              "_id": "5b9dcc44787dcb61d728dd86",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/10/2018-09/15/2018",
              "sort_value": "1536552000",
              "id": "5b9dcc44787dcb61d728dd86"
            },
            {
              "_id": "5b9caf05787dcb61d728db3f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/10/2018-09/14/2018",
              "sort_value": "1536552000",
              "id": "5b9caf05787dcb61d728db3f"
            },
            {
              "_id": "5b9b2f26787dcb61d728d82b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/10/2018-09/13/2018",
              "sort_value": "1536552000",
              "id": "5b9b2f26787dcb61d728d82b"
            },
            {
              "_id": "5b99e215787dcb61d728d6c9",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/10/2018-09/12/2018",
              "sort_value": "1536552000",
              "id": "5b99e215787dcb61d728d6c9"
            },
            {
              "_id": "5b988fc7787dcb61d728d4cb",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/10/2018-09/11/2018",
              "sort_value": "1536552000",
              "id": "5b988fc7787dcb61d728d4cb"
            },
            {
              "_id": "5b979ecb787dcb61d728d2f6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/10/2018-09/10/2018",
              "sort_value": "1536552000",
              "id": "5b979ecb787dcb61d728d2f6"
            },
            {
              "_id": "5b95fb2a787dcb61d728cd20",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/03/2018-09/09/2018",
              "sort_value": "1535947200",
              "id": "5b95fb2a787dcb61d728cd20"
            },
            {
              "_id": "5b949cc4787dcb61d728c981",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/03/2018-09/08/2018",
              "sort_value": "1535947200",
              "id": "5b949cc4787dcb61d728c981"
            },
            {
              "_id": "5b934b6b787dcb61d728c788",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/03/2018-09/07/2018",
              "sort_value": "1535947200",
              "id": "5b934b6b787dcb61d728c788"
            },
            {
              "_id": "5b922153787dcb61d728c62b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/03/2018-09/06/2018",
              "sort_value": "1535947200",
              "id": "5b922153787dcb61d728c62b"
            },
            {
              "_id": "5b8f513f787dcb61d728c158",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/03/2018-09/04/2018",
              "sort_value": "1535947200",
              "id": "5b8f513f787dcb61d728c158"
            },
            {
              "_id": "5b8dff4b787dcb61d728bf68",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "09/03/2018-09/03/2018",
              "sort_value": "1535947200",
              "id": "5b8dff4b787dcb61d728bf68"
            },
            {
              "_id": "5b8cc6bb787dcb61d728bab7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/27/2018-09/02/2018",
              "sort_value": "1535342400",
              "id": "5b8cc6bb787dcb61d728bab7"
            },
            {
              "_id": "5b8b5c65787dcb61d728b60d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/27/2018-09/01/2018",
              "sort_value": "1535342400",
              "id": "5b8b5c65787dcb61d728b60d"
            },
            {
              "_id": "5b8a0339787dcb61d728b1f6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/27/2018-08/31/2018",
              "sort_value": "1535342400",
              "id": "5b8a0339787dcb61d728b1f6"
            },
            {
              "_id": "5b88bce0787dcb61d728b002",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/27/2018-08/30/2018",
              "sort_value": "1535342400",
              "id": "5b88bce0787dcb61d728b002"
            },
            {
              "_id": "5b875ca6787dcb61d728aca1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/27/2018-09/29/2018",
              "sort_value": "1535342400",
              "id": "5b875ca6787dcb61d728aca1"
            },
            {
              "_id": "5b861d3e787dcb61d728a9c6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/27/2018-08/28/2018",
              "sort_value": "1535342400",
              "id": "5b861d3e787dcb61d728a9c6"
            },
            {
              "_id": "5b84c55b787dcb61d728a65a",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/27/2018-08/27/2018",
              "sort_value": "1535342400",
              "id": "5b84c55b787dcb61d728a65a"
            },
            {
              "_id": "5b8387f9787dcb61d728a0f5",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/20/2018-08/26/2018",
              "sort_value": "1534737600",
              "id": "5b8387f9787dcb61d728a0f5"
            },
            {
              "_id": "5b8220f1787dcb61d7289c3f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/20/2018-08/25/2018",
              "sort_value": "1534737600",
              "id": "5b8220f1787dcb61d7289c3f"
            },
            {
              "_id": "5b80c2b6787dcb61d728980d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/20/2018-08/24/2018",
              "sort_value": "1534737600",
              "id": "5b80c2b6787dcb61d728980d"
            },
            {
              "_id": "5b7f7968787dcb61d7289699",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/20/2018-08/23/2018",
              "sort_value": "1534737600",
              "id": "5b7f7968787dcb61d7289699"
            },
            {
              "_id": "5b7e2b8c787dcb61d72893df",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/20/2018-08/22/2018",
              "sort_value": "1534737600",
              "id": "5b7e2b8c787dcb61d72893df"
            },
            {
              "_id": "5b7ccf71787dcb61d7289144",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/20/2018-08/21/2018",
              "sort_value": "1534737600",
              "id": "5b7ccf71787dcb61d7289144"
            },
            {
              "_id": "5b7b9c18787dcb61d7288f4e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/20/2018-08/20/2018",
              "sort_value": "1534737600",
              "id": "5b7b9c18787dcb61d7288f4e"
            },
            {
              "_id": "5b7a54a9787dcb61d72889f3",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/13/2018-08/19/2018",
              "sort_value": "1534132800",
              "id": "5b7a54a9787dcb61d72889f3"
            },
            {
              "_id": "5b78e51e787dcb61d72882d2",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/13/2018-08/18/2018",
              "sort_value": "1534132800",
              "id": "5b78e51e787dcb61d72882d2"
            },
            {
              "_id": "5b778b39787dcb61d7287f03",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/13/2018-08/17/2018",
              "sort_value": "1534132800",
              "id": "5b778b39787dcb61d7287f03"
            },
            {
              "_id": "5b76391f787dcb61d7287c2d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/13/2018-08/16/2018",
              "sort_value": "1534132800",
              "id": "5b76391f787dcb61d7287c2d"
            },
            {
              "_id": "5b74e5b4787dcb61d72879c0",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/13/2018-08/15/2018",
              "sort_value": "1534132800",
              "id": "5b74e5b4787dcb61d72879c0"
            },
            {
              "_id": "5b73d1ff787dcb61d72877af",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/13/2018-08/14/2018",
              "sort_value": "1534132800",
              "id": "5b73d1ff787dcb61d72877af"
            },
            {
              "_id": "5b713f2e787dcb61d72870a7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/06/2018-08/12/2018",
              "sort_value": "1533528000",
              "id": "5b713f2e787dcb61d72870a7"
            },
            {
              "_id": "5b6fa7dd787dcb61d728671f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/06/2018-08/11/2018",
              "sort_value": "1533528000",
              "id": "5b6fa7dd787dcb61d728671f"
            },
            {
              "_id": "5b6e64fa787dcb61d728644a",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/06/2018-08/10/2018",
              "sort_value": "1533528000",
              "id": "5b6e64fa787dcb61d728644a"
            },
            {
              "_id": "5b6d0688787dcb61d72861c8",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/06/2018-08/09/2018",
              "sort_value": "1533528000",
              "id": "5b6d0688787dcb61d72861c8"
            },
            {
              "_id": "5b6bb9d9787dcb61d7286018",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/06/2018-08/08/2018",
              "sort_value": "1533528000",
              "id": "5b6bb9d9787dcb61d7286018"
            },
            {
              "_id": "5b6a8217787dcb61d7285eec",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/06/2018-08/07/2018",
              "sort_value": "1533528000",
              "id": "5b6a8217787dcb61d7285eec"
            },
            {
              "_id": "5b698cd9787dcb61d7285d48",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "08/06/2018-08/06/2018",
              "sort_value": "1533528000",
              "id": "5b698cd9787dcb61d7285d48"
            },
            {
              "_id": "5b67e5bc787dcb61d7285811",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/30/2018-08/05/2018",
              "sort_value": "1532923200",
              "id": "5b67e5bc787dcb61d7285811"
            },
            {
              "_id": "5b66620c787dcb61d728529c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/30/2018-08/04/2018",
              "sort_value": "1532923200",
              "id": "5b66620c787dcb61d728529c"
            },
            {
              "_id": "5b6547d5787dcb61d7285160",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/30/2018-08/03/2018",
              "sort_value": "1532923200",
              "id": "5b6547d5787dcb61d7285160"
            },
            {
              "_id": "5b640ac3787dcb61d7284f38",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/30/2018-08/02/2018",
              "sort_value": "1532923200",
              "id": "5b640ac3787dcb61d7284f38"
            },
            {
              "_id": "5b62a94e787dcb61d7284d3b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/30/2018-08/01/2018",
              "sort_value": "1532923200",
              "id": "5b62a94e787dcb61d7284d3b"
            },
            {
              "_id": "5b5fd4f7787dcb61d728481e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/30/2018-07/30/2018",
              "sort_value": "1532923200",
              "id": "5b5fd4f7787dcb61d728481e"
            },
            {
              "_id": "5b5eae4b787dcb61d72844bc",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/23/2018-07/29/2018",
              "sort_value": "1532318400",
              "id": "5b5eae4b787dcb61d72844bc"
            },
            {
              "_id": "5b5d2208787dcb61d7284040",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/23/2018-07/28/2018",
              "sort_value": "1532318400",
              "id": "5b5d2208787dcb61d7284040"
            },
            {
              "_id": "5b5bd6bf787dcb61d7283de6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/23/2018-07/27/2018",
              "sort_value": "1532318400",
              "id": "5b5bd6bf787dcb61d7283de6"
            },
            {
              "_id": "5b5a9d95787dcb61d7283b98",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/23/2018-07/26/2018",
              "sort_value": "1532318400",
              "id": "5b5a9d95787dcb61d7283b98"
            },
            {
              "_id": "5b5941d7787dcb61d72839fd",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/23/2018-07/25/2018",
              "sort_value": "1532318400",
              "id": "5b5941d7787dcb61d72839fd"
            },
            {
              "_id": "5b57f6c0787dcb61d728384c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/23/2018-07/24/2018",
              "sort_value": "1532318400",
              "id": "5b57f6c0787dcb61d728384c"
            },
            {
              "_id": "5b56acb0787dcb61d7283557",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/23/2018-07/23/2018",
              "sort_value": "1532318400",
              "id": "5b56acb0787dcb61d7283557"
            },
            {
              "_id": "5b557ba2787dcb61d72831ce",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/16/2018-07/22/2018",
              "sort_value": "1531713600",
              "id": "5b557ba2787dcb61d72831ce"
            },
            {
              "_id": "5b540871787dcb61d7282bc3",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/16/2018-07/21/2018",
              "sort_value": "1531713600",
              "id": "5b540871787dcb61d7282bc3"
            },
            {
              "_id": "5b52d558787dcb61d72829ab",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/16/2018-07/20/2018",
              "sort_value": "1531713600",
              "id": "5b52d558787dcb61d72829ab"
            },
            {
              "_id": "5b51bca0787dcb61d72827ce",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/16/2018-07/19/2018",
              "sort_value": "1531713600",
              "id": "5b51bca0787dcb61d72827ce"
            },
            {
              "_id": "5b502bb4787dcb61d7282550",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/16/2018-07/18/2018",
              "sort_value": "1531713600",
              "id": "5b502bb4787dcb61d7282550"
            },
            {
              "_id": "5b4ee147787dcb61d728237e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/16/2018-07/17/2018",
              "sort_value": "1531713600",
              "id": "5b4ee147787dcb61d728237e"
            },
            {
              "_id": "5b4d91f9787dcb61d72821b5",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/16/2018-07/16/2018",
              "sort_value": "1531713600",
              "id": "5b4d91f9787dcb61d72821b5"
            },
            {
              "_id": "5b4c310c787dcb61d7281cbf",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/09/2018-07/15/2018",
              "sort_value": "1531108800",
              "id": "5b4c310c787dcb61d7281cbf"
            },
            {
              "_id": "5b4add13787dcb61d7281970",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/09/2018-07/14/2018",
              "sort_value": "1531108800",
              "id": "5b4add13787dcb61d7281970"
            },
            {
              "_id": "5b497c21787dcb61d72817f5",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/09/2018-07/13/2018",
              "sort_value": "1531108800",
              "id": "5b497c21787dcb61d72817f5"
            },
            {
              "_id": "5b4836ad787dcb61d72816f1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/09/2018-07/12/2018",
              "sort_value": "1531108800",
              "id": "5b4836ad787dcb61d72816f1"
            },
            {
              "_id": "5b46df67787dcb61d72815eb",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/09/2018-07/11/2018",
              "sort_value": "1531108800",
              "id": "5b46df67787dcb61d72815eb"
            },
            {
              "_id": "5b458a0a787dcb61d728145d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/09/2018-07/10/2018",
              "sort_value": "1531108800",
              "id": "5b458a0a787dcb61d728145d"
            },
            {
              "_id": "5b444052787dcb61d7281159",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/09/2018-07/09/2018",
              "sort_value": "1531108800",
              "id": "5b444052787dcb61d7281159"
            },
            {
              "_id": "5b42f82e787dcb61d7280d73",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/02/2018-07/08/2018",
              "sort_value": "1530504000",
              "id": "5b42f82e787dcb61d7280d73"
            },
            {
              "_id": "5b419595787dcb61d7280a17",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/02/2018-07/07/2018",
              "sort_value": "1530504000",
              "id": "5b419595787dcb61d7280a17"
            },
            {
              "_id": "5b408528787dcb61d728089d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/02/2018-07/06/2018",
              "sort_value": "1530504000",
              "id": "5b408528787dcb61d728089d"
            },
            {
              "_id": "5b3ef8c6787dcb61d72805a9",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/02/2018-07/05/2018",
              "sort_value": "1530504000",
              "id": "5b3ef8c6787dcb61d72805a9"
            },
            {
              "_id": "5b3daacb787dcb61d7280402",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/02/2018-07/04/2018",
              "sort_value": "1530504000",
              "id": "5b3daacb787dcb61d7280402"
            },
            {
              "_id": "5b3c5606787dcb61d72802a3",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/02/2018-07/03/2018",
              "sort_value": "1530504000",
              "id": "5b3c5606787dcb61d72802a3"
            },
            {
              "_id": "5b3b0768787dcb61d727ffd3",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "07/02/2018-07/02/2018",
              "sort_value": "1530504000",
              "id": "5b3b0768787dcb61d727ffd3"
            },
            {
              "_id": "5b39c3a0787dcb61d727fa53",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/25/2018-07/01/2018",
              "sort_value": "1529899200",
              "id": "5b39c3a0787dcb61d727fa53"
            },
            {
              "_id": "5b385825787dcb61d727f43f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/25/2018-06/30/2018",
              "sort_value": "1529899200",
              "id": "5b385825787dcb61d727f43f"
            },
            {
              "_id": "5b371c3e787dcb61d727f2c1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/25/2018-06/29/2018",
              "sort_value": "1529899200",
              "id": "5b371c3e787dcb61d727f2c1"
            },
            {
              "_id": "5b35b285787dcb61d727f0da",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/25/2018-06/28/2018",
              "sort_value": "1529899200",
              "id": "5b35b285787dcb61d727f0da"
            },
            {
              "_id": "5b3461b6787dcb61d727ece0",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/25/2018-06/27/2018",
              "sort_value": "1529899200",
              "id": "5b3461b6787dcb61d727ece0"
            },
            {
              "_id": "5b331866787dcb61d727e979",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/25/2018-06/26/2018",
              "sort_value": "1529899200",
              "id": "5b331866787dcb61d727e979"
            },
            {
              "_id": "5b31d20f787dcb61d727e600",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/25/2018-06/25/2018",
              "sort_value": "1529899200",
              "id": "5b31d20f787dcb61d727e600"
            },
            {
              "_id": "5b307966787dcb61d727de58",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/18/2018-06/24/2018",
              "sort_value": "1529294400",
              "id": "5b307966787dcb61d727de58"
            },
            {
              "_id": "5b2f279f787dcb61d727d9b4",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/18/2018-06/23/2018",
              "sort_value": "1529294400",
              "id": "5b2f279f787dcb61d727d9b4"
            },
            {
              "_id": "5b2dd730787dcb61d727d54b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/18/2018-06/22/2018",
              "sort_value": "1529294400",
              "id": "5b2dd730787dcb61d727d54b"
            },
            {
              "_id": "5b2c7fc6787dcb61d727d234",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/18/2018-06/21/2018",
              "sort_value": "1529294400",
              "id": "5b2c7fc6787dcb61d727d234"
            },
            {
              "_id": "5b2b25f0787dcb61d727cef8",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/18/2018-06/20/2018",
              "sort_value": "1529294400",
              "id": "5b2b25f0787dcb61d727cef8"
            },
            {
              "_id": "5b29d567787dcb61d727cc60",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/18/2018-06/19/2018",
              "sort_value": "1529294400",
              "id": "5b29d567787dcb61d727cc60"
            },
            {
              "_id": "5b289b85787dcb61d727c8a6",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/18/2018-06/18/2018",
              "sort_value": "1529294400",
              "id": "5b289b85787dcb61d727c8a6"
            },
            {
              "_id": "5b27403f787dcb61d727c018",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/11/2018-06/17/2018",
              "sort_value": "1528689600",
              "id": "5b27403f787dcb61d727c018"
            },
            {
              "_id": "5b25de37787dcb61d727b7da",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/11/2018-06/16/2018",
              "sort_value": "1528689600",
              "id": "5b25de37787dcb61d727b7da"
            },
            {
              "_id": "5b248dc9787dcb61d727afd5",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/11/2018-06/15/2018",
              "sort_value": "1528689600",
              "id": "5b248dc9787dcb61d727afd5"
            },
            {
              "_id": "5b235534787dcb61d727a8f8",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/11/2018-06/14/2018",
              "sort_value": "1528689600",
              "id": "5b235534787dcb61d727a8f8"
            },
            {
              "_id": "5b22137c787dcb61d727a0a0",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/11/2018-06/13/2018",
              "sort_value": "1528689600",
              "id": "5b22137c787dcb61d727a0a0"
            },
            {
              "_id": "5b211d5c787dcb61d7279e7f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/11/2018-06/12/2018",
              "sort_value": "1528689600",
              "id": "5b211d5c787dcb61d7279e7f"
            },
            {
              "_id": "5b1f6540787dcb61d7279acf",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/11/2018-06/11/2018",
              "sort_value": "1528689600",
              "id": "5b1f6540787dcb61d7279acf"
            },
            {
              "_id": "5b1e0f82787dcb61d7279740",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/04/2018-06/10/2018",
              "sort_value": "1528084800",
              "id": "5b1e0f82787dcb61d7279740"
            },
            {
              "_id": "5b1cb233787dcb61d727941c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/04/2018-06/09/2018",
              "sort_value": "1528084800",
              "id": "5b1cb233787dcb61d727941c"
            },
            {
              "_id": "5b1b58c4787dcb61d72792a4",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/04/2018-06/08/2018",
              "sort_value": "1528084800",
              "id": "5b1b58c4787dcb61d72792a4"
            },
            {
              "_id": "5b1a00dd787dcb61d72790d5",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/04/2018-06/07/2018",
              "sort_value": "1528084800",
              "id": "5b1a00dd787dcb61d72790d5"
            },
            {
              "_id": "5b18b5a0787dcb61d7278fa7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/04/2018-06/06/2018",
              "sort_value": "1528084800",
              "id": "5b18b5a0787dcb61d7278fa7"
            },
            {
              "_id": "5b175dbd787dcb61d7278e47",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/04/2018-06/05/2018",
              "sort_value": "1528084800",
              "id": "5b175dbd787dcb61d7278e47"
            },
            {
              "_id": "5b1633e4787dcb61d7278c2f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "06/04/2018-06/04/2018",
              "sort_value": "1528084800",
              "id": "5b1633e4787dcb61d7278c2f"
            },
            {
              "_id": "5b14c8d3787dcb61d72787a9",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/28/2018-06/03/2018",
              "sort_value": "1527480000",
              "id": "5b14c8d3787dcb61d72787a9"
            },
            {
              "_id": "5b13c42e787dcb61d7278516",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/28/2018-06/02/2018",
              "sort_value": "1527480000",
              "id": "5b13c42e787dcb61d7278516"
            },
            {
              "_id": "5b123d5c787dcb61d727833c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/28/2018-06/01/2018",
              "sort_value": "1527480000",
              "id": "5b123d5c787dcb61d727833c"
            },
            {
              "_id": "5b10e68d787dcb61d7278192",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/28/2018-05/31/2018",
              "sort_value": "1527480000",
              "id": "5b10e68d787dcb61d7278192"
            },
            {
              "_id": "5b0fb494787dcb61d7278094",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/28/2018-05/30/2018",
              "sort_value": "1527480000",
              "id": "5b0fb494787dcb61d7278094"
            },
            {
              "_id": "5b0e74b1787dcb61d7277e77",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/28/2018-05/29/2018",
              "sort_value": "1527480000",
              "id": "5b0e74b1787dcb61d7277e77"
            },
            {
              "_id": "5b0cfaa3787dcb61d7277c28",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/28/2018-05/28/2018",
              "sort_value": "1527480000",
              "id": "5b0cfaa3787dcb61d7277c28"
            },
            {
              "_id": "5b0b8738787dcb61d7277591",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/21/2018-05/27/2018",
              "sort_value": "1526875200",
              "id": "5b0b8738787dcb61d7277591"
            },
            {
              "_id": "5b0a4491787dcb61d7277289",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/21/2018-05/26/2018",
              "sort_value": "1526875200",
              "id": "5b0a4491787dcb61d7277289"
            },
            {
              "_id": "5b091e20787dcb61d72770cb",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/21/2018-05/25/2018",
              "sort_value": "1526875200",
              "id": "5b091e20787dcb61d72770cb"
            },
            {
              "_id": "5b07b343787dcb61d7276f0b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/21/2018-05/24/2018",
              "sort_value": "1526875200",
              "id": "5b07b343787dcb61d7276f0b"
            },
            {
              "_id": "5b066b09787dcb61d7276dac",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/21/2018-05/23/2018",
              "sort_value": "1526875200",
              "id": "5b066b09787dcb61d7276dac"
            },
            {
              "_id": "5b051dad787dcb61d7276c2c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/21/2018-05/22/2018",
              "sort_value": "1526875200",
              "id": "5b051dad787dcb61d7276c2c"
            },
            {
              "_id": "5b03f20c787dcb61d7276a19",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/21/2018-05/21/2018",
              "sort_value": "1526875200",
              "id": "5b03f20c787dcb61d7276a19"
            },
            {
              "_id": "5b025c6d787dcb61d72763f9",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/14/2018-05/20/2018",
              "sort_value": "1526270400",
              "id": "5b025c6d787dcb61d72763f9"
            },
            {
              "_id": "5b011ab4787dcb61d727615c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/14/2018-05/19/2018",
              "sort_value": "1526270400",
              "id": "5b011ab4787dcb61d727615c"
            },
            {
              "_id": "5affc5e9787dcb61d7275f8b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/14/2018-05/18/2018",
              "sort_value": "1526270400",
              "id": "5affc5e9787dcb61d7275f8b"
            },
            {
              "_id": "5afe71e0787dcb61d7275eae",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/14/2018-05/17/2018",
              "sort_value": "1526270400",
              "id": "5afe71e0787dcb61d7275eae"
            },
            {
              "_id": "5afd100a787dcb61d7275da1",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/14/2018-05/16/2018",
              "sort_value": "1526270400",
              "id": "5afd100a787dcb61d7275da1"
            },
            {
              "_id": "5afbbf73787dcb61d7275bcf",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/14/2018-05/15/2018",
              "sort_value": "1526270400",
              "id": "5afbbf73787dcb61d7275bcf"
            },
            {
              "_id": "5afa5d29787dcb61d72759a7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/14/2018-05/14/2018",
              "sort_value": "1526270400",
              "id": "5afa5d29787dcb61d72759a7"
            },
            {
              "_id": "5af9187e787dcb61d72756be",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/07/2018-05/13/2018",
              "sort_value": "1525665600",
              "id": "5af9187e787dcb61d72756be"
            },
            {
              "_id": "5af7cb26787dcb61d727546f",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/07/2018-05/12/2018",
              "sort_value": "1525665600",
              "id": "5af7cb26787dcb61d727546f"
            },
            {
              "_id": "5af6b838787dcb61d727539e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/07/2018-05/11/2018",
              "sort_value": "1525665600",
              "id": "5af6b838787dcb61d727539e"
            },
            {
              "_id": "5af52684787dcb61d7275278",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/07/2018-05/10/2018",
              "sort_value": "1525665600",
              "id": "5af52684787dcb61d7275278"
            },
            {
              "_id": "5af3fa13787dcb61d7275150",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/07/2018-05/09/2018",
              "sort_value": "1525665600",
              "id": "5af3fa13787dcb61d7275150"
            },
            {
              "_id": "5af27feb787dcb61d7274f53",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/07/2018-05/08/2018",
              "sort_value": "1525665600",
              "id": "5af27feb787dcb61d7274f53"
            },
            {
              "_id": "5af12f92787dcb61d7274d25",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "05/07/2018-05/07/2018",
              "sort_value": "1525665600",
              "id": "5af12f92787dcb61d7274d25"
            },
            {
              "_id": "5aefded0787dcb61d727499c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/30/2018-05/06/2018",
              "sort_value": "1525060800",
              "id": "5aefded0787dcb61d727499c"
            },
            {
              "_id": "5aee8f86787dcb61d72747f0",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/30/2018-05/05/2018",
              "sort_value": "1525060800",
              "id": "5aee8f86787dcb61d72747f0"
            },
            {
              "_id": "5aed4065787dcb61d727462b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/30/2018-05/04/2018",
              "sort_value": "1525060800",
              "id": "5aed4065787dcb61d727462b"
            },
            {
              "_id": "5aebf0ae787dcb61d7274510",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/30/2018-05/03/2018",
              "sort_value": "1525060800",
              "id": "5aebf0ae787dcb61d7274510"
            },
            {
              "_id": "5aeaa473787dcb61d7274426",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/30/2018-05/02/2018",
              "sort_value": "1525060800",
              "id": "5aeaa473787dcb61d7274426"
            },
            {
              "_id": "5ae96c4f787dcb61d7274283",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/30/2018-05/01/2018",
              "sort_value": "1525060800",
              "id": "5ae96c4f787dcb61d7274283"
            },
            {
              "_id": "5ae7f9e0787dcb61d72740e7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/30/2018-04/30/2018",
              "sort_value": "1525060800",
              "id": "5ae7f9e0787dcb61d72740e7"
            },
            {
              "_id": "5ae6a69d787dcb61d7273dfe",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/23/2018-04/29/2018",
              "sort_value": "1524456000",
              "id": "5ae6a69d787dcb61d7273dfe"
            },
            {
              "_id": "5ae55a91787dcb61d7273c7b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/23/2018-04/28/2018",
              "sort_value": "1524456000",
              "id": "5ae55a91787dcb61d7273c7b"
            },
            {
              "_id": "5ae3f40f787dcb61d7273b06",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/23/2018-04/27/2018",
              "sort_value": "1524456000",
              "id": "5ae3f40f787dcb61d7273b06"
            },
            {
              "_id": "5ae2a71d787dcb61d7273842",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/23/2018-04/26/2018",
              "sort_value": "1524456000",
              "id": "5ae2a71d787dcb61d7273842"
            },
            {
              "_id": "5adbfef5787dcb61d7272ba0",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/16/2018-04/22/2018",
              "sort_value": "1523851200",
              "id": "5adbfef5787dcb61d7272ba0"
            },
            {
              "_id": "5ad42a3e787dcb61d7271f5c",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/09/2018-04/15/2018",
              "sort_value": "1523246400",
              "id": "5ad42a3e787dcb61d7271f5c"
            },
            {
              "_id": "5acaede7787dcb61d7270cd7",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "04/02/2018-04/08/2018",
              "sort_value": "1522641600",
              "id": "5acaede7787dcb61d7270cd7"
            },
            {
              "_id": "5ac1bedf787dcb61d726fa3e",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/26/2018-04/01/2018",
              "sort_value": "1522036800",
              "id": "5ac1bedf787dcb61d726fa3e"
            },
            {
              "_id": "5ab1df10787dcb61d726df1b",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/19/2018-03/25/2018",
              "sort_value": "1521432000",
              "id": "5ab1df10787dcb61d726df1b"
            },
            {
              "_id": "5aa75193787dcb61d726ca7d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/12/2018-03/18/2018",
              "sort_value": "1520827200",
              "id": "5aa75193787dcb61d726ca7d"
            },
            {
              "_id": "5a9e204866532955a0c5acf4",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "03/05/2018-03/11/2018",
              "sort_value": "1520222400",
              "id": "5a9e204866532955a0c5acf4"
            },
            {
              "_id": "5a94ec9966532955a0c59bbf",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/26/2018-03/04/2018",
              "sort_value": "1519617600",
              "id": "5a94ec9966532955a0c59bbf"
            },
            {
              "_id": "5a8ba8d166532955a0c5903d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/19/2018-02/25/2018",
              "sort_value": "1519012800",
              "id": "5a8ba8d166532955a0c5903d"
            },
            {
              "_id": "5a828b470d50cba657b9feec",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/12/2018-02/18/2018",
              "sort_value": "1518408000",
              "id": "5a828b470d50cba657b9feec"
            },
            {
              "_id": "5a79324c0d50cba657b9f40d",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "02/05/2018-02/11/2018",
              "sort_value": "1517803200",
              "id": "5a79324c0d50cba657b9f40d"
            },
            {
              "_id": "5a6ff58320fd7e9eb445e303",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/29/2018-02/04/2018",
              "sort_value": "1517198400",
              "id": "5a6ff58320fd7e9eb445e303"
            },
            {
              "_id": "5a66b93520fd7e9eb445d498",
              "__v": 0,
              "uid": "5959f8e8ed885dade01090dd",
              "is_exported": false,
              "chuky": "01/22/2018-01/28/2018",
              "sort_value": "1516593600",
              "id": "5a66b93520fd7e9eb445d498"
            }
          ],
          "total": 18
        },
        isFetching: _get(state, 'ReportReducer.isFetching', false),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCyclePage: pagination => dispatch(getCyclePage(pagination)),
        getReport: (post, itemActive) => dispatch(getReport(post, itemActive)),
        getReportByBanker: (post, itemActive) => dispatch(getReportByBanker(post, itemActive)),
        getReportByMember: (post, itemActive) => dispatch(getReportByMember(post, itemActive)),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(ReportListContainer);