import React, { Component, PropTypes } from 'react';
import { List, ListItem } from 'react-toolbox';
import { flatten, pick, map, find, sortBy } from 'lodash';

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

        let influencerList = this.props.influencers;

        // If we are editing a post, the selected profile cannot be changed
        if (this.props.selectedProfile) {

            let selectedInfluencer = find(influencerList, (influencer) => {
                let selectedProfile = find(influencer.profiles, profile => profile.id === this.props.selectedProfile);

                if (selectedProfile) {
                    selectedProfile.selected = true;
                    influencer.profiles = [selectedProfile]
                    return true;
                } else {
                    influencer.profiles = [];
                    return false;
                }
            });

            influencerList = [selectedInfluencer];
        }

        this.state = {
            influencers: influencerList,
            selected: this.getSelectedProfiles() // should contain only selected profiles
        };

        // TODO: when user clicks to connect, open a new tab and do the following
        // on child window, listen for close
        // on this window, listen for focus
        // thisWindow.onFocus -> fetchProfiles and see if there's anything new they connected
        // childWindow.onBeforeUnload -> stop listening to focus
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
        const influencers = sortBy(this.state.influencers, inf => inf.name);

        return (
            <List selectable>
                {influencers.map(influencer => <Influencer key={influencer.id} {...influencer} onChange={this.onInfluencerChange} />)}
                <ListItem
                  leftIcon="add"
                  caption="Connect more"
                  legend="Pages or Profiles"
                  onClick={() => console.log('I clicked')}
                />
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
        if (!this.props.selectedProfile) {
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
            this.onChange && this.onChange(newState.selected, influencer.profiles);
        }
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
