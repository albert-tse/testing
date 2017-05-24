import React from 'react';
import classnames from 'classnames';
import { compose, pure, withHandlers, withState } from 'recompose';
import { Button, IconButton, Input } from 'react-toolbox';
import { AutoComplete } from 'antd';
import moment from 'moment';

import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';
import { columns, extraPadding, stretch } from '../common';
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
            <AppContent id="Schedules" className={classnames(stretch, extraPadding)}>
                <TimeZonePicker timezone={selectedProfile && selectedProfile.timezone} />
                <div className={Styles.scheduleManager}>
                    <DayColumn day={1} />
                    <DayColumn day={2} />
                    <DayColumn day={3} />
                    <DayColumn day={4} />
                    <DayColumn day={5} />
                    <DayColumn day={6} />
                    <DayColumn day={7} />
                </div>
                <Button icon="add" label="Add Timeslot" raised accent />
            </AppContent>
        </div>
    );
}

function DayColumn({
    day
}) {
    return (
        <div className={Styles.dayColumn}>
            <h1 className={Styles.dayColumnHeader}>{moment().day(day).format('dddd')}</h1>
            <ul className={Styles.timeSlotsList}>
                <li className={Styles.timeSlotRow}>
                    <div className={Styles.timeSlot}>
                        <IconButton icon="clear" />
                        <p className={Styles.timeSlotTime}>6:00 PM</p>
                    </div>
                </li>
                <li className={Styles.timeSlotRow}>
                    <div className={Styles.timeSlot}>
                        <IconButton icon="clear" />
                        <p className={Styles.timeSlotTime}>9:04 PM</p>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default compose(
    pure
)(ScheduleView);
