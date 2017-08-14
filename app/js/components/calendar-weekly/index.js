import React from 'react';
import AltContainer from 'alt-container';
import _ from 'lodash';
import moment from 'moment-timezone';
import connect from 'alt-utils/lib/connect';

import ScheduledPostStore from '../../stores/ScheduledPost.store';
import ProfileSelectorStore from '../../stores/ProfileSelector.store';
import FilterStore from '../../stores/Filter.store';

import ScheduledPostActions from '../../actions/ScheduledPost.action';

import CalendarWeeklyComponent from './CalendarWeekly.component';

class CalendarWeeklyContainer extends React.Component {

    state = {
        ...CalendarWeeklyContainer.initialState
    }

    componentDidMount() {
        if (this.props.selectedProfile) {
            this.loadScheduledPosts(this.props.selectedProfile)
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state === nextState) {
            if (this.props.selectedProfile !== nextProps.selectedProfile && !!nextProps.selectedProfile) {
                this.loadScheduledPosts(nextProps.selectedProfile)
            }

            if (this.props.posts !== nextProps.posts) {
                this.setState(this.generateEvents(nextState, nextProps))
            }
        }
    }

    render() {
        return (
            <CalendarWeeklyComponent
                events={this.state.events}
                isEnabled={!!this.props.selectedProfile && ! /^inf/.test(this.props.selectedProfile.id)}
                onNavigate={this.reloadScheduledPosts(this.setState)}
                scheduledPosts={this.props.posts}
                selectedProfile={this.props.selectedProfile}
            />
        );
    }

    reloadScheduledPosts = setState => selectedDate => {
        const { selectedProfile } = ProfileSelectorStore.getState();

        if (selectedProfile) {
            let start = moment.tz(selectedDate, selectedProfile.timezone).startOf('week');
            let end = moment.tz(selectedDate, selectedProfile.timezone).endOf('week');

            _.defer(ScheduledPostActions.getScheduledPosts, selectedProfile.id, start, end);
        }
    }

    loadScheduledPosts(profile) {
        const { start, end } = this.getDateRangeOfWeek(moment.tz(profile.timezone))
        _.defer(ScheduledPostActions.getScheduledPosts, profile.id, start, end)
    }

    getDateRangeOfWeek(startDate) {
        return {
            start: startDate.clone().startOf('week'),
            end: startDate.clone().endOf('week').endOf('day')
        }
    }

    processScheduledPosts = selectedProfile => post => {
        const { timezone } = selectedProfile
        const timeslot = moment.tz(post.scheduledTime + '+00:00', timezone).seconds(0)
        const timeslotEnd = timeslot.clone().add(1, 'hour')

        return {
            index: post.id,
            start: this.changeToLocalTimezoneForDisplayOnly(timeslot),
            end: this.changeToLocalTimezoneForDisplayOnly(timeslotEnd),
            post: {
                ...post,
                time: moment(timeslot)
            }
        }
    }

    getTimeslotsOfSelectedProfile(selectedProfile, selectedDate) {
        const currentDate = moment.tz(selectedDate, selectedProfile.timezone).startOf('week')
        return _.chain(selectedProfile.slots)
            .keys()
            .map(dayOfWeek => _.map(selectedProfile.slots[dayOfWeek], slot => ({ dayOfWeek, ...slot })))
            .flatten()
            .map(slot => {
                let slotTime = moment(currentDate).format('YYYY-MM-DD ') + moment(slot.time).format('HH:mm:ss')
                slotTime = moment.tz(slotTime, selectedProfile.timezone).add(slot.dayOfWeek, 'days')
                const slotTimeEnd = moment.min(slotTime.clone().add(1, 'hour'), slotTime.clone().endOf('day'))

                return {
                    index: slot.slotId,
                    start: this.changeToLocalTimezoneForDisplayOnly(slotTime),
                    end: this.changeToLocalTimezoneForDisplayOnly(slotTimeEnd),
                    post: {
                        slotId: slot.slotId,
                        time: slotTime
                    }
                }
            })
            .value()
    }

    generateEvents = (state, props) => (prevState, prevProps) => {
        const posts = _.map(props.posts, this.processScheduledPosts(props.selectedProfile))
        const timeslots = this.getTimeslotsOfSelectedProfile(props.selectedProfile, state.selectedDate)
        const emptySlots = _.differenceBy(timeslots, posts, item => item.start.toString());
        const mergedEvents = posts.concat(emptySlots);

        return {
            ...state,
            events: mergedEvents
        }
    }

    changeToLocalTimezoneForDisplayOnly(timeslot) {
        return moment(timeslot.format('YYYY-MM-DDTHH:mm:ss') + moment().format('Z')).toDate();
    }

    static initialState = {
        events: [],
        selectedDate: moment().seconds(0).toDate()
    }

    redirectToContentView(evt) {
        History.push(config.routes.explore);
    }

}

export default connect({

    listenTo(props) {
        return [ProfileSelectorStore, ScheduledPostStore]
    },

    reduceProps(props) {
        const { selectedProfile } = ProfileSelectorStore.getState()
        const { posts } = ScheduledPostStore.getState()
        return {
            posts,
            selectedProfile
        }
    }

})(CalendarWeeklyContainer)
