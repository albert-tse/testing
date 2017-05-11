import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListDivider } from 'react-toolbox';
import { compose, defaultProps, pure, setPropTypes } from 'recompose';
import classnames from 'classnames';

import Config from '../../config';
import Influencer from './Influencer.component';

import Styles from './styles';

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

/**
 * Open a new tab allowing them to connect to more accounts
 * @param {Event} evt not used
 */
function openManageProfilesTab(evt) {
    if (window) {
        window.open('/#' + Config.routes.manageAccounts);
    }
}
