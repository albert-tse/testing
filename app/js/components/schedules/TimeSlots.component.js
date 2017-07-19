import React from 'react';
import { Button, IconButton } from 'react-toolbox';
import { compose, pure, withHandlers, withProps } from 'recompose';
import { map, times } from 'lodash';
import moment from 'moment';

import { heading } from '../common';
import TimeSlot from './TimeSlot.component';
import Styles from './styles';

/**
 * Renders the selected profile's time slots grouped by day of the week
 * @param {object} selectedProfile who has an array of time slots to show
 * @return {React.Component}
 */
function TimeSlots({
    selectedProfile
}) {
    if (selectedProfile && ! /^inf/.test(selectedProfile.id)) {
        return (
            <section>
                <h1 className={heading}>Scheduled Time Slots</h1>
                <div className={Styles.scheduleManager}>
                    {times(7, function renderDayColumn (n) {
                        return <DayColumn key={n} day={n} profileId={selectedProfile.id} timeslots={selectedProfile.slots[n]} />
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
    profileId,
    timeslots
}) {
    return (
        <div className={Styles.dayColumn}>
            <h1 className={Styles.dayColumnHeader}>{moment().day(day).format('dddd')}</h1>
            <ul className={Styles.timeSlotsList}>
                {map(timeslots, function renderTimeSlot (timeslot, index) {
                    return (
                        <li key={index} className={Styles.timeSlotRow}>
                            <TimeSlot profileId={profileId} {...timeslot} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default pure(TimeSlots);
