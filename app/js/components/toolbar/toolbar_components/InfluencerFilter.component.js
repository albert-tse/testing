import React, { Component } from 'react';
import { Checkbox, Dropdown, Input, ListDivider } from 'react-toolbox';
import MultiSelectListDropdown from './MultiSelectListDropdown';
import FilterStore from '../../../stores/Filter.store';
import FilterActions from '../../../actions/Filter.action';

export default class InfluencerFilter extends Component {

    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }

    render() {
        const { influencers } = FilterStore.getState();
        return influencers.length > 1 ? (
            <MultiSelectListDropdown
                filterName="influencers"
                label="Filter influencer"
                store={FilterStore}
                onUpdate={this.update}
            />
        ) : <span />;
    }

    update(newState) {
        FilterActions.update(newState);
        'onSelect' in this.props && this.props.onSelect();
    }
}

InfluencerFilter.propTypes = {
    onSelect: React.PropTypes.func
};
