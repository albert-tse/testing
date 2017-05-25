import React from 'react';
import { compose, pure, withState } from 'recompose';
import { Button, Checkbox } from 'react-toolbox';
import { TimePicker } from 'antd';
import moment from 'moment';
import classnames from 'classnames';

import { heading } from '../common';
import Styles from './styles';

function AddTimeSlot({
    newTimeSlotTime,
    newTimeSlotDays,
}) {
    return (
        <div>
            <h1 className={heading}>Add Time Slots</h1>
            <form className={Styles.addTimeSlotForm}>
                <div className={Styles.formRow}>
                    <label className={Styles.formLabel}>Time of Day</label>
                    <TimePicker
                        use12Hours
                        format="h:mm A"
                        value={moment(newTimeSlotTime)}
                    />
                </div>
                <div className={Styles.formRow}>
                    <label className={classnames(Styles.formLabel, Styles.nudgeRight)}>Days to Post On</label>
                    {newTimeSlotDays.map(function renderDailyCheckBox(day, index) {
                        return <Checkbox key={index} theme={Styles} {...day} />
                    })}
                </div>
                <footer className={Styles.addTimeSlotActions}>
                    <Button icon="add" label="Add" accent raised />
                    <Button icon="clear" label="Clear" />
                </footer>
            </form>
        </div>
    );
}

const defaultTimeSlotDays = [
    { label: 'Sun', checked: true },
    { label: 'Mon', checked: true },
    { label: 'Tue', checked: true },
    { label: 'Wed', checked: true },
    { label: 'Thu', checked: true },
    { label: 'Fri', checked: true },
    { label: 'Sat', checked: true },
];

export default compose(
    withState('newTimeSlotTime', 'setNewTimeSlotTime', new Date()),
    withState('newTimeSlotDays', 'setNewTimeSlotDays', defaultTimeSlotDays),
    pure
)(AddTimeSlot);
