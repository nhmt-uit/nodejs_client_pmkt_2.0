import React, { Component } from 'react';

class Footer extends Component {
    render() {
        console.log("render Footer")
        return (
            <div className="page-footer">
                <div className="page-footer-inner">
                    2019 © VW3 Application
                </div>
                <div className="scroll-to-top">
                    <i className="icon-arrow-up" />
                </div>
            </div>
        );
    }
}

export default Footer;