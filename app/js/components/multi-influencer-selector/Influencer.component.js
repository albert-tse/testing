import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListSubHeader } from 'react-toolbox';
import { compose, defaultProps, pure, setPropTypes, withProps, withState, withHandlers } from 'recompose';
import { defer, intersectionBy, omit } from 'lodash';
import classnames from 'classnames';

import Profile from './Profile.component';

import Styles from './styles';

/**
 * Displays an Influencer in a cascading list, wherein its children are profiles associated with influencer
 * @param {number} id Influencer id
 * @param {boolean} isCollapsed determines whether or not the profiles should be hidden
 * @param {string} name of the influencer
 * @param {object|null} selectedProfile would be a profile if one of the influencer's profiles is selected
 * @param {function} selectProfile is an action that would be dispatched if one of the influencer's profiles is selected
 * @param {function} toggleCollapsed updates the component's state property isCollapsed
 * @return {React.Component}
 */
function InfluencerComponent({
    id,
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
            {profiles.length > 0 && (
                <div className={classnames(isCollapsed && Styles.hidden)}>
                    {profiles.map(function createProfile(profile, index) {
                        return (
                            <Profile
                                key={index}
                                selectProfile={selectProfile}
                                selected={selectedProfile && ('id' in selectedProfile ? selectedProfile.id === profile.id : selectedProfile.influencer_id === id)}
                                {...profile}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}


export default compose(
    withState('isCollapsed', 'setCollapsed', false),
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
