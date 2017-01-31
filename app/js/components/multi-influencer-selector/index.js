import React, { Component, PropTypes } from 'react';
import { List } from 'react-toolbox';
import { flatten, pick } from 'lodash';

import Influencer from './Influencer.component';

/**
 * Keeps track of which profiles are selected
 * Indicates which profiles to schedule the current story on
 */
export default class MultiInfluencerSelector extends Component {

    /**
     * Create a multi-influencer selector component
     * @param {Object} props are defined at the bottom
     * @return {MultiInfluencerSelector}
     */
    constructor(props) {
        super(props);
        this.onInfluencerChange = this.onInfluencerChange.bind(this);
        this.componentDidUpdate = this.cacheCallbackMethods;

        this.state = {
            influencers: this.props.influencers,
            selected: this.getSelectedProfiles() // should contain only selected profiles
        };
    }

    /**
     * Let parent element know how many are currently selected
     * because most of the time at least one will be initially selected
     */
    componentDidMount() {
        this.cacheCallbackMethods();
        this.onChange(this.state.selected);
    }

    /**
     * Display a list of influencers and their connected profiles
     */
    render() {
        return (
            <List>
                {this.props.influencers.map(influencer => <Influencer key={influencer.name} {...influencer} onChange={this.onInfluencerChange} />)}
            </List>
        );
    }

    /**
     * Cache callback methods
     */
    cacheCallbackMethods() {
        this.onChange = this.props.onChange;
    }

    /**
     * Update state of selected profiles
     * Update parent element
     * @param {Object} influencer that was recently updated
     */
    onInfluencerChange(influencer) {
        let updatedInfluencers = this.state.influencers.filter(i => i.id !== influencer.id);
        updatedInfluencers = [
            ...updatedInfluencers,
            influencer
        ];


        const selectedProfiles = flatten(updatedInfluencers.map(influencer => influencer.profiles))
                                  .filter(profile => profile.selected);

        const newState = {
            selected: selectedProfiles,
            influencers: updatedInfluencers
        };

        this.setState(newState);
        this.onChange && this.onChange(newState.selected, influencer);
    }

    /**
     * Iterate over given profiles and identify which ones are selected
     * Only called once at initial
     * @return {Array} selected profiles
     */
    getSelectedProfiles() {
        const allProfiles = flatten(this.props.influencers.map(influencer => influencer.profiles));
        return allProfiles.filter(profile => profile.selected);
    }
}

MultiInfluencerSelector.defaultProps = {
    influencers: []
};
