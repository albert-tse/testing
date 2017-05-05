import React, { Component, PropTypes } from 'react';
import { ListItem } from 'react-toolbox';
import { debounce, omit } from 'lodash';

import NoAvatar from '../NoAvatar.component';
import Styles from './styles';

const Profile = props => (
    <ListItem
        theme={Styles}
        className={!props.selected ? Styles.dimmed : ''}
        avatar={props.profile_picture}
        caption={props.profile_name}
        legend={props.platformName}
        onClick={then => props[props.selected ? 'deselectProfile' : 'selectProfile'](props.id)}
    />
);

export default Profile;

Profile.defaultProps = {
    selected: false,
    platform: 'Unknown'
};
