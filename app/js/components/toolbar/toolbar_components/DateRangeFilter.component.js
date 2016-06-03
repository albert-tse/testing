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
            <AltContainer
                actions={ props => ({
                    onSelect: newValue => {
                        FilterActions.update(rangeValues[newValue]());
                        SearchActions.getResults();
                    }
                })}
            >
                <IconMenu icon='event' className={Styles.defaultColor}>
                    {ranges.map((range, index) => <MenuItem key={index} { ...range } />)}
                </IconMenu>
            </AltContainer>
        );
    }
}

const ranges = [
    {
        caption: 'Today',
        value: 'today'
    },
    {
        caption: 'Last 7 Days',
        value: 'week'
    },
    {
        caption: 'Last 30 Days',
        value: 'month'
    },
    {
        caption: 'All Time',
        value: 'allTime'
    }
];

const rangeValues = {
    today: () => ({
        date_start: moment().startOf('day').format(),
        date_end: moment().endOf('day').format()
    }),
    week: () => ({
        date_start: moment().subtract(1, 'week').startOf('day').format(),
        date_end: moment().endOf('day').format()
    }),
    month: () => ({
        date_start: moment().subtract(1, 'month').startOf('day').format(),
        date_end: moment().endOf('day').format()
    }),
    allTime: () => ({
        date_start: moment(0).format(),
        date_end: moment().endOf('day').format()
    })
};

