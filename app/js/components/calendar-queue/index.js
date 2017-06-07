import React, { Component } from 'react';

import ScheduledPostStore from '../../stores/ScheduledPost.store';
import ProfileSelectorStore from '../../stores/ProfileSelector.store';
import FilterStore from '../../stores/Filter.store';
import UserStore from '../../stores/User.store';

import FilterActions from '../../actions/Filter.action';
import ProfileSelectorActions from '../../actions/ProfileSelector.action';
import ScheduledPostActions from '../../actions/ScheduledPost.action';

import CalendarQueueContainer from './CalendarQueue.container';
import CalendarQueueComponent from './CalendarQueue.component';

/**
 * Container component for the Calendar > Queue view
 * It should only display scheduled posts or empty timeslots from now until 7 days from now initially
 * then it can be extended to show the next 7 days
 * @return {React.Component}
 */
function CalendarQueue(props) {
    return (
        <CalendarQueueContainer
            component={CalendarQueueComponent}
            actions={FilterActions}
            stores={{ProfileSelectorStore}}
        />
    )
}

export default CalendarQueue;
