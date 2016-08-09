import React, { Component } from 'react';
import { Dropdown } from 'react-toolbox';
import AltContainer from 'alt-container';
import moment from 'moment';

export default class DateRangeFilter extends Component {

    constructor(props) {
        super(props);
        this.updateValue = this.updateValue.bind(this);
        Object.assign(this, {
            label: props.label,
            onChange: props.onChange,
            onSelect: props.onSelect,
            ranges: props.ranges
        });
    }

    render() {
        const props = {
            component: Dropdown,
            transform: ({dateRange}) => ({
                auto: true,
                label: this.label,
                onChange: this.updateValue,
                source: ranges.filter(range => this.ranges.indexOf(range.value) >= 0),
                value: dateRange.date_range_type
            })
        };

        if ('stores' in this.props) {
            props.stores = this.props.stores;
        } else {
            props.store = this.props.store;
        }

        return React.createElement(AltContainer, props);
    }

    updateValue(newValue) {
        this.onChange(values[newValue]());
        this.onSelect && this.onSelect();
    }
}

const values = {
    today: () => ({
        date_range_type: 'today',
        date_start: moment().startOf('day').format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    }),
    week: () => ({
        date_range_type: 'week',
        date_start: moment().subtract(1, 'week').startOf('day').format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    }),
    month: () => ({
        date_range_type: 'month',
        date_start: moment().subtract(1, 'month').startOf('day').format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    }),
    monthToDate: () => ({
        date_range_type: 'monthToDate',
        date_start: moment().startOf('month').startOf('day').format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    }),
    lastMonth: () => ({
        date_range_type: 'lastMonth',
        date_start: moment().subtract(1, 'month').startOf('month').format(),
        date_end: moment().startOf('month').startOf('day').format()
    }),
    allTime: () => ({
        date_range_type: 'allTime',
        date_start: moment(0).format(),
        date_end: moment().startOf('day').add(1, 'days').format()
    })
};

const ranges = [
    {
        label: 'Today',
        value: 'today'
    }, {
        label: 'Last 7 Days',
        value: 'week'
    }, {
        label: 'Last 30 Days',
        value: 'month'
    }, {
        label: 'Month-to-Date',
        value: 'monthToDate'
    }, {
        label: 'Last Month',
        value: 'lastMonth',
    }, {
        label: 'All Time',
        value: 'allTime'
    }
];

export { values, ranges };
