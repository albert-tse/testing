import React, { Component } from 'react';
import AltContainer from 'alt-container';

import { defer } from 'lodash';
import { filter, flatten, flow, head, map } from 'lodash/fp';
import moment from 'moment';

import ScheduledPostStore from '../../stores/ScheduledPost.store';
import ProfileSelectorStore from '../../stores/ProfileSelector.store';
import FilterStore from '../../stores/Filter.store';
import UserStore from '../../stores/User.store';

import FilterActions from '../../actions/Filter.action';
import ProfileSelectorActions from '../../actions/ProfileSelector.action';
import ScheduledPostActions from '../../actions/ScheduledPost.action';

import CalendarWeeklyComponent from './CalendarWeekly.component';

export default class CalendarWeekly extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
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
                component={CalendarWeeklyComponent}
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
                }}
                inject={{
                    reloadScheduledPosts: () => this.reloadScheduledPosts
                }}
            />
        );
    }

    reloadScheduledPosts(selectedDate) {
        let profiles = ProfileSelectorStore.getState();
        
        if (profiles.selectedProfile) {
            let selectedProfile = profiles.selectedProfile;
            let start = moment(selectedDate).utc().startOf('week');
            let end = moment(selectedDate).utc().endOf('week');

            defer(ScheduledPostActions.getScheduledPosts, selectedProfile.id, start, end);
        }
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
