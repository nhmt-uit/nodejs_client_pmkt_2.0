import React, { Component, Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import { ListGroupItem, Collapse, ListGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { get as _get, cloneDeep } from 'lodash';

import { getCyclePage } from 'my-actions/ReportAction';

class ReportListContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 1,
            itemPerPage: 10,
            collapse: {},
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

    recursiveItem(item, id) {
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
                            <span className="icon-close float-right color-red" />
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
                    { this.recursiveItem(child, id) }
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
                {this.recursiveItem(cycle, cycle.id)}
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
                    &nbsp;&nbsp;<a href="https://google.com" target="_blank">{cycle.name}</a>
                    <span className="float-right" >
                        {
                            cycle.is_exported
                                ? <i className="fa fa-check-circle font-green" />
                                : <i className="fa fa-exchange font-green" />
                        }
                        &nbsp;&nbsp;<span className="icon-close color-red" />
                    </span>

                    { collapseElement }
                </div>
            </ListGroupItem>
        );
    }

    render() {
        const { t, cyclePage } = this.props;console.log('render******');
        // const cycleList = cyclePage.data || {};
        const cycleList = {
            "5cbdaa252d62da4c464a2e19": {
                "id": "5cbdaa252d62da4c464a2e19",
                "name": "04/22/2019-04/28/2019",
                "sort_value": "1555905600",
                "is_exported": true,
                "level": 0,
                "expend": false,
                "child": {
                    "accounting": {
                        "id": "5cbdaa252d62da4c464a2e19",
                        "name": "Accounting",
                        "level": 1,
                        "expend": false,
                        "child": {
                            "56850ba0097802b9f23929b0": {
                                "id": "56850ba0097802b9f23929b0",
                                "name": "loto",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929c5": {
                                        "id": "56850ba0097802b9f23929c5",
                                        "name": "ld789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LF95SUB77": {
                                                "id": "LF95SUB77",
                                                "name": "LF95SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF96SUB77": {
                                                "id": "LF96SUB77",
                                                "name": "LF96SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LC04SUB05": {
                                                "id": "LC04SUB05",
                                                "name": "LC04SUB05",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LDASUB01": {
                                                "id": "LDASUB01",
                                                "name": "LDASUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK63SUB01": {
                                                "id": "LK63SUB01",
                                                "name": "LK63SUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH88DHD01": {
                                                "id": "LH88DHD01",
                                                "name": "LH88DHD01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH50D04SUB06": {
                                                "id": "LH50D04SUB06",
                                                "name": "LH50D04SUB06",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH59SUB02": {
                                                "id": "LH59SUB02",
                                                "name": "LH59SUB02",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c0": {
                                        "id": "56850ba0097802b9f23929c0",
                                        "name": "new789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "DAV68SUB78": {
                                                "id": "DAV68SUB78",
                                                "name": "DAV68SUB78",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "5913c714b0e6c7ca64ce5320": {
                                        "id": "5913c714b0e6c7ca64ce5320",
                                        "name": "ldbong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LDB1477": {
                                                "id": "LDB1477",
                                                "name": "LDB1477",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c8": {
                                        "id": "56850ba0097802b9f23929c8",
                                        "name": "vn868",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "RMD": {
                                                "id": "RMD",
                                                "name": "RMD",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ad": {
                                "id": "56850ba0097802b9f23929ad",
                                "name": "sportsbook",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b1": {
                                        "id": "56850ba0097802b9f23929b1",
                                        "name": "bong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DTE19": {
                                                "id": "DTE19",
                                                "name": "DTE19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF11": {
                                                "id": "DTF11",
                                                "name": "DTF11",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "SDE4": {
                                                "id": "SDE4",
                                                "name": "SDE4",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE20": {
                                                "id": "DTE20",
                                                "name": "DTE20",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE17": {
                                                "id": "DTE17",
                                                "name": "DTE17",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF72": {
                                                "id": "DTF72",
                                                "name": "DTF72",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE21": {
                                                "id": "DTE21",
                                                "name": "DTE21",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE18": {
                                                "id": "DTE18",
                                                "name": "DTE18",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF96": {
                                                "id": "DTF96",
                                                "name": "DTF96",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTA19": {
                                                "id": "DTA19",
                                                "name": "DTA19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF113": {
                                                "id": "DTF113",
                                                "name": "DTF113",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b3": {
                                        "id": "56850ba0097802b9f23929b3",
                                        "name": "3in1bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DY": {
                                                "id": "DY",
                                                "name": "DY",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DW": {
                                                "id": "DW",
                                                "name": "DW",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MQCA": {
                                                "id": "MQCA",
                                                "name": "MQCA",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b2": {
                                        "id": "56850ba0097802b9f23929b2",
                                        "name": "sbobet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "MGU": {
                                                "id": "MGU",
                                                "name": "MGU",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "M15J": {
                                                "id": "M15J",
                                                "name": "M15J",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b4": {
                                        "id": "56850ba0097802b9f23929b4",
                                        "name": "332bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "67BK": {
                                                "id": "67BK",
                                                "name": "67BK",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ae": {
                                "id": "56850ba0097802b9f23929ae",
                                "name": "other",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929ca": {
                                        "id": "56850ba0097802b9f23929ca",
                                        "name": "sv388",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ae",
                                        "child": {
                                            "MMDD": {
                                                "id": "MMDD",
                                                "name": "MMDD",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929af": {
                                "id": "56850ba0097802b9f23929af",
                                "name": "casino",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b5": {
                                        "id": "56850ba0097802b9f23929b5",
                                        "name": "sgd777",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "BTS368X1": {
                                                "id": "BTS368X1",
                                                "name": "BTS368X1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c6": {
                                        "id": "56850ba0097802b9f23929c6",
                                        "name": "edy688",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "ATX1": {
                                                "id": "ATX1",
                                                "name": "ATX1",
                                                "is_exported": true,
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
            "5cc6e3b12d62da4c464a4a89": {
                "id": "5cc6e3b12d62da4c464a4a89",
                "name": "04/29/2019-05/05/2019",
                "sort_value": "1556510400",
                "is_exported": true,
                "level": 0,
                "expend": false,
                "child": {
                    "accounting": {
                        "id": "5cc6e3b12d62da4c464a4a89",
                        "name": "Accounting",
                        "level": 1,
                        "expend": false,
                        "child": {
                            "56850ba0097802b9f23929ad": {
                                "id": "56850ba0097802b9f23929ad",
                                "name": "sportsbook",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b3": {
                                        "id": "56850ba0097802b9f23929b3",
                                        "name": "3in1bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DY": {
                                                "id": "DY",
                                                "name": "DY",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DW": {
                                                "id": "DW",
                                                "name": "DW",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "G1": {
                                                "id": "G1",
                                                "name": "G1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MQCA": {
                                                "id": "MQCA",
                                                "name": "MQCA",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b1": {
                                        "id": "56850ba0097802b9f23929b1",
                                        "name": "bong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DTE19": {
                                                "id": "DTE19",
                                                "name": "DTE19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF11": {
                                                "id": "DTF11",
                                                "name": "DTF11",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE21": {
                                                "id": "DTE21",
                                                "name": "DTE21",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "SDE4": {
                                                "id": "SDE4",
                                                "name": "SDE4",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE18": {
                                                "id": "DTE18",
                                                "name": "DTE18",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE17": {
                                                "id": "DTE17",
                                                "name": "DTE17",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTA19": {
                                                "id": "DTA19",
                                                "name": "DTA19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF72": {
                                                "id": "DTF72",
                                                "name": "DTF72",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE20": {
                                                "id": "DTE20",
                                                "name": "DTE20",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF96": {
                                                "id": "DTF96",
                                                "name": "DTF96",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF113": {
                                                "id": "DTF113",
                                                "name": "DTF113",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "TV42Y2": {
                                                "id": "TV42Y2",
                                                "name": "TV42Y2",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b4": {
                                        "id": "56850ba0097802b9f23929b4",
                                        "name": "332bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "67BK": {
                                                "id": "67BK",
                                                "name": "67BK",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b2": {
                                        "id": "56850ba0097802b9f23929b2",
                                        "name": "sbobet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "M15J": {
                                                "id": "M15J",
                                                "name": "M15J",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MGU": {
                                                "id": "MGU",
                                                "name": "MGU",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ae": {
                                "id": "56850ba0097802b9f23929ae",
                                "name": "other",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929ca": {
                                        "id": "56850ba0097802b9f23929ca",
                                        "name": "sv388",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ae",
                                        "child": {
                                            "MMDD": {
                                                "id": "MMDD",
                                                "name": "MMDD",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929b0": {
                                "id": "56850ba0097802b9f23929b0",
                                "name": "loto",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929c5": {
                                        "id": "56850ba0097802b9f23929c5",
                                        "name": "ld789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LC04SUB05": {
                                                "id": "LC04SUB05",
                                                "name": "LC04SUB05",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF95SUB77": {
                                                "id": "LF95SUB77",
                                                "name": "LF95SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF96SUB77": {
                                                "id": "LF96SUB77",
                                                "name": "LF96SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK91DUA13SUB66": {
                                                "id": "LK91DUA13SUB66",
                                                "name": "LK91DUA13SUB66",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LDASUB01": {
                                                "id": "LDASUB01",
                                                "name": "LDASUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH59SUB02": {
                                                "id": "LH59SUB02",
                                                "name": "LH59SUB02",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK63SUB01": {
                                                "id": "LK63SUB01",
                                                "name": "LK63SUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH50D04SUB06": {
                                                "id": "LH50D04SUB06",
                                                "name": "LH50D04SUB06",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c0": {
                                        "id": "56850ba0097802b9f23929c0",
                                        "name": "new789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "DAV68SUB78": {
                                                "id": "DAV68SUB78",
                                                "name": "DAV68SUB78",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "5913c714b0e6c7ca64ce5320": {
                                        "id": "5913c714b0e6c7ca64ce5320",
                                        "name": "ldbong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LDB1477": {
                                                "id": "LDB1477",
                                                "name": "LDB1477",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c8": {
                                        "id": "56850ba0097802b9f23929c8",
                                        "name": "vn868",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "RMD": {
                                                "id": "RMD",
                                                "name": "RMD",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929af": {
                                "id": "56850ba0097802b9f23929af",
                                "name": "casino",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b5": {
                                        "id": "56850ba0097802b9f23929b5",
                                        "name": "sgd777",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "BTS368X1": {
                                                "id": "BTS368X1",
                                                "name": "BTS368X1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c6": {
                                        "id": "56850ba0097802b9f23929c6",
                                        "name": "edy688",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "ATX1": {
                                                "id": "ATX1",
                                                "name": "ATX1",
                                                "is_exported": true,
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
            "5cd024bb2d62da4c464a6591": {
                "id": "5cd024bb2d62da4c464a6591",
                "name": "05/06/2019-05/12/2019",
                "sort_value": "1557115200",
                "is_exported": true,
                "level": 0,
                "expend": false,
                "child": {
                    "accounting": {
                        "id": "5cd024bb2d62da4c464a6591",
                        "name": "Accounting",
                        "level": 1,
                        "expend": false,
                        "child": {
                            "56850ba0097802b9f23929b0": {
                                "id": "56850ba0097802b9f23929b0",
                                "name": "loto",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929c5": {
                                        "id": "56850ba0097802b9f23929c5",
                                        "name": "ld789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LF95SUB77": {
                                                "id": "LF95SUB77",
                                                "name": "LF95SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LC04SUB05": {
                                                "id": "LC04SUB05",
                                                "name": "LC04SUB05",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH59SUB02": {
                                                "id": "LH59SUB02",
                                                "name": "LH59SUB02",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF96SUB77": {
                                                "id": "LF96SUB77",
                                                "name": "LF96SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LDASUB01": {
                                                "id": "LDASUB01",
                                                "name": "LDASUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK63SUB01": {
                                                "id": "LK63SUB01",
                                                "name": "LK63SUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH88DHD01": {
                                                "id": "LH88DHD01",
                                                "name": "LH88DHD01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH50D04SUB06": {
                                                "id": "LH50D04SUB06",
                                                "name": "LH50D04SUB06",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c0": {
                                        "id": "56850ba0097802b9f23929c0",
                                        "name": "new789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "DAV68SUB78": {
                                                "id": "DAV68SUB78",
                                                "name": "DAV68SUB78",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "5913c714b0e6c7ca64ce5320": {
                                        "id": "5913c714b0e6c7ca64ce5320",
                                        "name": "ldbong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LDB1477": {
                                                "id": "LDB1477",
                                                "name": "LDB1477",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c8": {
                                        "id": "56850ba0097802b9f23929c8",
                                        "name": "vn868",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "RMD": {
                                                "id": "RMD",
                                                "name": "RMD",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ad": {
                                "id": "56850ba0097802b9f23929ad",
                                "name": "sportsbook",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b1": {
                                        "id": "56850ba0097802b9f23929b1",
                                        "name": "bong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DTE17": {
                                                "id": "DTE17",
                                                "name": "DTE17",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF11": {
                                                "id": "DTF11",
                                                "name": "DTF11",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE19": {
                                                "id": "DTE19",
                                                "name": "DTE19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE18": {
                                                "id": "DTE18",
                                                "name": "DTE18",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE20": {
                                                "id": "DTE20",
                                                "name": "DTE20",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF72": {
                                                "id": "DTF72",
                                                "name": "DTF72",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "SDE4": {
                                                "id": "SDE4",
                                                "name": "SDE4",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF113": {
                                                "id": "DTF113",
                                                "name": "DTF113",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE21": {
                                                "id": "DTE21",
                                                "name": "DTE21",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTA19": {
                                                "id": "DTA19",
                                                "name": "DTA19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "AZ50E": {
                                                "id": "AZ50E",
                                                "name": "AZ50E",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF96": {
                                                "id": "DTF96",
                                                "name": "DTF96",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b3": {
                                        "id": "56850ba0097802b9f23929b3",
                                        "name": "3in1bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DY": {
                                                "id": "DY",
                                                "name": "DY",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DW": {
                                                "id": "DW",
                                                "name": "DW",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "G1": {
                                                "id": "G1",
                                                "name": "G1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MQCA": {
                                                "id": "MQCA",
                                                "name": "MQCA",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b4": {
                                        "id": "56850ba0097802b9f23929b4",
                                        "name": "332bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "67BK": {
                                                "id": "67BK",
                                                "name": "67BK",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b2": {
                                        "id": "56850ba0097802b9f23929b2",
                                        "name": "sbobet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "M15J": {
                                                "id": "M15J",
                                                "name": "M15J",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MGU": {
                                                "id": "MGU",
                                                "name": "MGU",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929af": {
                                "id": "56850ba0097802b9f23929af",
                                "name": "casino",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b5": {
                                        "id": "56850ba0097802b9f23929b5",
                                        "name": "sgd777",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "BTS368X1": {
                                                "id": "BTS368X1",
                                                "name": "BTS368X1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c6": {
                                        "id": "56850ba0097802b9f23929c6",
                                        "name": "edy688",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "ATX1": {
                                                "id": "ATX1",
                                                "name": "ATX1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ae": {
                                "id": "56850ba0097802b9f23929ae",
                                "name": "other",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929ca": {
                                        "id": "56850ba0097802b9f23929ca",
                                        "name": "sv388",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ae",
                                        "child": {
                                            "MMDD": {
                                                "id": "MMDD",
                                                "name": "MMDD",
                                                "is_exported": true,
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
            "5cda595eef400554d323248c": {
                "id": "5cda595eef400554d323248c",
                "name": "05/13/2019-05/19/2019",
                "sort_value": "1557720000",
                "is_exported": true,
                "level": 0,
                "expend": false,
                "child": {
                    "accounting": {
                        "id": "5cda595eef400554d323248c",
                        "name": "Accounting",
                        "level": 1,
                        "expend": false,
                        "child": {
                            "56850ba0097802b9f23929ad": {
                                "id": "56850ba0097802b9f23929ad",
                                "name": "sportsbook",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b1": {
                                        "id": "56850ba0097802b9f23929b1",
                                        "name": "bong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "SDE4": {
                                                "id": "SDE4",
                                                "name": "SDE4",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE20": {
                                                "id": "DTE20",
                                                "name": "DTE20",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE19": {
                                                "id": "DTE19",
                                                "name": "DTE19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE18": {
                                                "id": "DTE18",
                                                "name": "DTE18",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF11": {
                                                "id": "DTF11",
                                                "name": "DTF11",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTA19": {
                                                "id": "DTA19",
                                                "name": "DTA19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE17": {
                                                "id": "DTE17",
                                                "name": "DTE17",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF96": {
                                                "id": "DTF96",
                                                "name": "DTF96",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "AZ50E": {
                                                "id": "AZ50E",
                                                "name": "AZ50E",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF113": {
                                                "id": "DTF113",
                                                "name": "DTF113",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE21": {
                                                "id": "DTE21",
                                                "name": "DTE21",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF72": {
                                                "id": "DTF72",
                                                "name": "DTF72",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "TVVB93": {
                                                "id": "TVVB93",
                                                "name": "TVVB93",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b3": {
                                        "id": "56850ba0097802b9f23929b3",
                                        "name": "3in1bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DY": {
                                                "id": "DY",
                                                "name": "DY",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "G1": {
                                                "id": "G1",
                                                "name": "G1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DW": {
                                                "id": "DW",
                                                "name": "DW",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MQCA": {
                                                "id": "MQCA",
                                                "name": "MQCA",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "HTES": {
                                                "id": "HTES",
                                                "name": "HTES",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b4": {
                                        "id": "56850ba0097802b9f23929b4",
                                        "name": "332bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "67BK": {
                                                "id": "67BK",
                                                "name": "67BK",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b2": {
                                        "id": "56850ba0097802b9f23929b2",
                                        "name": "sbobet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "M15J": {
                                                "id": "M15J",
                                                "name": "M15J",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MGU": {
                                                "id": "MGU",
                                                "name": "MGU",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929b0": {
                                "id": "56850ba0097802b9f23929b0",
                                "name": "loto",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929c5": {
                                        "id": "56850ba0097802b9f23929c5",
                                        "name": "ld789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LC04SUB05": {
                                                "id": "LC04SUB05",
                                                "name": "LC04SUB05",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF95SUB77": {
                                                "id": "LF95SUB77",
                                                "name": "LF95SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF96SUB77": {
                                                "id": "LF96SUB77",
                                                "name": "LF96SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH59SUB02": {
                                                "id": "LH59SUB02",
                                                "name": "LH59SUB02",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LDASUB01": {
                                                "id": "LDASUB01",
                                                "name": "LDASUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK63SUB01": {
                                                "id": "LK63SUB01",
                                                "name": "LK63SUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH88DHD01": {
                                                "id": "LH88DHD01",
                                                "name": "LH88DHD01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH50D04SUB06": {
                                                "id": "LH50D04SUB06",
                                                "name": "LH50D04SUB06",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c0": {
                                        "id": "56850ba0097802b9f23929c0",
                                        "name": "new789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "DAV68SUB78": {
                                                "id": "DAV68SUB78",
                                                "name": "DAV68SUB78",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c8": {
                                        "id": "56850ba0097802b9f23929c8",
                                        "name": "vn868",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "RMD": {
                                                "id": "RMD",
                                                "name": "RMD",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "5913c714b0e6c7ca64ce5320": {
                                        "id": "5913c714b0e6c7ca64ce5320",
                                        "name": "ldbong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LDB1477": {
                                                "id": "LDB1477",
                                                "name": "LDB1477",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ae": {
                                "id": "56850ba0097802b9f23929ae",
                                "name": "other",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929ca": {
                                        "id": "56850ba0097802b9f23929ca",
                                        "name": "sv388",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ae",
                                        "child": {
                                            "MMDD": {
                                                "id": "MMDD",
                                                "name": "MMDD",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929af": {
                                "id": "56850ba0097802b9f23929af",
                                "name": "casino",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b5": {
                                        "id": "56850ba0097802b9f23929b5",
                                        "name": "sgd777",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "BTS368X1": {
                                                "id": "BTS368X1",
                                                "name": "BTS368X1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c6": {
                                        "id": "56850ba0097802b9f23929c6",
                                        "name": "edy688",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "ATX1": {
                                                "id": "ATX1",
                                                "name": "ATX1",
                                                "is_exported": true,
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
            "5ce2693cef400554d3233ff2": {
                "id": "5ce2693cef400554d3233ff2",
                "name": "05/20/2019-05/26/2019",
                "sort_value": "1558324800",
                "is_exported": true,
                "level": 0,
                "expend": false,
                "child": {
                    "accounting": {
                        "id": "5ce2693cef400554d3233ff2",
                        "name": "Accounting",
                        "level": 1,
                        "expend": false,
                        "child": {
                            "56850ba0097802b9f23929ad": {
                                "id": "56850ba0097802b9f23929ad",
                                "name": "sportsbook",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b1": {
                                        "id": "56850ba0097802b9f23929b1",
                                        "name": "bong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DTE19": {
                                                "id": "DTE19",
                                                "name": "DTE19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "SDE4": {
                                                "id": "SDE4",
                                                "name": "SDE4",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF11": {
                                                "id": "DTF11",
                                                "name": "DTF11",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE20": {
                                                "id": "DTE20",
                                                "name": "DTE20",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE21": {
                                                "id": "DTE21",
                                                "name": "DTE21",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF113": {
                                                "id": "DTF113",
                                                "name": "DTF113",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "AZ50E": {
                                                "id": "AZ50E",
                                                "name": "AZ50E",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF72": {
                                                "id": "DTF72",
                                                "name": "DTF72",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE18": {
                                                "id": "DTE18",
                                                "name": "DTE18",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE17": {
                                                "id": "DTE17",
                                                "name": "DTE17",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "TVVB93": {
                                                "id": "TVVB93",
                                                "name": "TVVB93",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTA19": {
                                                "id": "DTA19",
                                                "name": "DTA19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF96": {
                                                "id": "DTF96",
                                                "name": "DTF96",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF39": {
                                                "id": "DTF39",
                                                "name": "DTF39",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b3": {
                                        "id": "56850ba0097802b9f23929b3",
                                        "name": "3in1bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DY": {
                                                "id": "DY",
                                                "name": "DY",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DW": {
                                                "id": "DW",
                                                "name": "DW",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "G1": {
                                                "id": "G1",
                                                "name": "G1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MQCA": {
                                                "id": "MQCA",
                                                "name": "MQCA",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "HTES": {
                                                "id": "HTES",
                                                "name": "HTES",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b4": {
                                        "id": "56850ba0097802b9f23929b4",
                                        "name": "332bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "67BK": {
                                                "id": "67BK",
                                                "name": "67BK",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b2": {
                                        "id": "56850ba0097802b9f23929b2",
                                        "name": "sbobet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "MGU": {
                                                "id": "MGU",
                                                "name": "MGU",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "M15J": {
                                                "id": "M15J",
                                                "name": "M15J",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929b0": {
                                "id": "56850ba0097802b9f23929b0",
                                "name": "loto",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929c0": {
                                        "id": "56850ba0097802b9f23929c0",
                                        "name": "new789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "DAV68SUB78": {
                                                "id": "DAV68SUB78",
                                                "name": "DAV68SUB78",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c5": {
                                        "id": "56850ba0097802b9f23929c5",
                                        "name": "ld789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LC04SUB05": {
                                                "id": "LC04SUB05",
                                                "name": "LC04SUB05",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF95SUB77": {
                                                "id": "LF95SUB77",
                                                "name": "LF95SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK63SUB01": {
                                                "id": "LK63SUB01",
                                                "name": "LK63SUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF96SUB77": {
                                                "id": "LF96SUB77",
                                                "name": "LF96SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LDASUB01": {
                                                "id": "LDASUB01",
                                                "name": "LDASUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH59SUB02": {
                                                "id": "LH59SUB02",
                                                "name": "LH59SUB02",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH88DHD01": {
                                                "id": "LH88DHD01",
                                                "name": "LH88DHD01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH50D04SUB06": {
                                                "id": "LH50D04SUB06",
                                                "name": "LH50D04SUB06",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "5913c714b0e6c7ca64ce5320": {
                                        "id": "5913c714b0e6c7ca64ce5320",
                                        "name": "ldbong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LDB1477": {
                                                "id": "LDB1477",
                                                "name": "LDB1477",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c8": {
                                        "id": "56850ba0097802b9f23929c8",
                                        "name": "vn868",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "RMD": {
                                                "id": "RMD",
                                                "name": "RMD",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ae": {
                                "id": "56850ba0097802b9f23929ae",
                                "name": "other",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929ca": {
                                        "id": "56850ba0097802b9f23929ca",
                                        "name": "sv388",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ae",
                                        "child": {
                                            "MMDD": {
                                                "id": "MMDD",
                                                "name": "MMDD",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929af": {
                                "id": "56850ba0097802b9f23929af",
                                "name": "casino",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b5": {
                                        "id": "56850ba0097802b9f23929b5",
                                        "name": "sgd777",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "BTS368X1": {
                                                "id": "BTS368X1",
                                                "name": "BTS368X1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c6": {
                                        "id": "56850ba0097802b9f23929c6",
                                        "name": "edy688",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "ATX1": {
                                                "id": "ATX1",
                                                "name": "ATX1",
                                                "is_exported": true,
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
            "5cebc959ef400554d3235b5e": {
                "id": "5cebc959ef400554d3235b5e",
                "name": "05/27/2019-06/02/2019",
                "sort_value": "1558929600",
                "is_exported": true,
                "level": 0,
                "expend": false,
                "child": {
                    "accounting": {
                        "id": "5cebc959ef400554d3235b5e",
                        "name": "Accounting",
                        "level": 1,
                        "expend": false,
                        "child": {
                            "56850ba0097802b9f23929b0": {
                                "id": "56850ba0097802b9f23929b0",
                                "name": "loto",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929c5": {
                                        "id": "56850ba0097802b9f23929c5",
                                        "name": "ld789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LF95SUB77": {
                                                "id": "LF95SUB77",
                                                "name": "LF95SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK63SUB01": {
                                                "id": "LK63SUB01",
                                                "name": "LK63SUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LC04SUB05": {
                                                "id": "LC04SUB05",
                                                "name": "LC04SUB05",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF96SUB77": {
                                                "id": "LF96SUB77",
                                                "name": "LF96SUB77",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH59SUB02": {
                                                "id": "LH59SUB02",
                                                "name": "LH59SUB02",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH50D04SUB06": {
                                                "id": "LH50D04SUB06",
                                                "name": "LH50D04SUB06",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK91DUA13SUB66": {
                                                "id": "LK91DUA13SUB66",
                                                "name": "LK91DUA13SUB66",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH88DHD01": {
                                                "id": "LH88DHD01",
                                                "name": "LH88DHD01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LDASUB01": {
                                                "id": "LDASUB01",
                                                "name": "LDASUB01",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c0": {
                                        "id": "56850ba0097802b9f23929c0",
                                        "name": "new789",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "DAV68SUB78": {
                                                "id": "DAV68SUB78",
                                                "name": "DAV68SUB78",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "5913c714b0e6c7ca64ce5320": {
                                        "id": "5913c714b0e6c7ca64ce5320",
                                        "name": "ldbong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LDB1477": {
                                                "id": "LDB1477",
                                                "name": "LDB1477",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c8": {
                                        "id": "56850ba0097802b9f23929c8",
                                        "name": "vn868",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "RMD": {
                                                "id": "RMD",
                                                "name": "RMD",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ad": {
                                "id": "56850ba0097802b9f23929ad",
                                "name": "sportsbook",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b3": {
                                        "id": "56850ba0097802b9f23929b3",
                                        "name": "3in1bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DY": {
                                                "id": "DY",
                                                "name": "DY",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "G1": {
                                                "id": "G1",
                                                "name": "G1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DW": {
                                                "id": "DW",
                                                "name": "DW",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MQCA": {
                                                "id": "MQCA",
                                                "name": "MQCA",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "HTES": {
                                                "id": "HTES",
                                                "name": "HTES",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b1": {
                                        "id": "56850ba0097802b9f23929b1",
                                        "name": "bong88",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DTE18": {
                                                "id": "DTE18",
                                                "name": "DTE18",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE20": {
                                                "id": "DTE20",
                                                "name": "DTE20",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "SDE4": {
                                                "id": "SDE4",
                                                "name": "SDE4",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE19": {
                                                "id": "DTE19",
                                                "name": "DTE19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF11": {
                                                "id": "DTF11",
                                                "name": "DTF11",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE21": {
                                                "id": "DTE21",
                                                "name": "DTE21",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF72": {
                                                "id": "DTF72",
                                                "name": "DTF72",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF113": {
                                                "id": "DTF113",
                                                "name": "DTF113",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF39": {
                                                "id": "DTF39",
                                                "name": "DTF39",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE17": {
                                                "id": "DTE17",
                                                "name": "DTE17",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "AZ50E": {
                                                "id": "AZ50E",
                                                "name": "AZ50E",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF96": {
                                                "id": "DTF96",
                                                "name": "DTF96",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTA19": {
                                                "id": "DTA19",
                                                "name": "DTA19",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b2": {
                                        "id": "56850ba0097802b9f23929b2",
                                        "name": "sbobet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "MGU": {
                                                "id": "MGU",
                                                "name": "MGU",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            },
                                            "M15J": {
                                                "id": "M15J",
                                                "name": "M15J",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b4": {
                                        "id": "56850ba0097802b9f23929b4",
                                        "name": "332bet",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "67BK": {
                                                "id": "67BK",
                                                "name": "67BK",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929af": {
                                "id": "56850ba0097802b9f23929af",
                                "name": "casino",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929c6": {
                                        "id": "56850ba0097802b9f23929c6",
                                        "name": "edy688",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "ATX1": {
                                                "id": "ATX1",
                                                "name": "ATX1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b5": {
                                        "id": "56850ba0097802b9f23929b5",
                                        "name": "sgd777",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "BTS368X1": {
                                                "id": "BTS368X1",
                                                "name": "BTS368X1",
                                                "is_exported": true,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ae": {
                                "id": "56850ba0097802b9f23929ae",
                                "name": "other",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929ca": {
                                        "id": "56850ba0097802b9f23929ca",
                                        "name": "sv388",
                                        "is_exported": true,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ae",
                                        "child": {
                                            "MMDD": {
                                                "id": "MMDD",
                                                "name": "MMDD",
                                                "is_exported": true,
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
            "5cf50782ef400554d323788c": {
                "id": "5cf50782ef400554d323788c",
                "name": "06/03/2019-06/09/2019",
                "sort_value": "1559534400",
                "is_exported": false,
                "level": 0,
                "expend": false,
                "child": {
                    "accounting": {
                        "id": "5cf50782ef400554d323788c",
                        "name": "Accounting",
                        "level": 1,
                        "expend": false,
                        "child": {
                            "56850ba0097802b9f23929b0": {
                                "id": "56850ba0097802b9f23929b0",
                                "name": "loto",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929c5": {
                                        "id": "56850ba0097802b9f23929c5",
                                        "name": "ld789",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LF95SUB77": {
                                                "id": "LF95SUB77",
                                                "name": "LF95SUB77",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF96SUB77": {
                                                "id": "LF96SUB77",
                                                "name": "LF96SUB77",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH59SUB02": {
                                                "id": "LH59SUB02",
                                                "name": "LH59SUB02",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK91DUA13SUB66": {
                                                "id": "LK91DUA13SUB66",
                                                "name": "LK91DUA13SUB66",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH50D04SUB06": {
                                                "id": "LH50D04SUB06",
                                                "name": "LH50D04SUB06",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LC04SUB05": {
                                                "id": "LC04SUB05",
                                                "name": "LC04SUB05",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK63SUB01": {
                                                "id": "LK63SUB01",
                                                "name": "LK63SUB01",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH88DHD01": {
                                                "id": "LH88DHD01",
                                                "name": "LH88DHD01",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c0": {
                                        "id": "56850ba0097802b9f23929c0",
                                        "name": "new789",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "DAV68SUB78": {
                                                "id": "DAV68SUB78",
                                                "name": "DAV68SUB78",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "5913c714b0e6c7ca64ce5320": {
                                        "id": "5913c714b0e6c7ca64ce5320",
                                        "name": "ldbong88",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LDB1477": {
                                                "id": "LDB1477",
                                                "name": "LDB1477",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c8": {
                                        "id": "56850ba0097802b9f23929c8",
                                        "name": "vn868",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "RMD": {
                                                "id": "RMD",
                                                "name": "RMD",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ad": {
                                "id": "56850ba0097802b9f23929ad",
                                "name": "sportsbook",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b1": {
                                        "id": "56850ba0097802b9f23929b1",
                                        "name": "bong88",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DTE19": {
                                                "id": "DTE19",
                                                "name": "DTE19",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "AZ50E": {
                                                "id": "AZ50E",
                                                "name": "AZ50E",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE20": {
                                                "id": "DTE20",
                                                "name": "DTE20",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "SDE4": {
                                                "id": "SDE4",
                                                "name": "SDE4",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF113": {
                                                "id": "DTF113",
                                                "name": "DTF113",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF11": {
                                                "id": "DTF11",
                                                "name": "DTF11",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE18": {
                                                "id": "DTE18",
                                                "name": "DTE18",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE17": {
                                                "id": "DTE17",
                                                "name": "DTE17",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE21": {
                                                "id": "DTE21",
                                                "name": "DTE21",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF96": {
                                                "id": "DTF96",
                                                "name": "DTF96",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF39": {
                                                "id": "DTF39",
                                                "name": "DTF39",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF72": {
                                                "id": "DTF72",
                                                "name": "DTF72",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTA19": {
                                                "id": "DTA19",
                                                "name": "DTA19",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b3": {
                                        "id": "56850ba0097802b9f23929b3",
                                        "name": "3in1bet",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DW": {
                                                "id": "DW",
                                                "name": "DW",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DY": {
                                                "id": "DY",
                                                "name": "DY",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "HTES": {
                                                "id": "HTES",
                                                "name": "HTES",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "G1": {
                                                "id": "G1",
                                                "name": "G1",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MQCA": {
                                                "id": "MQCA",
                                                "name": "MQCA",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b2": {
                                        "id": "56850ba0097802b9f23929b2",
                                        "name": "sbobet",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "M15J": {
                                                "id": "M15J",
                                                "name": "M15J",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MGU": {
                                                "id": "MGU",
                                                "name": "MGU",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b4": {
                                        "id": "56850ba0097802b9f23929b4",
                                        "name": "332bet",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "67BK": {
                                                "id": "67BK",
                                                "name": "67BK",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
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
                                            "ATX1": {
                                                "id": "ATX1",
                                                "name": "ATX1",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b5": {
                                        "id": "56850ba0097802b9f23929b5",
                                        "name": "sgd777",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "BTS368X1": {
                                                "id": "BTS368X1",
                                                "name": "BTS368X1",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ae": {
                                "id": "56850ba0097802b9f23929ae",
                                "name": "other",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929ca": {
                                        "id": "56850ba0097802b9f23929ca",
                                        "name": "sv388",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ae",
                                        "child": {
                                            "MMDD": {
                                                "id": "MMDD",
                                                "name": "MMDD",
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
            "5cfe4456ef400554d32394c3": {
                "id": "5cfe4456ef400554d32394c3",
                "name": "06/10/2019-06/16/2019",
                "sort_value": "1560139200",
                "is_exported": false,
                "level": 0,
                "expend": false,
                "child": {
                    "accounting": {
                        "id": "5cfe4456ef400554d32394c3",
                        "name": "Accounting",
                        "level": 1,
                        "expend": false,
                        "child": {
                            "56850ba0097802b9f23929ad": {
                                "id": "56850ba0097802b9f23929ad",
                                "name": "sportsbook",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b1": {
                                        "id": "56850ba0097802b9f23929b1",
                                        "name": "bong88",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DTE18": {
                                                "id": "DTE18",
                                                "name": "DTE18",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF113": {
                                                "id": "DTF113",
                                                "name": "DTF113",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE19": {
                                                "id": "DTE19",
                                                "name": "DTE19",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "SDE4": {
                                                "id": "SDE4",
                                                "name": "SDE4",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE21": {
                                                "id": "DTE21",
                                                "name": "DTE21",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE20": {
                                                "id": "DTE20",
                                                "name": "DTE20",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "AZ50E": {
                                                "id": "AZ50E",
                                                "name": "AZ50E",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTE17": {
                                                "id": "DTE17",
                                                "name": "DTE17",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF11": {
                                                "id": "DTF11",
                                                "name": "DTF11",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTA19": {
                                                "id": "DTA19",
                                                "name": "DTA19",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF39": {
                                                "id": "DTF39",
                                                "name": "DTF39",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF96": {
                                                "id": "DTF96",
                                                "name": "DTF96",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DTF72": {
                                                "id": "DTF72",
                                                "name": "DTF72",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b3": {
                                        "id": "56850ba0097802b9f23929b3",
                                        "name": "3in1bet",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DY": {
                                                "id": "DY",
                                                "name": "DY",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "G1": {
                                                "id": "G1",
                                                "name": "G1",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DW": {
                                                "id": "DW",
                                                "name": "DW",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "MQCA": {
                                                "id": "MQCA",
                                                "name": "MQCA",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "HTES": {
                                                "id": "HTES",
                                                "name": "HTES",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b2": {
                                        "id": "56850ba0097802b9f23929b2",
                                        "name": "sbobet",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "MGU": {
                                                "id": "MGU",
                                                "name": "MGU",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "M15J": {
                                                "id": "M15J",
                                                "name": "M15J",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b4": {
                                        "id": "56850ba0097802b9f23929b4",
                                        "name": "332bet",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "67BK": {
                                                "id": "67BK",
                                                "name": "67BK",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929ae": {
                                "id": "56850ba0097802b9f23929ae",
                                "name": "other",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929ca": {
                                        "id": "56850ba0097802b9f23929ca",
                                        "name": "sv388",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ae",
                                        "child": {
                                            "MMDD": {
                                                "id": "MMDD",
                                                "name": "MMDD",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929b0": {
                                "id": "56850ba0097802b9f23929b0",
                                "name": "loto",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "5913c714b0e6c7ca64ce5320": {
                                        "id": "5913c714b0e6c7ca64ce5320",
                                        "name": "ldbong88",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LDB1477": {
                                                "id": "LDB1477",
                                                "name": "LDB1477",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c5": {
                                        "id": "56850ba0097802b9f23929c5",
                                        "name": "ld789",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LF96SUB77": {
                                                "id": "LF96SUB77",
                                                "name": "LF96SUB77",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH59SUB02": {
                                                "id": "LH59SUB02",
                                                "name": "LH59SUB02",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF95SUB77": {
                                                "id": "LF95SUB77",
                                                "name": "LF95SUB77",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LC04SUB05": {
                                                "id": "LC04SUB05",
                                                "name": "LC04SUB05",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH88DHD01": {
                                                "id": "LH88DHD01",
                                                "name": "LH88DHD01",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK63SUB01": {
                                                "id": "LK63SUB01",
                                                "name": "LK63SUB01",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK91DUA13SUB66": {
                                                "id": "LK91DUA13SUB66",
                                                "name": "LK91DUA13SUB66",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH50D04SUB06": {
                                                "id": "LH50D04SUB06",
                                                "name": "LH50D04SUB06",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c0": {
                                        "id": "56850ba0097802b9f23929c0",
                                        "name": "new789",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "DAV68SUB78": {
                                                "id": "DAV68SUB78",
                                                "name": "DAV68SUB78",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c8": {
                                        "id": "56850ba0097802b9f23929c8",
                                        "name": "vn868",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "RMD": {
                                                "id": "RMD",
                                                "name": "RMD",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
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
                                            "BTS368X1": {
                                                "id": "BTS368X1",
                                                "name": "BTS368X1",
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
                                            "ATX1": {
                                                "id": "ATX1",
                                                "name": "ATX1",
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
            "5d0b61ad07e665edfe28027e": {
                "id": "5d0b61ad07e665edfe28027e",
                "name": "06/17/2019-06/23/2019",
                "sort_value": "1560744000",
                "is_exported": false,
                "level": 0,
                "expend": false,
                "child": {
                    "accounting": {
                        "id": "5d0b61ad07e665edfe28027e",
                        "name": "Accounting",
                        "level": 1,
                        "expend": false,
                        "child": {
                            "56850ba0097802b9f23929ad": {
                                "id": "56850ba0097802b9f23929ad",
                                "name": "sportsbook",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b3": {
                                        "id": "56850ba0097802b9f23929b3",
                                        "name": "3in1bet",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "DW": {
                                                "id": "DW",
                                                "name": "DW",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "G1": {
                                                "id": "G1",
                                                "name": "G1",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "DY": {
                                                "id": "DY",
                                                "name": "DY",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "HTES": {
                                                "id": "HTES",
                                                "name": "HTES",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b4": {
                                        "id": "56850ba0097802b9f23929b4",
                                        "name": "332bet",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "67BK": {
                                                "id": "67BK",
                                                "name": "67BK",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
                            "56850ba0097802b9f23929b0": {
                                "id": "56850ba0097802b9f23929b0",
                                "name": "loto",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929c5": {
                                        "id": "56850ba0097802b9f23929c5",
                                        "name": "ld789",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "LF96SUB77": {
                                                "id": "LF96SUB77",
                                                "name": "LF96SUB77",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LF95SUB77": {
                                                "id": "LF95SUB77",
                                                "name": "LF95SUB77",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LC04SUB05": {
                                                "id": "LC04SUB05",
                                                "name": "LC04SUB05",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH59SUB02": {
                                                "id": "LH59SUB02",
                                                "name": "LH59SUB02",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LK63SUB01": {
                                                "id": "LK63SUB01",
                                                "name": "LK63SUB01",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH88DHD01": {
                                                "id": "LH88DHD01",
                                                "name": "LH88DHD01",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            },
                                            "LH50D04SUB06": {
                                                "id": "LH50D04SUB06",
                                                "name": "LH50D04SUB06",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c8": {
                                        "id": "56850ba0097802b9f23929c8",
                                        "name": "vn868",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "RMD": {
                                                "id": "RMD",
                                                "name": "RMD",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929c0": {
                                        "id": "56850ba0097802b9f23929c0",
                                        "name": "new789",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929b0",
                                        "child": {
                                            "DAV68SUB78": {
                                                "id": "DAV68SUB78",
                                                "name": "DAV68SUB78",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    }
                                }
                            },
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
                                            "ATX1": {
                                                "id": "ATX1",
                                                "name": "ATX1",
                                                "is_exported": false,
                                                "level": 4,
                                                "child": null
                                            }
                                        }
                                    },
                                    "56850ba0097802b9f23929b5": {
                                        "id": "56850ba0097802b9f23929b5",
                                        "name": "sgd777",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929af",
                                        "child": {
                                            "BTS368X1": {
                                                "id": "BTS368X1",
                                                "name": "BTS368X1",
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
            "5d0b629707e665edfe28027f": {
                "id": "5d0b629707e665edfe28027f",
                "name": "06/20/2019-06/20/2019",
                "sort_value": "1561003200",
                "is_exported": false,
                "level": 0,
                "expend": false,
                "child": {
                    "accounting": {
                        "id": "5d0b629707e665edfe28027f",
                        "name": "Accounting",
                        "level": 1,
                        "expend": false,
                        "child": {
                            "56850ba0097802b9f23929ad": {
                                "id": "56850ba0097802b9f23929ad",
                                "name": "sportsbook",
                                "level": 2,
                                "expend": false,
                                "child": {
                                    "56850ba0097802b9f23929b4": {
                                        "id": "56850ba0097802b9f23929b4",
                                        "name": "332bet",
                                        "is_exported": false,
                                        "level": 3,
                                        "is_banker": true,
                                        "book_id": "56850ba0097802b9f23929ad",
                                        "child": {
                                            "67BK": {
                                                "id": "67BK",
                                                "name": "67BK",
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
        };

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
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        cyclePage: _get(state, 'ReportReducer.cyclePage', {}),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCyclePage: pagination => dispatch(getCyclePage(pagination)),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(ReportListContainer);