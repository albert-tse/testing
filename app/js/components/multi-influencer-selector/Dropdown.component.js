import React from 'react';
import { compose, pure, withProps } from 'recompose';
import { Dropdown } from 'react-toolbox';
import { flatten, flow, map } from 'lodash/fp';

import Styles from './styles';

/**
 * Similar to pinned profile selector but the UI is contained within a dropdown
 * menu instead
 * @param {array} influencers the user is managing
 * @return {React.Component}
 */
function ProfileDropdown({
    source
}) {
    return (
        <Dropdown
            theme={Styles}
            source={source}
            template={renderOption}
        />
    );
}

export default compose(
    withProps(transformComponentProps),
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
    const defaults = {
    };

    let transformed = {
        ...defaults,
        ...props
    };

    transformed.source = flow(
        map(convertToOptionGroup),
        flatten
    )(transformed.influencers);

    // prepend selected profile/influencer to source

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
            value: influencer.id
        },
        ...map(convertToOption)(influencer.profiles)
    ]
}

/**
 * Convert a profile to an option
 * @param {object} profile to be converted
 * @return {object}
 */
function convertToOption(profile) {
    return {
        type: profile.id ? 'profileOption' : 'influencerOption',
        label: profile.id ? profile.profile_name : 'Generate Link',
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
        return <div>{option.label}</div>
    }
}
