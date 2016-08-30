import React, { Component } from 'react';
import { Dropdown } from 'react-toolbox';
import AltContainer from 'alt-container';
import CustomDateRangeDialog from './CustomDateRangeDialog.component';
import moment from 'moment';

export default class DateRangeFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCustomDateRangeDialog: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleCustomDateRange = this.handleCustomDateRange.bind(this),
        this.toggleDialog = this.toggleDialog.bind(this),
        this.updateValue = this.updateValue.bind(this),

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
                onChange: this.handleChange,
                source: ranges.filter(range => this.ranges.indexOf(range.value) >= 0),
                value: dateRange.date_range_type
            })
        };

        if ('stores' in this.props) {
            props.stores = this.props.stores;
        } else {
            props.store = this.props.store;
        }

        return (
            <div>
                <AltContainer {...props} />
                <CustomDateRangeDialog
                    active={this.state.showCustomDateRangeDialog}
                    handleToggle={this.toggleDialog}
                    handleUpdate={this.handleCustomDateRange}
                />
            </div>
        );
    }

    handleCustomDateRange(dateRange) {
        this.updateValue(Object.assign({}, values['custom'](), dateRange));
        this.toggleDialog();
    }

    toggleDialog() {
        this.setState({ showCustomDateRangeDialog: !this.state.showCustomDateRangeDialog });
    }

    handleChange(newValue) {
        newValue === 'custom' ? this.toggleDialog() : this.updateValue(values[newValue]());
    }

    updateValue(changes) {
        this.onChange(changes);
        this.onSelect && this.onSelect();
    }
}

DateRangeFilter.propTypes = {
    label: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    ranges: React.PropTypes.array,
    stores: React.PropTypes.object
};

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
    }),
    custom: () => ({
        date_range_type: 'custom'
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
    }, {
        label: 'Custom Date Range',
        value: 'custom'
    }
];

export { values, ranges };
