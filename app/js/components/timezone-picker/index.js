import React from 'react';
import { AutoComplete } from 'antd';
import moment from 'moment-timezone';
import { compose, pure, withProps, withState, withHandlers } from 'recompose';
import { map } from 'lodash/fp';

/**
 * Allows user to set which timezone to use to schedule posts
 * @param {string} initialTimezone set default value to previously entered timezone
 * @param {function} onSelect is called whenever user chooses an option from the autocomplete
 * @param {array} timezones contains all available options
 * @return {React.Component}
 */
function TimeZonePicker ({
    initialTimezone,
    onSelect,
    timezones
}) {
    return (
        <div>
            <p><strong>Schedule Timezone</strong></p>
            <AutoComplete
                dataSource={timezones}
                defaultValue={initialTimezone}
                placeholder="Enter your timezone here"
                filterOption={ignoreCase}
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
    withHandlers({ onSelect }),
    pure
)(TimeZonePicker);

/**
 * Notify owner of this component that user has selected a timezone
 * @param {object} timeZoneProps contains the action to dispatch selected timezone
 */
function onSelect(timeZoneProps) {
    return function (selectedValue) {
        console.log('User selected: ', selectedValue);
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
