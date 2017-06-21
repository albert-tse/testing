import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListDivider, ProgressBar } from 'react-toolbox';
import { compose, pure, setPropTypes, withProps } from 'recompose';
import classnames from 'classnames';
import { curry, filter, get, intersectionBy, map } from 'lodash';
import flow from 'lodash/flow';
import {
    filter as filterFp,
    map as mapFp
} from 'lodash/fp';

import Config from '../../config';
import Influencer from './Influencer.component';
import SearchProfile from './SearchProfile.component';

import Styles from './styles';
import { pinned } from '../common';

/**
 * Displays a cascading menu of profiles categorized by influencer
 * If an influencer doesn't have any profiles associated with it,
 * display a menu item labeled "Generate Link" with a link icon
 * @param {object} props contains actions the component can dispatch and influencers to show
 * @param {array} props.influencers are influencers the User is managing
 * @param {string} props.keywords if user entered any in the search box
 * @param {function} props.searchProfiles is called when user types on the search profiles input field
 * @param {object} props.selectedProfile
 * @param {function} props.selectProfile is called when a profile is selected
 * @param {boolean} props.isLoading is set when it's currently fetchnig new profiles
 * @param {boolean} props.isPinned should be set to true when mounting this component as a sidebar so its width is limited to 240pp
 * @param {array|null} props.visibleProfiles is set when profiles need to be shown/hidden because user is searching for profile(s)
 * @return {React.Component}
 */
function MultiInfluencerSelectorComponent({
    locked,
    influencers,
    keywords,
    searchProfiles,
    selectedProfile,
    selectProfile,
    isLoading,
    isPinned,
    visibleProfiles
}) {
    return (
        <div className={classnames(isPinned && Styles.pinned, Styles.scrollable)}>
            <SearchProfile keywords={keywords} searchProfiles={searchProfiles} />
            {!isLoading ? (
                <List selectable>
                    {influencers.map(function (influencer) {
                        return (
                            <Influencer
                                key={influencer.id}
                                selectProfile={selectProfile}
                                selectedProfile={selectedProfile && selectedProfile.influencer_id === influencer.id ? selectedProfile : null }
                                visibleProfiles={visibleProfiles}
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
            ) : (
                <div className={Styles.loadingIndicatorContainer}>
                    <ProgressBar type="circular" mode="indeterminate" />
                </div>
            )}
        </div>
    );
};


// -- Helper methods

/**
 * Open a new tab allowing them to connect to more accounts
 * @param {Event} evt not used
 */
function openManageProfilesTab(evt) {
    if (window) {
        window.open('/#' + Config.routes.manageAccounts);
    }
}

/**
 * Removes any profiles that don't match the selectedProfiles
 * @return {array}
 */
function removeNonSelectedProfilesHandler(selectedProfileId, { profiles, ...influencer }) {
    return {
        ...influencer,
        profiles: filter(profiles, { id: selectedProfileId })
    }
}

const removeNonSelectedProfiles = curry(removeNonSelectedProfilesHandler);

/**
 * Perform any calculations/mutations on the component properties
 * passed to this component
 * Set any defaults here as well
 * @param {object} props passed by the owner
 * @return {object}
 */
function transformComponentProps(props) {
    const defaults = {
        selectedProfile: null,
        isPinned: false,
    };

    let updatedProps = {
        ...defaults,
        ...props
    };

    if (props.keywords.length > 0) {
        updatedProps.influencers = [...props.visibleInfluencers];
    }

    if (props.locked) {
        updatedProps.influencers = flow(
            mapFp(removeNonSelectedProfiles(updatedProps.selectedProfile.id)),
            filterFp(({profiles}) => profiles.length > 0)
        )(updatedProps.influencers);
    }

    if (props.disableDisconnectedInfluencers) {
        updatedProps.influencers = updatedProps.influencers.map(function setDisconnectedInfluencersAsDisabled(influencer) {
            return {
                ...influencer,
                disabled: influencer.profiles.length === 1 && /^inf/.test(influencer.profiles[0].id)
            };
        });
    }

    return updatedProps;
}

// Manage prop/state changes here
export default compose(
    setPropTypes({
        influencers: PropTypes.array,
        selectProfile: PropTypes.func.isRequired,
    }),
    withProps(transformComponentProps),
    pure
)(MultiInfluencerSelectorComponent);
