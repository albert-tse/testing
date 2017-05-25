import React from 'react';
import classnames from 'classnames';
import { compose, pure, withHandlers, withProps, withState } from 'recompose';
import { Button, IconButton, Input } from 'react-toolbox';
import { AutoComplete } from 'antd';
import moment from 'moment';
import { forIn, map, times } from 'lodash';

import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';
import { columns, extraPadding, heading, stretch } from '../common';
import TimeZonePicker from '../timezone-picker';
import Styles from './styles';

/**
 * Pure component showing a single profile's schedule perferences
 * for defining when posts should be scheduled
 * and which timezone should be set for the selected profile
 * @return {React.Component}
 */
function ScheduleView({
    selectedProfile,
    setValue,
    value
}) {
    return (
        <div className={columns}>
            <ProfileSelector isPinned disableDisconnectedInfluencers />
            <AppContent id="Schedules" className={classnames(Styles.limitWidth, stretch, extraPadding)}>
                <TimeZonePicker timezone={selectedProfile && selectedProfile.timezone} />
                <h1 className={heading}>Scheduled Time Slots</h1>
                {selectedProfile && (
                    <div className={Styles.scheduleManager}>
                        {times(7, function renderDayColumn (n) {
                            return <DayColumn key={n} day={n} timeslots={selectedProfile.slots[n]} />
                        })}
                    </div>
                )}
                <Button icon="add" label="Add Timeslot" raised accent />
            </AppContent>
        </div>
    );
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
    withProps(transformProps),
    pure
)(ScheduleView);

/**
 * Extend the props given by parent component
 * @param {object} props for ScheduleView component
 * @return {object}
 */
function transformProps(props) {
    const selectedProfile = {...props.selectedProfile};

    if (selectedProfile) {
        forIn(selectedProfile.slots, function (slots, key) {
            selectedProfile.slots[key] = slots.map(function (slot) {
                return {
                    ...slot,
                    label: moment(moment().format('Y-MM-DD ') + slot.timestamp).format('h:mmA')
                };
            });
        });
    }

    return {
        ...props
    };
}
