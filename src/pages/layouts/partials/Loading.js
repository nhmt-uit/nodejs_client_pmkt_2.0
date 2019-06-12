import React, { Component } from 'react';

import 'my-styles/loading.css';

class Loading extends Component {
    render() {
        return (
            <div className="wrap-loader">
                <div className="loading">
                    <h2>Loading...</h2>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        );
    }
}

export default Loading;