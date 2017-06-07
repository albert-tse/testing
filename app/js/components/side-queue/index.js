import React, { Component } from 'react';

import FilterStore from '../../stores/Filter.store';
import ProfileSelectorStore from '../../stores/ProfileSelector.store';
import ScheduledPostStore from '../../stores/ScheduledPost.store';

import FilterActions from '../../actions/Filter.action';
import ScheduledPostActions from '../../actions/ScheduledPost.action';

import SideQueueContainer from './SideQueue.container';

export default class SideQueue extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        FilterActions.update({ calendarQueueWeek: 1 });
        ScheduledPostActions.getScheduledPosts();
    }

    render() {
        return (
            <SideQueueContainer
                actions={FilterActions}
                stores={{ScheduledPostStore, ProfileSelectorStore, FilterStore}}
            />
        )
    }
}
