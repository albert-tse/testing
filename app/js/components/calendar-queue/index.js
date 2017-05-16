import React, { Component } from 'react';
import AltContainer from 'alt-container';

import { defer } from 'lodash';

import ScheduledPostStore from '../../stores/ScheduledPost.store';
import ProfileSelectorStore from '../../stores/ProfileSelector.store';
import FilterStore from '../../stores/Filter.store';
import UserStore from '../../stores/User.store';

import ScheduledPostActions from '../../actions/ScheduledPost.action';

import CalendarQueueComponent from './CalendarQueue.component';

export default class CalendarQueue extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        ScheduledPostActions.getScheduledPosts();
    }

    componentDidMount() {
        FilterStore.listen(this.onFilterChange);
        UserStore.listen(this.onFilterChange);
    }

    componentWillUnmount() {
        FilterStore.unlisten(this.onFilterChange);
        UserStore.unlisten(this.onFilterChange);
    }

    render() {
        return (
            <AltContainer
                component={CalendarQueueComponent}
                inject={this.props}
                stores={{
                    scheduledPosts: props => ({
                        store: ScheduledPostStore,
                        value: ScheduledPostStore.getState().posts
                    }),
                    profiles: props => ({
                        store: ProfileSelectorStore,
                        value: ProfileSelectorStore.getState()
                    })
                }}
            />
        );
    }

    onFilterChange = () => {
        defer(ScheduledPostActions.getScheduledPosts);
        return true;
    }
}
