import React from 'react';
import { AutoComplete } from 'antd';
import moment from 'moment-timezone';
import { compose, onlyUpdateForKeys, pure, withProps, withState, withHandlers } from 'recompose';
import { map } from 'lodash/fp';

import { heading } from '../common';

/**
 * Allows user to set which timezone to use to schedule posts
 * @param {string} initialTimezone set default value to previously entered timezone
 * @param {function} onBlur is called whenever user exits out of the search box; update timezone if it's appropriate
 * @param {function} onSearch keeps track of what the user entered; called whenever user types on the search box
 * @param {function} onSelect is called whenever user chooses an option from the autocomplete
 * @param {array} timezones contains all available options
 * @return {React.Component}
 */
function TimeZonePicker ({
    enteredTimezone,
    initialTimezone,
    onBlur,
    onSearch,
    onSelect,
    timezones
}) {
    // onSearch={onSearch}
    return (
        <div>
            <h1 className={heading}>Schedule Timezone</h1>
            <AutoComplete
                dataSource={timezones.slice(0,10)}
                value={initialTimezone}
                placeholder="Enter your timezone here"
                filterOption={ignoreCase}
                onBlur={onBlur}
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
    withHandlers({ onBlur, onSearch, onSelect }),
    onlyUpdateForKeys(['initialTimezone'])
)(TimeZonePicker);

/**
 * Set default state to saved timezone
 * @param {object} timeZoneProps
 * @return {string}
 */
function initWithInitialTimezone({ initialTimezone }) {
    return initialTimezone;
}

/**
 * If User exits the timezone search box and it's an appropriate timezone,
 * update the profile with new timezone. Otherwise, revert back to original timezone
 * @param {object} timeZoneProps contains the original timezone
 */
function onBlur({
    enteredTimezone,
    initialTimezone,
    selectedProfile,
    timezones,
    updateEnteredTimezone,
    updateProfile
}) {
    return function checkEnteredTimezone() {
        if (timezones.indexOf(enteredTimezone) > -1 &&
            initialTimezone !== enteredTimezone
        ) {
            updateProfile({
                ...selectedProfile,
                timezone: enteredTimezone
            });
        } else {
            updateEnteredTimezone(initialTimezone);
        }
    }
}

/**
 * Keep track of the user's input so we can validate it
 * @param {object} timeZoneProps contains component properties
 * @return {function}
 */
function onSearch(timeZoneProps) {
    /**
     * Update the state for enteredTimezone
     * @param {string} enteredTimezone needs to be validated
     */
    return function updateEnteredTimezoneValue(enteredTimezone) {
        timeZoneProps.updateEnteredTimezone(enteredTimezone);
    }
}

/**
 * Notify owner of this component that user has selected a timezone
 * @param {object} timeZoneProps contains the action to dispatch selected timezone
 */
function onSelect(timeZoneProps) {
    return function (selectedValue) {
        timeZoneProps.updateEnteredTimezone(selectedValue);
        // Dispatch action here to change timezone for profile
    }
}

/**
 * Inject additional properties the component will use
 * @param {object} timeZoneProps properties given by owner component
 * @return {object}
 */
function initTimezoneOptions(timeZoneProps) {
    return {
        ...timeZoneProps,
        initialTimezone: timeZoneProps.timezone || moment.tz.guess(),
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
