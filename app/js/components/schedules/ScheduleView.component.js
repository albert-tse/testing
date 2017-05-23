import React from 'react';
import { compose, pure, withHandlers, withState } from 'recompose';
import { Input } from 'react-toolbox';
import { AutoComplete } from 'antd';

import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';
import { columns, stretch } from '../common';
import TimeZonePicker from '../timezone-picker';

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
            <AppContent id="Schedules" className={stretch}>
                <TimeZonePicker initialTimezone={selectedProfile && selectedProfile.timezone} />
            </AppContent>
        </div>
    );
}

export default compose(
    pure
)(ScheduleView);
