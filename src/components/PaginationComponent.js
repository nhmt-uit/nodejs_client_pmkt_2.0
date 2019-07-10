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

const DOT_LEFT = "DOT_LEFT"
const DOT_RIGHT = "DOT_RIGHT"

const range = (from, to, step = 1) => {
    let i = from;
    const range = [];
  
    while (i <= to) {
      range.push(i);
      i += step;
    }
  
    return range;
  };

class PaginationComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: this.props.currentPage,
        };
    }

    componentDidUpdate() {
        if(this.props.currentPage !== this.state.currentPage) {
            this.setState({
                currentPage: this.props.currentPage,
            })
        }
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
        const totalPages = Math.ceil(total/perPage);
        const currentPage = this.state.currentPage;
        const pageNeighbours = 1;

        const totalNumbers = pageNeighbours * 2 + 1;

        if (totalPages > 1) {
            let pages = [];
      
            const leftBound = currentPage - pageNeighbours;
            const rightBound = currentPage + pageNeighbours;
            const beforeLastPage = totalPages;
      
            const startPage = leftBound > 2 ? leftBound : 1;
            const endPage = rightBound < beforeLastPage ? rightBound : beforeLastPage;
      
            pages = range(startPage, endPage);
      
            const pagesCount = pages.length;
            const singleSpillOffset = totalNumbers - pagesCount - 1;
      
            const leftSpill = startPage > 2;
            const rightSpill = endPage < beforeLastPage;

            if (leftSpill && !rightSpill) {
                const extraPages = range(startPage - singleSpillOffset, startPage - 1);
                pages = [1, DOT_LEFT , ...extraPages, ...pages];
            } else if (!leftSpill && rightSpill) {
                const extraPages = range(endPage + 1, endPage + singleSpillOffset);
                pages = [...pages, ...extraPages, DOT_RIGHT, totalPages];
            } else if (leftSpill && rightSpill) {
                if(pages.indexOf(totalPages-1) !== -1 ) {
                    pages = [1, DOT_LEFT, ...pages, totalPages];
                } else {
                    pages = [1, DOT_LEFT, ...pages, DOT_RIGHT, totalPages];
                }
            }

            return [
                pages.map(item => {
                    let pageNumber = item
                    let handleEvent = this.handleClick
                    if(item === DOT_LEFT || item === DOT_RIGHT) {
                        pageNumber = '...'
                        handleEvent = _ => null
                    }

                    return (
                        <PaginationItem key={item} active={currentPage === item}>
                            <PaginationLink href="#/" onClick={e => handleEvent(e, item)}>
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    )
                })
            ]
        }
        return null
    }

    render() {
        const { total, perPage } = this.props;
        const totalPage = Math.ceil(total/perPage);
        const currentPage = this.state.currentPage;

        console.log(totalPage)
        if (totalPage < 2) {
            return null;
        }

        return (
            <Pagination aria-label="Page navigation example">
                <PaginationItem>
                    <PaginationLink first href="#/" onClick={e => this.handleClick(e, 1)} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        previous href="#/"
                        onClick={
                            e => this.handleClick(e, currentPage <= 1 ? 1 : (currentPage - 1))
                        }
                    />
                </PaginationItem>
                {this.renderItem()}
                <PaginationItem>
                    <PaginationLink
                        next href="#/"
                        onClick={
                            e => this.handleClick(e, currentPage >= totalPage ? totalPage : (currentPage + 1))
                        }
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink last href="#/" onClick={e => this.handleClick(e, totalPage)} />
                </PaginationItem>
            </Pagination>
        );
    }
}

PaginationComponent.propTypes = propTypes;
PaginationComponent.defaultProps = defaultProps;

export default PaginationComponent;