import React, { Component, PropTypes } from 'react';
import { ListItem } from 'react-toolbox';
import { debounce, omit } from 'lodash';
import { compose, defaultProps, pure } from 'recompose';

import NoAvatar from '../NoAvatar.component';
import Styles from './styles';

/**
 * Displays a single Profile
 * Only display this in a List component
 * @param {number} id profile id is used to tell profile selector component which one was selected
 * @param {string} profile_picture url to profile picture
 * @param {string} profile_name name of the profile (Facebook page or Twitter profile)
 * @param {string} platformName ie. Facebook or Twitter
 * @param {boolean} selected determines whether profile should be rendered as selected or not
 * @param {function} selectProfile dispatch an action by calling this with profile id
 * @return {React.component}
 */
function ProfileComponent({
    id,
    profile_picture,
    profile_name,
    platformName,
    selected,
    selectProfile,
}) {
    return (
        <ListItem
            theme={Styles}
            className={!selected ? Styles.dimmed : ''}
            avatar={profile_picture}
            caption={profile_name}
            legend={platformName}
            onClick={then => !selected && selectProfile(id)}
        />
    );
}

export default compose(
    defaultProps({
        selected: false,
        platform: 'Unknown'
    }),
    pure // This prevents all profile components from rendering when only one needs to
)(ProfileComponent);
