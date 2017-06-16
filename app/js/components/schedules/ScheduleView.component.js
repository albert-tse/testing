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
import { CTAToAddProfiles } from '../null-states';
import Styles from './styles';

/**
 * Pure component showing a single profile's schedule perferences
 * for defining when posts should be scheduled
 * and which timezone should be set for the selected profile
 * @return {React.Component}
 */
function ScheduleView({
    addTimeSlot,
    deleteTimeSlot,
    selectedProfile,
    setValue,
    updateProfile,
    value
}) {
    const isEnabled = selectedProfile && ! /^inf/.test(selectedProfile.id);

    return (
        <div className={columns}>
            {isEnabled && <ProfileSelector isPinned disableDisconnectedInfluencers />}
            <AppContent id="Schedules" className={classnames(Styles.limitWidth, stretch, extraPadding)}>
                {isEnabled ? (
                    <div>
                        <TimeZonePicker selectedProfile={selectedProfile} updateProfile={updateProfile} />
                        <TimeSlots selectedProfile={selectedProfile} deleteTimeSlot={deleteTimeSlot} />
                        <AddTimeSlot selectedProfile={selectedProfile} addTimeSlot={addTimeSlot} />
                    </div>
                ) : <CTAToAddProfiles />}
            </AppContent>
        </div>
    );
}

export default pure(ScheduleView);
