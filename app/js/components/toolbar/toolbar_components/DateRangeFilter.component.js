import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import SearchActions from '../../../actions/Search.action';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox';
import moment from 'moment';
import Styles from '../styles';

export default class DateRangeFilter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div title="Select Date Range">
                <AltContainer
                    component={ IconMenu }
                    shouldComponentUpdate={ ::this.didDateRangeChange }
                    store={ FilterStore }
                    transform={ filters => ({
                        icon: 'event',
                        className: Styles.defaultColor,
                        onSelect: ::this.updateValue,
                        selectable: true,
                        selected: filters.date_range_type,
                        children: ranges.map((range, index) => <MenuItem key={index} { ...range } />)
                    })}
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
    caption: 'Today',
    value: 'today'
}, {
    caption: 'Last 7 Days',
    value: 'week'
}, {
    caption: 'Last 30 Days',
    value: 'month'
}, {
    caption: 'Month-to-Date',
    value: 'monthToDate'
}, {
    caption: 'Last Month',
    value: 'lastMonth',
}, {
    caption: 'All Time',
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
        date_start: moment().subtract(1, 'month').startOf('day').format(),
        date_end: moment().startOf('month').startOf('day').format()
    }),
    allTime: () => ({
        date_range_type: 'allTime',
        date_start: moment(0).format(),
        date_end: moment().endOf('day').format()
    })
};
