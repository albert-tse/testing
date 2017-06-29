import React from 'react';
import { IconButton } from 'react-toolbox';
import { compose, pure, setStatic, withHandlers, withProps } from 'recompose';

import ProfileActions from '../../actions/Profile.action';
import Styles from './styles';

/**
 * Renders a single slot for a given day
 * @param {string} label for the time in human-readable format instead of 24h
 * @return {React.Component}
 */
function TimeSlot({
    deleteTimeSlot,
    label,
    ...props
}) {
    return (
        <div className={Styles.timeSlot}>
            <IconButton icon="clear" onClick={deleteTimeSlot()} />
            <p className={Styles.timeSlotTime}>{label}</p>
        </div>
    );
}

function transform(props) {
    return {
        ...props,
        label: props.time.format('h:mma (z)')
    };
}

/**
 * Dispatches an action that would delete a specific time slot
 * @param {object} timezoneProps contains action to dispatch
 * @return {function}
 */
function deleteTimeSlotHandler(props) {
    return function deleteTimeSlotFactory() {
        return function deleteTimeSlot(evt) {
            const payload = {
                profileId: props.profileId,
                timeSlots: [props.slotId]
            };
            ProfileActions.deleteTimeSlot(payload)
        }
    }
}

export default compose(
    withProps(transform),
    withHandlers({
        deleteTimeSlot: deleteTimeSlotHandler
    }),
    pure
)(TimeSlot);

