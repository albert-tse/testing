import React, { Component, PropTypes } from 'react';
import { List, ListItem, ListDivider } from 'react-toolbox';
import { flatten, pick, map, find, sortBy } from 'lodash';

import Config from '../../config';
import Influencer from './Influencer.component';

function MultiInfluencerSelector({ influencers, selectProfile, deselectProfile }) {
    return (
        <List selectable>
            {influencers.map(function (influencer) {
                return (
                    <Influencer
                        key={influencer.id}
                        selectProfile={selectProfile}
                        deselectProfile={deselectProfile}
                        {...influencer}
                    />
                );
            })}
            <ListDivider />
            <ListItem
              leftIcon="add"
              caption="Connect more"
              legend="Pages or Profiles"
              onClick={openManageProfilesTab}
            />
        </List>
    );
};

/**
 * Open a new tab allowing them to connect to more accounts
 * @param {Event} evt not used
 */
function openManageProfilesTab(evt) {
    if (window) {
        window.open('/#' + Config.routes.manageAccounts);
    }
}

export default MultiInfluencerSelector;


/**
 * Keeps track of which profiles are selected
 * Indicates which profiles to schedule the current story on
 */
class xMultiInfluencerSelector extends Component {

    /**
     * Create a multi-influencer selector component
     * @param {Object} props are defined at the bottom
     * @return {MultiInfluencerSelector}
     */
    constructor(props) {
        super(props);
        this.onInfluencerChange = this.onInfluencerChange.bind(this);
        this.openManageProfilesTab = this.openManageProfilesTab.bind(this);
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
    }

    /**
     * Let parent element know how many are currently selected
     * because most of the time at least one will be initially selected
     * Whenever the user goes back to this original tab, fetch for any new profiles
     */
    componentDidMount() {
        this.cacheCallbackMethods();
        this.onChange(this.state.selected);
    }

    /**
     * Reset the state whenever profiles are updated
     * @param {Object} nextProps contain changes to the influencer lists and profiles associated with them
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            influencers: nextProps.influencers,
            selected: this.getSelectedProfiles()
        });
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
