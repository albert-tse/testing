import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dropdown } from 'react-toolbox';

import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';

import moment from 'moment';
import pick from 'lodash/pick';

export default class MonthSelector extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={MonthSelectorComponent}
                store={FilterStore}
                transform={props => pick(props, 'selectedAccountingMonth')}
            />
        );
    }
}
class MonthSelectorComponent extends Component {

    constructor(props) {
        super(props);
        this.updateFilter = this.updateFilter.bind(this);
        this.source = this.generateOptions();
    }

    shouldComponentUpdate(nextProps) {
        return this.props !== nextProps;
    }

    render() {
        return (
            <Dropdown
                label="Select Month"
                source={this.source}
                value={this.props.selectedAccountingMonth}
                onChange={this.updateFilter}
            />
        );
    }

    generateOptions() {
        const currentDate = new Date();
        return [0,1,2,3].map(option => {
            if (option === 0) {
                return {
                    label: 'Month-to-Date',
                    value: 0
                };
            } else {
                const month = moment(currentDate).subtract(option, 'months');
                return {
                    label: month.format('MMM YYYY'),
                    value: option
                };
            }
        });
    }

    updateFilter(newValue) {
        FilterActions.update({ selectedAccountingMonth: newValue });
    }
}
