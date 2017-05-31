import React from 'react';
import { compose, pure, withHandlers, withProps } from 'recompose';
import { Avatar, Dropdown } from 'react-toolbox';
import { find, flatten, flow, map } from 'lodash/fp'; // NOTE: This is using the Functional Programming version of lodash

import Styles from './styles';

/**
 * Similar to pinned profile selector but the UI is contained within a dropdown
 * menu instead
 * @param {array} influencers the user is managing
 * @return {React.Component}
 */
function ProfileDropdown({
    changeProfile,
    source,
    value,
    update
}) {
    return (
        <Dropdown
            theme={Styles}
            source={source}
            value={value}
            template={renderOption}
            onChange={changeProfile}
        />
    );
}

export default compose(
    withProps(transformComponentProps),
    withHandlers({
        changeProfile,
    }),
    pure
)(ProfileDropdown);

// --- Helpers

/**
 * Set defaults and transform any of the properties
 * passed to the component here before sending to pure component
 * @param {object} props passed down to component
 * @return {object}
 */
function transformComponentProps(props) {
    const defaults = {};

    let transformed = {
        ...defaults,
        ...props
    };

    transformed.source = flow(
        map(convertToOptionGroup),
        flatten
    )(transformed.influencers);
    // prepend selected profile/influencer to source

    if (transformed.selectedProfile) {
        transformed.value = transformed.selectedProfile.id;
    }

    return transformed;
}

/**
 * Convert influencer as a dropdown section header
 * while the profiles are converted to objects that can be used to
 * display a dropdown option
 * @param {object} influencer to be used as section header
 * @param {array} influencer.profiles will be selectable options
 * @return {array}
 */
function convertToOptionGroup(influencer) {
    return [
        {
            type: 'sectionHeader',
            label: influencer.name,
        },
        ...map(convertToOption)(influencer.profiles)
    ].filter(Boolean);
}

/**
 * Convert a profile to an option
 * @param {object} profile to be converted
 * @return {object}
 */
function convertToOption(profile) {
    return {
        type: profile.id ? 'profileOption' : 'influencerOption',
        label: profile.profile_name,
        value: profile.id || `inf-${profile.influencer_id}`,
        ...profile
    };
}

/**
 * Renders an option from the dropdown accoridng to type given
 * @param {object} option whose type could be display, sectionHeader, profileOption, or influencerOption
 * @return {React.Component}
 */
function renderOption(option) {
    if (option.type === 'sectionHeader') {
        return <div className={Styles.sectionHeader}>{option.label}</div>
    } else {
        return (
            <div className={Styles.profileOption}>
                <Avatar
                    theme={Styles}
                    image={option.profile_picture}
                    icon={!option.profile_picture ? 'link' : null}
                />
                {option.label}
            </div>
        )
    }
}

/**
 * Select another profile
 * @param {object} props passed to the Dropdown component so we can access current state and action creators
 * @param {number} profileId that was selected
 * @return {function}
 */
function changeProfile({ selectProfile }) {
    return function (profileId) {
        selectProfile(profileId);
    };
}
