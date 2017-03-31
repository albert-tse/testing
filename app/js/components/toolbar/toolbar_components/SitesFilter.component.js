import React, { Component } from 'react';
import { Checkbox, Dropdown, Input, ListDivider } from 'react-toolbox';
import MultiSelectListDropdown from './MultiSelectListDropdown';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';

export default class SitesFilter extends Component {

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }

    render() {
        return (
            <MultiSelectListDropdown
                filterName="sites"
                label="sites"
                store={FilterStore}
                onUpdate={this.update}
            />
        );
    }

    update(newState) {
        FilterActions.update(newState);
        'onSelect' in this.props && this.props.onSelect();
    }
}
