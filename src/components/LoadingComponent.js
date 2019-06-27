import React, { Component } from 'react';
import 'my-styles/loading-inside-component.css';

class LoadingComponent extends Component {
    render() {
        return (
            <div className="wrap-loader-inside-component">
                <div className="loading">
                    <h2>Loading...</h2>
                    <span /><span /><span /><span /><span /><span /><span />
                </div>
            </div>
        );
    }
}

export default LoadingComponent;