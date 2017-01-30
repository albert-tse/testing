import React, { Component } from 'react';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';
import DateRangeFilter from './DateRangeFilter';

import moment from 'moment';

export default class LinksDateRangeFilter extends Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <DateRangeFilter
                label="Filter By Date"
                onChange={this.onChange}
                ranges={['thisWeek', 'custom']}
                stores={{
                    dateRange: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().linksDateRange
                    })
                }}
                inject={{
                    maxStartDate: moment().add(1, 'year').toDate(),
                    maxEndDate: moment().add(1, 'year').toDate()
                }}
            />
        );
    }

    onChange(linksDateRange) {
        FilterActions.update({ linksDateRange });
    }
}
