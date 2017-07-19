import React from 'react';
import { compose, pure, withHandlers, withState } from 'recompose';
import { Button, Checkbox } from 'react-toolbox';
import { TimePicker } from 'antd';
import moment from 'moment-timezone';
import findIndex from 'lodash/findIndex';
import classnames from 'classnames';
import { flow, filter, keyBy, map, mapValues } from 'lodash/fp';

import { heading } from '../common';
import Styles from './styles';

/**
 * Renders a form for adding a new time slot given a time and [un]checked days to place it on
 * @param {Date} newTimeSlotTime we will only use the time here regardless of timezone
 * @param {array} newTimeSlotDays determines which days the time will be posted on
 * @return {React.Component}
 */
function AddTimeSlot({
    addNewTimeSlot,
    newTimeSlotTime,
    newTimeSlotDays,
    setNewTimeSlotTime,
    toggleCheckedForDay,
    selectedProfile
}) {
    return (
        <div>
            <h1 className={heading}>Add Time Slots</h1>
            <form className={Styles.addTimeSlotForm}>
                <div className={Styles.formRow}>
                    <label className={Styles.formLabel}>Time of Day</label>
                    <TimePicker
                        use12Hours
                        format="h:mma"
                        value={newTimeSlotTime}
                        onChange={function setNewTime(newTime) { setNewTimeSlotTime(newTime); }}
                    /><div>({moment.tz(moment(), selectedProfile.timezone).format('z')})</div>
                </div>
                <div className={Styles.formRow}>
                    <label className={classnames(Styles.formLabel, Styles.nudgeRight)}>Days to Post On</label>
                    {newTimeSlotDays.map(function renderDailyCheckBox(day, index) {
                        return (
                            <Checkbox
                                key={index}
                                theme={Styles}
                                onChange={function onChange(evt) { toggleCheckedForDay(day.label); }}
                                label={day.label}
                                checked={day.checked}
                            />
                        );
                    })}
                </div>
                <footer className={Styles.addTimeSlotActions}>
                    <Button icon="add" label="Add" accent raised onClick={addNewTimeSlot} />
                </footer>
            </form>
        </div>
    );
}

const defaultTimeSlotDays = [
    { label: 'Sun', day: 0, checked: true },
    { label: 'Mon', day: 1, checked: true },
    { label: 'Tue', day: 2, checked: true },
    { label: 'Wed', day: 3, checked: true },
    { label: 'Thu', day: 4, checked: true },
    { label: 'Fri', day: 5, checked: true },
    { label: 'Sat', day: 6, checked: true },
];

export default compose(
    withState('newTimeSlotTime', 'setNewTimeSlotTime', moment()),
    withState('newTimeSlotDays', 'setNewTimeSlotDays', defaultTimeSlotDays),
    withHandlers({ addNewTimeSlot, toggleCheckedForDay }),
    pure
)(AddTimeSlot);

/**
 * Formats request into format for API request before dispatching action
 * @param {object} addTimeSlotProps implicitly used here
 * @param {function} addTimeSlot is an action to dispatch after request is formatted
 * @param {Date} newTimeSlotTime will be used to render a timestamp in this format (hh:mm) without time zone
 * @param {array} newTimeSlotDays determines which days this time will appear in
 * @param {object} selectedProfile contains profile id
 * @return {function}
 */
function addNewTimeSlot({
    addTimeSlot,
    newTimeSlotTime,
    newTimeSlotDays,
    selectedProfile
}) {
    return function addNewTimeSlotCall() {
        const hours = newTimeSlotTime.format('HH');
        const minutes = newTimeSlotTime.format('mm');

        const timeslot = moment().tz(selectedProfile.timezone).hours(hours).minutes(minutes).tz('UTC').format('HH:mm');

        const request = flow(
            filter({ checked: true }),
            map(function insertTimeSlot({ day }) {
                return { day, timeslot };
            }),
            keyBy('day'),
            mapValues(function pickTimeSlot({ timeslot }) {
                return [timeslot];
            })
        )(newTimeSlotDays);

        addTimeSlot({
            profileId: selectedProfile.id,
            request
        });
    }
}

/**
 * Toggles checkbox state for one of the days in the add timeslot form
 * @param {object} addTimeSlotProps not used explicitly here
 * @param {array} newTimeSlotDays keeps track of which days are selected for new time slot
 * @param {function} setNewTimeSlotDays updates the current state of time slot days
 * @return {function}
 */
function toggleCheckedForDay({
    newTimeSlotDays,
    setNewTimeSlotDays
}) {
    /**
     * Toggles checked state
     * @param {string} day assigned to checkbox (ie. Sun)
     */
    return function toggleCheckedForDayCall(day) {
        const indexOfNewTimeSlotDays = findIndex(newTimeSlotDays, { label: day });
        if (indexOfNewTimeSlotDays >= 0) {
            const day = newTimeSlotDays[indexOfNewTimeSlotDays];
            let updatedTimeSlotDays = [...newTimeSlotDays];
            updatedTimeSlotDays[indexOfNewTimeSlotDays] = {
                ...day,
                checked: !day.checked
            };

            setNewTimeSlotDays(updatedTimeSlotDays);
        }
    };
}
