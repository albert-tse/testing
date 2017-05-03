import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';

import classnames from 'classnames';
import { connect }  from 'react-redux';
import { sortBy } from 'lodash';

import Style from './table.style';

export const rowDataSelector = (state, { griddleKey }) => {
    return state
        .get('data')
        .find(rowMap => rowMap.get('griddleKey') === griddleKey)
        .toJSON();
};

export const enhancedWithRowData = connect((state, props) => {
    return {
        rowData: rowDataSelector(state, props)
    };
});

export const MinimalLayout = ({ Table, Pagination, Filter, SettingsWrapper }) => (
    <div>
        <Table />
        <Pagination />
    </div>
);

export const NoPaginationLayout = ({Table}) => (
    <div>
        <Table />
    </div>
);

export const styleConfig = {
    classNames: {
        Table: classnames(Style.linksTable, Style.accounting)
    }
};

export const sortByTitle = (data, column, sortAscending = true) => {
    return data.sort((original, newRecord) => {
        original = original.get(column);
        newRecord = newRecord.get(column);

        if (original === newRecord) {
            return 0;
        } else if (original > newRecord) {
            return sortAscending ? 1 : -1;
        } else {
            return sortAscending ? -1 : 1;
        }
    });
};

export const cloneTableHeaderForPinning = tableContainer => {
    const original = findDOMNode(tableContainer);
    const table = original.querySelector('table').cloneNode(true);
    [].forEach.call(table.querySelectorAll('tbody'), el => table.removeChild(el));
    table.classList.add(Style.stickyHeader);
    original.querySelector('div div').appendChild(table);
}
