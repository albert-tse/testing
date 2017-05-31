import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { defer } from 'lodash';
import moment from 'moment';

import { hasConnectedProfiles } from '../../utils';

import ScheduledPostStore from '../../stores/ScheduledPost.store';
import ProfileSelectorStore from '../../stores/ProfileSelector.store';
import FilterStore from '../../stores/Filter.store';
import UserStore from '../../stores/User.store';

import FilterActions from '../../actions/Filter.action';
import ProfileSelectorActions from '../../actions/ProfileSelector.action';
import ScheduledPostActions from '../../actions/ScheduledPost.action';

import CalendarQueueComponent from './CalendarQueue.component';

export default class CalendarQueue extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        FilterActions.update({calendarQueueWeek: 1});
        ScheduledPostActions.getScheduledPosts();
    }

    componentDidMount() {
        FilterStore.listen(this.onFilterChange);
        UserStore.listen(this.onFilterChange);
        ProfileSelectorStore.listen(this.onFilterChange);
    }

    componentWillUnmount() {
        FilterStore.unlisten(this.onFilterChange);
        UserStore.unlisten(this.onFilterChange);
        ProfileSelectorStore.unlisten(this.onFilterChange);
    }

    render() {
        return (
            <AltContainer
                component={CalendarQueueComponent}
                actions={{
                    selectProfile: ProfileSelectorActions.selectProfile
                }}
                stores={{
                    scheduledPosts: props => ({
                        store: ScheduledPostStore,
                        value: ScheduledPostStore.getState().posts
                    }),
                    profiles: props => ({
                        store: ProfileSelectorStore,
                        value: ProfileSelectorStore.getState()
                    }),
                    weeks: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().calendarQueueWeek
                    }),
                }}
                transform={function (props) {
                    return {
                        ...props,
                        loadMore: () => this.loadMore,
                        isEnabled: hasConnectedProfiles(props.profiles)
                    }
                }}
            />
        );
    }

    loadMore = () => {
        let filters = FilterStore.getState();

        FilterActions.update({calendarQueueWeek: filters.calendarQueueWeek + 1});
    }

    onFilterChange = () => {
        let filters = FilterStore.getState();
        let profiles = ProfileSelectorStore.getState();

        if (profiles.selectedProfile) {
            let selectedProfile = profiles.selectedProfile;
            let start = moment.utc();
            let end = moment.utc().add(filters.calendarQueueWeek * 7, 'days');

            defer(ScheduledPostActions.getScheduledPosts, selectedProfile.id, start, end);
        }

        return true;
    }
}
