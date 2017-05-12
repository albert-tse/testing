import React, { Component, PropTypes } from 'react';
import { ListItem } from 'react-toolbox';
import { debounce, omit } from 'lodash';
import { compose, defaultProps, pure } from 'recompose';

import NoAvatar from '../NoAvatar.component';
import Styles from './styles';

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

const Profile = compose(
    defaultProps({
        selected: false,
        platform: 'Unknown'
    }),
    pure // This prevents all profile components from rendering when only one needs to
)(ProfileComponent);

export default Profile;
