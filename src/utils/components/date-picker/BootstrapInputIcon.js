import React, { Component } from 'react';

class BootstrapInputIcon extends Component {
    render() {
        return (
            <div className="input-group">
                <input
                    className="form-control"
                    onClick={this.props.onClick}
                    value={this.props.value}
                    type="text"
                    readOnly={true}
                />
                <span className="input-group-addon" onClick={this.props.onClick}> <i className="fa fa-calendar"></i> </span>
            </div>
        )
    }
}

export default BootstrapInputIcon;