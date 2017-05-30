import React from 'react';
import classnames from 'classnames';
import { compose, pure, withHandlers, withProps } from 'recompose';
import moment from 'moment';
import forIn from 'lodash/forIn';

import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';
import { columns, extraPadding, stretch } from '../common';
import TimeZonePicker from '../timezone-picker';
import TimeSlots from './TimeSlots.component';
import AddTimeSlot from './AddTimeSlot.component';
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
    updateProfile,
    value
}) {
    return (
        <div className={columns}>
            <ProfileSelector isPinned disableDisconnectedInfluencers />
            <AppContent id="Schedules" className={classnames(Styles.limitWidth, stretch, extraPadding)}>
                <TimeZonePicker
                    timezone={selectedProfile && selectedProfile.timezone}
                    updateProfile={updateProfile}
                />
                <TimeSlots selectedProfile={selectedProfile} />
                <AddTimeSlot />
            </AppContent>
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
