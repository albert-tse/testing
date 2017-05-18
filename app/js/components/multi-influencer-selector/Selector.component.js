import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListDivider, ProgressBar } from 'react-toolbox';
import { compose, pure, setPropTypes, withProps } from 'recompose';
import classnames from 'classnames';
import { intersectionBy } from 'lodash';

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
        <div className={classnames(isPinned && pinned)}>
            <SearchProfile keywords={keywords} searchProfiles={searchProfiles} />
            {influencers.length > 0 && !isLoading ? (
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

// Manage prop/state changes here
export default compose(
    setPropTypes({
        influencers: PropTypes.array,
        selectProfile: PropTypes.func.isRequired,
    }),
    withProps(function (props) {
        return {
            selectedProfile: null,
            isPinned: false,
            ...props,
            influencers: props.keywords.length > 0 ? props.visibleInfluencers : props.influencers,
        };
    }),
    pure
)(MultiInfluencerSelectorComponent);

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
