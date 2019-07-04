import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class FormulaModalContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen
        };
    }

    static propTypes = {
        isOpen: PropTypes.bool,
        onToggle: PropTypes.func,
    }

    static defaultProps = {
        isOpen: false,
    };
    
    handleToggle = () => {
        return this.props.onToggle();
    }

    render() {
        const { className, header, body, footer, isOpen, ...otherProps } = this.props;
        let headerElm = header ? <ModalHeader toggle={this.handleToggle}>{ header }</ModalHeader> : null;
        let bodyElm = body ? <ModalBody>{body}</ModalBody> : null;
        let footerElm = footer ? <ModalFooter> { footer } </ModalFooter> : null;

        return (
            <Modal {...otherProps} isOpen={isOpen} toggle={this.handleToggle} className={className}>
                { headerElm }
                { bodyElm }
                { footerElm }
            </Modal>
        )
    }
}
