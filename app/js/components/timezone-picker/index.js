import React from 'react';
import { AutoComplete } from 'antd';
import moment from 'moment-timezone';
import { compose, onlyUpdateForKeys, pure, withProps, withPropsOnChange, withState, withHandlers } from 'recompose';
import { map } from 'lodash/fp';
import defer from 'lodash/defer';
import throttle from 'lodash/throttle';

import { heading } from '../common';

/**
 * Allows user to set which timezone to use to schedule posts
 * @param {array} dataSource set of timezone names that match closest to entered timezone
 * @param {function} onBlur is called whenever user exits out of the search box; update timezone if it's appropriate
 * @param {function} onSearch keeps track of what the user entered; called whenever user types on the search box
 * @param {function} onSelect is called whenever user chooses an option from the autocomplete
 * @param {array} timezones contains all available options
 * @return {React.Component}
 */
function TimeZonePicker ({
    dataSource,
    enteredTimezone,
    onBlur,
    onSearch,
    onSelect,
    selectedProfile,
    timezones
}) {
    return (
        <div>
            <h1 className={heading}>Schedule Timezone</h1>
            <AutoComplete
                dataSource={dataSource}
                value={enteredTimezone}
                placeholder="Enter your timezone here"
                filterOption={false}
                onBlur={onBlur}
                onSearch={throttle(onSearch, 500)}
                onSelect={onSelect}
                style={{
                    width: '20rem'
                }}
            />
        </div>
    );
}

export default compose(
    withProps(initTimezoneOptions),
    withState('enteredTimezone', 'updateEnteredTimezone', initWithInitialTimezone),
    withState('dataSource', 'updateDataSource', []),
    withHandlers({ filterOptions  }),
    withHandlers({ onBlur, onSearch, onSelect }),
    withPropsOnChange(['selectedProfile'], updateTimezoneWhenSelectedProfileChanges),
    pure
)(TimeZonePicker);


/**
 * Change Schedule Timezone value when user selects a different profile
 * @param {object} timezoneProps
 * @param {object} timezoneProps.selectedProfile the selected profile containing timezone
 * @param {string} timezoneProps.selectedProfile.timezone to switch to
 * @return {function}
 */
function updateTimezoneWhenSelectedProfileChanges({
    selectedProfile: { timezone },
    updateEnteredTimezone
}) {
    defer(updateEnteredTimezone, timezone);
}

/**
 * Set default state to saved timezone
 * @param {object} timezoneProps
 * @return {string}
 */
function initWithInitialTimezone({ selectedProfile }) {
    return selectedProfile.timezone || 'America/New_York';
}

/**
 * If User exits the timezone search box and it's an appropriate timezone,
 * update the profile with new timezone. Otherwise, revert back to original timezone
 * @param {object} timezoneProps contains the original timezone
 */
function onBlur({
    enteredTimezone,
    selectedProfile,
    timezones,
    updateEnteredTimezone,
    updateProfile
}) {
    return function checkEnteredTimezone() {
        if (timezones.indexOf(enteredTimezone) > -1 &&
            selectedProfile.timezone !== enteredTimezone) {
            updateProfile({
                ...selectedProfile,
                timezone: enteredTimezone
            });
        } else {
            updateEnteredTimezone(selectedProfile.timezone);
        }
    }
}

/**
 * Keep track of the user's input so we can validate it
 * @param {object} timezoneProps contains component properties
 * @return {function}
 */
function onSearch(timezoneProps) {
    /**
     * Update the state for enteredTimezone
     * @param {string} enteredTimezone needs to be validated
     */
    return function updateEnteredTimezoneValue(enteredTimezone) {
        timezoneProps.updateEnteredTimezone(enteredTimezone);
        timezoneProps.filterOptions(enteredTimezone);
    }
}

/**
 * Notify owner of this component that user has selected a timezone
 * @param {object} timezoneProps contains the action to dispatch selected timezone
 */
function onSelect(timezoneProps) {
    return function (selectedValue) {
        timezoneProps.updateEnteredTimezone(selectedValue);
        // Dispatch action here to change timezone for profile
    }
}

/**
 * Filter autocomplete options
 * @param {object} timezoneProps contains the timezones we want to filter
 * @return {function}
 */
function filterOptions({
    timezones,
    updateDataSource
}) {

    /**
     * Limit calls to this so it doesn't slow down performance
     * @param {string} enteredTimezone entered by the user
     * @return {function}
     */
    return function filterOptionsCall(enteredTimezone) {
        const options = timezones.filter(function matchesEnteredTimezone(timezone) {
            return timezone.toLowerCase().replace(/[_\s]/g, '').indexOf(enteredTimezone.toLowerCase().replace(/[_\s]/g,'')) >= 0;
        });

        updateDataSource(options);
    };
}


/**
 * Inject additional properties the component will use
 * @param {object} timezoneProps properties given by owner component
 * @return {object}
 */
function initTimezoneOptions(timezoneProps) {
    return {
        ...timezoneProps,
        timezones: moment.tz.names()
    }
}

/**
 * Checks if user's keywords matches an option, ignoring lower/upper case
 * @param {string} inputValue the keywords the user typed
 * @param {HTMLElement} option contains the value we want in its child node
 * @param {string} option.props.children is a name for a timezone
 * @return {boolean}
 */
function ignoreCase(inputValue, option) {
    return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
}
