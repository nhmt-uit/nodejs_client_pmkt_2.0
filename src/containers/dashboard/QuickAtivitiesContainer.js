import React, { Component } from 'react';

export default class QuickAtivitiesContainer extends Component {
    render() {
        return (
            <div className="portlet light bordered text-center">
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-settings font-green-sharp" />
                        <span className="caption-subject font-green-sharp bold uppercase">Quick Activities</span>
                    </div>
                </div>
                <div className="portlet-body">
                    <a href="index.html" className="icon-btn">
                        <i className="fa fa-plus" />
                        <div> Add more </div>
                    </a>
                    <a href="index.html" className="icon-btn">
                        <i className="fa fa-list" />
                        <div> Report </div>
                    </a>
                    <a href="index.html" className="icon-btn">
                        <i className="fa fa-usd" />
                        <div> Win / Lose </div>
                    </a>
                    <a href="index.html" className="icon-btn">
                        <i className="fa fa-server" />
                        <div> Outstanding </div>
                        <span className="badge badge-success"> 4 </span>
                    </a>
                    <a href="index.html" className="icon-btn">
                        <i className="fa fa-calculator" />
                        <div> Accountant </div>
                        <span className="badge badge-info"> 12 </span>
                    </a>
                </div>
            </div>
        );
    }
}
