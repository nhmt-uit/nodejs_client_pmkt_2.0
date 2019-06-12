import React, { Component } from 'react';

class Breadcrumb extends Component {
    render() {
        return (
            <div className="page-bar" style={{marginBottom: 20}}>
                <ul className="page-breadcrumb">
                    <li>
                        <span>Home</span>
                        <i className="fa fa-circle" />
                    </li>
                </ul>
            </div>

        );
    }
}

export default Breadcrumb;