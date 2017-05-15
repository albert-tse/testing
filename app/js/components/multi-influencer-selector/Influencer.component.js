import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListSubHeader } from 'react-toolbox';
import { compose, defaultProps, pure, setPropTypes, withProps, withState, withHandlers } from 'recompose';
import { defer, intersectionBy, omit } from 'lodash';
import classnames from 'classnames';

import Profile from './Profile.component';

import Styles from './styles';

/**
 * Displays an Influencer in a cascading list, wherein its children are profiles associated with influencer
 * @param {boolean} isCollapsed determines whether or not the profiles should be hidden
 * @param {string} name of the influencer
 * @param {object|null} selectedProfile would be a profile if one of the influencer's profiles is selected
 * @param {function} selectProfile is an action that would be dispatched if one of the influencer's profiles is selected
 * @param {function} toggleCollapsed updates the component's state property isCollapsed
 * @return {React.Component}
 */
function InfluencerComponent({
    isCollapsed,
    name,
    profiles,
    selectedProfile,
    selectProfile,
    toggleCollapsed,
}) {
    return (
        <div>
            <div className={Styles.caption} onClick={toggleCollapsed}>
                <i className="material-icons">{!isCollapsed ? 'keyboard_arrow_down' : 'chevron_right'}</i>
                {name}
            </div>
            <div className={classnames(isCollapsed && Styles.hidden)}>
                {profiles.map(function (profile) {
                    return (
                        <Profile
                            key={profile.id}
                            selectProfile={selectProfile}
                            selected={selectedProfile && selectedProfile.id === profile.id}
                            {...profile}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default compose(
    withState('isCollapsed', 'setCollapsed', shouldCollapse),
    withHandlers({
        toggleCollapsed
    }),
    setPropTypes({
        name: PropTypes.string.isRequired,
        profiles: PropTypes.array,
        selectProfile: PropTypes.func.isRequired
    }),
    withProps(function (props) {
        return {
            name: '',
            ...props,
            profiles: (Array.isArray(props.visibleProfiles) ? intersectionBy(props.visibleProfiles, props.profiles, 'id') : props.profiles),
        }
    }),
    pure
)(InfluencerComponent);

// -- Helper methods

/**
 * Component should initialize collapsed if it doesn't have any profiles
 * @param {object} influencer contains influencer data
 * @return {boolean} true if it has no profiles
 */
function shouldCollapse(influencer) {
    return !hasProfiles(influencer);
}

/**
 * Checks if influencer has profiles
 * @param {object} props contains influencer data
 * @param {array} props.profiles any profiles the influencer is connected to
 * @return {boolean} true if it has at least one profile
 */
function hasProfiles({ profiles }) {
    return Array.isArray(profiles) && profiles.length > 0;
}

/**
 * Callback function that Toggles the collapsed state of the component
 * @param {object} props Contains the component properties
 * @param {boolean} props.isCollapsed is the current state of component
 * @return {function}
 */
function toggleCollapsed({ isCollapsed, setCollapsed }) {
    return function (evt) {
        setCollapsed(!isCollapsed);
    };
}
