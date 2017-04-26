import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import { pick } from 'lodash';

export default class DropdownComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { currentPage, totalItemsCount, setPage } = this.props;

        return (
            <div>
                <Pagination
                    activePage={this.props.currentPage}
                    totalItemsCount={this.props.totalItemsCount}
                    onChange={this.props.setPage}
                />
            </div>
        );
    }
}
