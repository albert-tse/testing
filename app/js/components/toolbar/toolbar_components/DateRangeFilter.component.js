import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import SearchActions from '../../../actions/Search.action';
import { Dropdown } from 'react-toolbox';
import moment from 'moment';
import find from 'lodash/find';
import Styles from '../styles';

export default class DateRangeFilter extends Component {
    constructor(props) {
        super(props);
        this.updateValue = this.updateValue.bind(this);
    }

    render() {
        return (
            <div title="Select Date Range">
                <AltContainer
                    component={ Dropdown }
                    shouldComponentUpdate={ ::this.didDateRangeChange }
                    store={ FilterStore }
                    transform={ ({date_range_type}) => {
                        console.log(find(ranges, { value: date_range_type }));
                        return {
                            auto: true,
                            label: 'Published',
                            source: ranges,
                            onChange: this.updateValue,
                            value: find(ranges, { value: date_range_type }).value
                        };
                    }}
                />
            </div>
        );
    }

    updateValue(newValue) {
        FilterActions.update(rangeValues[newValue]());
        this.props.onSelect && this.props.onSelect();
    }

    didDateRangeChange(prevProps, container, nextProps) {
        var newestDateChanged = prevProps.date_end !== nextProps.date_end;
        var oldestDateChanged = prevProps.date_start !== nextProps.date_start;
        var shouldUpdate = newestDateChanged || oldestDateChanged;
        return shouldUpdate;
    }
}

const ranges = [{
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
}];

const rangeValues = {
    today: () => ({
        date_range_type: 'today',
        date_start: moment().startOf('day').format(),
        date_end: moment().endOf('day').format()
    }),
    week: () => ({
        date_range_type: 'week',
        date_start: moment().subtract(1, 'week').startOf('day').format(),
        date_end: moment().endOf('day').format()
    }),
    month: () => ({
        date_range_type: 'month',
        date_start: moment().subtract(1, 'month').startOf('day').format(),
        date_end: moment().endOf('day').format()
    }),
    monthToDate: () => ({
        date_range_type: 'monthToDate',
        date_start: moment().startOf('month').startOf('day').format(),
        date_end: moment().endOf('day').format()
    }),
    lastMonth: () => ({
        date_range_type: 'lastMonth',
        date_start: moment().subtract(1, 'month').startOf('month').format(),
        date_end: moment().startOf('month').startOf('day').format()
    }),
    allTime: () => ({
        date_range_type: 'allTime',
        date_start: moment(0).format(),
        date_end: moment().endOf('day').format()
    })
};
