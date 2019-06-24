import React, { Component, Fragment } from 'react';
import Proptypes from 'prop-types';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const propTypes = {
    total: Proptypes.number,
    perPage: Proptypes.number,
    currentPage: Proptypes.number,
};
const defaultProps = {
    total: 0,
    perPage: 1,
    currentPage: 1,
};

class PaginationComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: this.props.currentPage,
        };
    }

    handleClick = (e, currentPage) => {
        e.preventDefault();

        this.setState({
            currentPage,
        }, () => {
            return this.props.onClickPage(currentPage);
        });
    };

    renderItem() {
        const { total, perPage } = this.props;
        const currentPage = this.state.currentPage;
        const totalPage = Math.ceil(total/perPage);
        const itemElement = [];

        if (totalPage < 2) {
            return null;
        }

        for (let i = 1; i <= totalPage; i++) {
            itemElement.push(
                <PaginationItem key={i} active={currentPage === i}>
                    <PaginationLink href="/" onClick={e => this.handleClick(e, i)}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return (
            <Fragment>
                <PaginationItem>
                    <PaginationLink first href="/" onClick={e => this.handleClick(e, 1)} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        previous href="#"
                        onClick={
                            e => this.handleClick(e, currentPage <= 1 ? 1 : (currentPage - 1))
                        }
                    />
                </PaginationItem>
                {itemElement}
                <PaginationItem>
                    <PaginationLink
                        next href="#"
                        onClick={
                            e => this.handleClick(e, currentPage >= totalPage ? totalPage : (currentPage + 1))
                        }
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink last href="#" onClick={e => this.handleClick(e, totalPage)} />
                </PaginationItem>
            </Fragment>
        );
    }

    render() {
        return (
            <Pagination aria-label="Page navigation example">
                {this.renderItem()}
            </Pagination>
        );
    }
}

PaginationComponent.propTypes = propTypes;
PaginationComponent.defaultProps = defaultProps;

export default PaginationComponent;