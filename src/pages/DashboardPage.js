import React, { Component } from 'react';

import { QuickAtivitiesContainer, CommentContainer } from "my-containers/dashboard"

import { SocketService } from 'my-utils/core';
class DashboardPage extends Component {
    constructor(props) {
        super(props)
        
        SocketService.connect('/accountant')
        SocketService.send('init', {username: "av8899"})
    let args = {
            from_date: "06/01/2019",
            to_date: "06/16/2019",
            id: "5acc5a9f787dcb61d72711ef",
            more_post: {login_name: "av8899"}
        }
        SocketService.send('scan', args)

        SocketService.get('message').then(res => {

            console.log(res)
        })
    }
    render() {
        return (
            <section>
                <QuickAtivitiesContainer />
                <div className="row widget-row">
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading">Total User</h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-green icon-user" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-subtitle">USD</span>
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value="7,644">0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading">Total Tickets</h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-red icon-layers" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-subtitle">USD</span>
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value="1,293">0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading">Last week win/lose</h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-purple icon-screen-desktop" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-subtitle">USD</span>
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value={815}>0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading">Last week income</h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-purple icon-screen-desktop" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-subtitle">USD</span>
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value={815}>0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                </div>

                <div className="row">
                    <CommentContainer />
                    <CommentContainer />
                </div>
            </section>
        );
    }
}

export default DashboardPage;