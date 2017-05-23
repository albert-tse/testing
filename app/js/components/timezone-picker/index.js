import React from 'react';
import { AutoComplete } from 'antd';
import moment from 'moment-timezone';
import { compose, pure, withProps, withState, withHandlers } from 'recompose';
import { map } from 'lodash/fp';
import Fuse from 'fuse.js';

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
                onSelect={onSelect}
                placeholder="Enter your timezone here"
                filterOption={ignoreCase}
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

function onSelect(timeZoneProps) {
    return function (selectedValue) {
        console.log('User selected: ', selectedValue);
    }
}

function initTimezoneOptions(timeZoneProps) {
    return {
        ...timeZoneProps,
        initialTimezone: timeZoneProps.timezone || moment.tz.guess(),
        timezones: moment.tz.names()
    }
}

function ignoreCase(inputValue, option) {
    return option.props.children.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
}
