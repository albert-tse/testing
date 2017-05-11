import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListDivider } from 'react-toolbox';
import { compose, defaultProps, pure, setPropTypes } from 'recompose';

import Config from '../../config';
import Influencer from './Influencer.component';

function MultiInfluencerSelectorComponent({
    influencers,
    selectProfile,
    deselectProfile
}) {
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

const MultiInfluencerSelector = compose(
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

export default MultiInfluencerSelector;

/**
 * Open a new tab allowing them to connect to more accounts
 * @param {Event} evt not used
 */
function openManageProfilesTab(evt) {
    if (window) {
        window.open('/#' + Config.routes.manageAccounts);
    }
}
