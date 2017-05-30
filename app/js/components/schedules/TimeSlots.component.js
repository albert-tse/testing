import React from 'react';
import { Button, IconButton } from 'react-toolbox';
import { compose, pure, withHandlers } from 'recompose';
import { map, times } from 'lodash';
import moment from 'moment';

import { heading } from '../common';
import Styles from './styles';

/**
 * Renders the selected profile's time slots grouped by day of the week
 * @param {object} selectedProfile who has an array of time slots to show
 * @return {React.Component}
 */
function TimeSlots({
    selectedProfile
}) {
    if (selectedProfile) {
        return (
            <section>
                <h1 className={heading}>Scheduled Time Slots</h1>
                <div className={Styles.scheduleManager}>
                    {times(7, function renderDayColumn (n) {
                        return <DayColumn key={n} day={n} timeslots={selectedProfile.slots[n]} />
                    })}
                </div>
            </section>
        );
    } else {
        return <div />
    }
}

/**
 * Renders a single column of time slots, which is a single day
 * @param {number} day of the week in number starting from 0 or "Sunday"
 * @param {array} timeslots for posting on this day of the week for this profile
 * @return {React.Component}
 */
function DayColumn({
    day,
    timeslots
}) {
    return (
        <div className={Styles.dayColumn}>
            <h1 className={Styles.dayColumnHeader}>{moment().day(day).format('dddd')}</h1>
            <ul className={Styles.timeSlotsList}>
                {map(timeslots, function renderTimeSlot (timeslot, index) {
                    return (
                        <li key={index} className={Styles.timeSlotRow}>
                            <TimeSlot {...timeslot} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

/**
 * Renders a single slot for a given day
 * @param {string} label for the time in human-readable format instead of 24h
 * @return {React.Component}
 */
function TimeSlot({
    deleteTimeSlot,
    label
}) {
    return (
        <div className={Styles.timeSlot}>
            <IconButton icon="clear" onClick={deleteTimeSlot} />
            <p className={Styles.timeSlotTime}>{label}</p>
        </div>
    );
}

export default compose(
    withHandlers({ deleteTimeSlot }),
    pure
)(TimeSlots);

/**
 * Dispatches an action that would delete a specific time slot
 * @param {object} timezoneProps contains action to dispatch
 * @return {function}
 */
function deleteTimeSlot(timezoneProps) {
    /**
     * Dispatches the action
     * @param {number} timeSlotId identifies which time slot you want to delete
     */
    return function deleteTimeSlotCall(timeSlotId) {
        timezoneProps.deleteTimeSlot([timeSlotId]);
    }
}
