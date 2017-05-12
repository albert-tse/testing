import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListDivider } from 'react-toolbox';
import { compose, defaultProps, pure, setPropTypes } from 'recompose';
import classnames from 'classnames';

import Config from '../../config';
import Influencer from './Influencer.component';

import Styles from './styles';

/**
 * Displays a cascading menu of profiles categorized by influencer
 * If an influencer doesn't have any profiles associated with it,
 * display a menu item labeled "Generate Link" with a link icon
 * @param {object} props contains actions the component can dispatch and influencers to show
 * @param {array} props.influencers are influencers the User is managing
 * @param {function} props.selectProfile is called when a profile is selected
 * @param {function} props.deselectProfile is called when a profile is deselected
 * @param {boolean} props.isPinned should be set to true when mounting this component as a sidebar so its width is limited to 240pp
 * @return {React.Component}
 */
function MultiInfluencerSelectorComponent({
    influencers,
    selectProfile,
    deselectProfile,
    isPinned
}) {
    return (
        <List className={classnames(isPinned && Styles.isPinned)} selectable>
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

// Manage prop/state changes here
export default compose(
    setPropTypes({
        influencers: PropTypes.array,
        selectProfile: PropTypes.func.isRequired,
        deselectProfile: PropTypes.func.isRequired
    }),
    defaultProps({
        influencers: [],
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
