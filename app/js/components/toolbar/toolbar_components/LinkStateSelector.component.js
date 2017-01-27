import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dropdown } from 'react-toolbox';

import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';

import pick from 'lodash/pick';

export default class LinkStateSelector extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={LinkStateSelectorComponent}
                store={FilterStore}
                transform={props => pick(props, 'selectedLinkState')}
            />
        );
    }
}

class LinkStateSelectorComponent extends Component {

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
                label="Filter Posts"
                source={this.source}
                value={this.props.selectedLinkState}
                onChange={this.updateFilter}
            />
        );
    }

    generateOptions() {
        return [
            {
                label: 'All',
                value: 'all'
            },
            {
                label: 'Scheduled',
                value: 'scheduled'
            },
            {
                label: 'Posted',
                value: 'posted'
            },
            {
                label: 'Saved',
                value: 'saved'
            }
        ];
    }

    updateFilter(newValue) {
        FilterActions.update({ selectedLinkState: newValue });
    }
}
