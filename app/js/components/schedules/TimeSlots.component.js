import React from 'react';
import { Button, IconButton } from 'react-toolbox';
import { compose, pure } from 'recompose';
import { map, times } from 'lodash';
import moment from 'moment';

import { heading } from '../common';
import Styles from './styles';

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
    label
}) {
    return (
        <div className={Styles.timeSlot}>
            <IconButton icon="clear" />
            <p className={Styles.timeSlotTime}>{label}</p>
        </div>
    );
}

export default compose(
    pure
)(TimeSlots);
