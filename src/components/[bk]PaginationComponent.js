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

        let elementEllipsis = [];
        let elementFirst = [];
        let elementSecond = [];
        
        if (totalPage > 1) {
            elementSecond = [
                <PaginationItem active={currentPage === totalPage - 1}>
                    <PaginationLink href="/" onClick={e => this.handleClick(e, totalPage - 1)}>
                        {totalPage - 1}
                    </PaginationLink>
                </PaginationItem>,
                <PaginationItem active={currentPage === totalPage}>
                    <PaginationLink href="/" onClick={e => this.handleClick(e, totalPage)}>
                        {totalPage}
                    </PaginationLink>
                </PaginationItem>
            ];
            elementEllipsis = [(
                <PaginationItem >
                    <PaginationLink href="/" >
                    ...
                    </PaginationLink>
                </PaginationItem>
            )];

            for (let i = 1; i < 3; i++) {
                elementFirst.push(
                    <PaginationItem key={i} active={currentPage === i}>
                        <PaginationLink href="/" onClick={e => this.handleClick(e, i)}>
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }

        if (totalPage < 2) {
            return null;
        }

        return [
            ...elementFirst,
            ...elementEllipsis,
            ...elementSecond
        ];
    }

    render() {
        const { total, perPage } = this.props;
        const totalPage = Math.ceil(total/perPage);
        const currentPage = this.state.currentPage;

        return (
            <Pagination aria-label="Page navigation example">
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
                {this.renderItem()}
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
            </Pagination>
        );
    }
}

PaginationComponent.propTypes = propTypes;
PaginationComponent.defaultProps = defaultProps;

export default PaginationComponent;