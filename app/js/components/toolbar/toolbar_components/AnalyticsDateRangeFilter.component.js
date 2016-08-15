import React, { Component } from 'react';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import DateRangeFilter from './DateRangeFilter';

export default class AnalyticsDateRangeFilter extends Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <DateRangeFilter
                label="Published within"
                onChange={this.onChange}
                ranges={['monthToDate', 'lastMonth', 'week', 'today', 'custom']}
                stores={{
                    dateRange: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().analyticsDateRange
                    })
                }}
            />
        );
    }

    onChange(analyticsDateRange) {
        FilterActions.update({ analyticsDateRange });
    }
}
