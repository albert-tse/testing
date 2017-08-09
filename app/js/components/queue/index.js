import React from 'react'
import connect from 'alt-utils/lib/connect'
import moment from 'moment-timezone';
import _ from 'lodash';

import ProfileSelectorStore from '../../stores/ProfileSelector.store'
import ScheduledPostStore from '../../stores/ScheduledPost.store'

import ScheduledPostActions from '../../actions/ScheduledPost.action'

import QueueComponent, { Loading } from './Queue.component'
import CTAToEditSchedule from '../null-states/CTAToEditSchedule.component';
import CTAToSchedulePostOrDefineTimeslots from '../null-states/CTAToSchedulePostOrDefineTimeslots.component';

const DAYS_IN_A_WEEK = 7;

class QueueContainer extends React.Component {

    static initialState = {
        numberOfWeeks: 1,
        today: moment.tz('UTC'),
        queues: []
    }

    state = {
        ...QueueContainer.initialState
        // scheduledPosts: [],
        // loadMore: ::this.loadMore
    }

    componentDidMount() {
        _.defer(this.fetchScheduledPosts, this.props.selectedProfile, this.state.today, this.numberOfWeeks)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState === this.state) {
            if (prevProps.selectedProfile !== this.props.selectedProfile) { // selected a different profile
                this.setState(this.resetView)
                this.fetchScheduledPosts(this.props.selectedProfile, this.state.today, this.state.numberOfWeeks)
            }

            if (prevProps.posts !== this.props.posts) { // loaded new set of posts
                this.setState(this.groupPostsIntoQueues)
            }
        }
    }

    render() {
        return this.props.loading ? <Loading /> : (
            <QueueComponent
                mini={this.props.mini}
                queues={this.getQueues(this.props, this.state)}
                selectedProfile={this.props.selectedProfile}
                totalScheduledPostsAmount={this.props.totalScheduledPostsAmount}
                CallToAction={this.getCallToAction(_.pick(this.props, 'posts', 'totalScheduledPostsAmount', 'selectedProfile'))}
            />
        )
    }

    createQueue = (date, posts, slots, timezone) => offsetInDays => {
        // get date for current queue
        const { start, end } = this.getDateRange(date, offsetInDays)

        // get slots set for this day of the week
        const timeslots = this.getProfileTimeslotsForDayOfWeek(slots, start)

        // define queue properties
        let queue = {
            date,
            timeslots,
            scheduledPosts: _.filter(posts, post => {
                const scheduledPostTime = post.time.tz(timezone)
                return start <= scheduledPostTime && scheduledPostTime < end
            })
        }

        // filter out any old posts or time slots that happened today
        if (offsetInDays === 0) {
            const timeNow = moment.tz(timezone)
            queue = {
                ...queue,
                timeslots: _.filter(queue.slots, slot => slot.time > timeNow),
                scheduledPosts: _.filter(queue.scheduledPosts, post => post.time > timeNow)
            }
        }

        return queue
    }

    fetchScheduledPosts(selectedProfile, from, numberOfWeeks) {
        const start = moment.tz(from, selectedProfile.timezone).startOf('day')
        const end = start.clone().add(numberOfWeeks, 'weeks').endOf('day')
        return ScheduledPostActions.getScheduledPosts(selectedProfile.id, start, end)
    }

    getCallToAction(props) {
        const hasScheduledPostsWithinDateRange = Array.isArray(props.posts) ? props.posts.length : 0;
        const hasScheduledPostsOverall = props.totalScheduledPostsAmount > 0;
        const hasTimeslots = Object.keys(props.selectedProfile.slots).length;

        if (!hasTimeslots) {
            if (hasScheduledPostsOverall) { // Scenarios 3 and 4: Posts have been scheduled but no timeslots
                return CTAToEditSchedule
            } else { // Scenario 2: Influencer has neither scheduled any posts nor defined timeslots
                return CTAToSchedulePostOrDefineTimeslots
            }
        } else {
            return props => React.createElement('div')
        }
    }

    getDateRange(startDate, dayOffset) {
        const start = startDate.clone().add(dayOffset, 'days')
        const end = start.clone().add(1, 'day')
        return { start, end }
    }

    getProfileTimeslotsForDayOfWeek(timeslots = {}, day) {
        const slots = timeslots[day.day()] || []
        return _.map(slots, slot => {
            return {
                ...slot,
                time: day.clone().hour(slot.time.hour()).minute(slot.time.minute())
            }
        })
    }

    getQueues(props, state) {
        if (Object.keys(props.selectedProfile.slots).length > 0 || props.totalScheduledPostsAmount > 0) {
            return state.queues
        } else {
            return []
        }
    }

    groupPostsIntoQueues(state, props) {
        const date = state.today.tz(props.selectedProfile.timezone).startOf('day')
        const numDaysToShow = state.numberOfWeeks * DAYS_IN_A_WEEK
        const { slots, timezone } = props.selectedProfile

        let queues = _.times(numDaysToShow, this.createQueue(date, props.posts, slots, timezone))

        return {
            ...state,
            queues
        }
    }

    resetView(prevState, props) {
        return { numberOfWeeks: 1 }
    }

}

export default connect({
    listenTo(props) {
        return [ProfileSelectorStore, ScheduledPostStore]
    },

    reduceProps(props) {
        const {
            loading,
            posts,
            totalScheduledPostsAmount
        } = ScheduledPostStore.getState()

        return {
            ...props, // TODO specify each property explicitly so we know what to compare
            loading,
            posts,
            selectedProfile: ProfileSelectorStore.getState().selectedProfile,
            totalScheduledPostsAmount
        }
    },

})(QueueContainer)
