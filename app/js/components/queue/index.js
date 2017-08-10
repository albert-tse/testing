import React from 'react'
import PropTypes from 'prop-types';
import connect from 'alt-utils/lib/connect'
import moment from 'moment-timezone';
import _ from 'lodash';

import ProfileSelectorStore from '../../stores/ProfileSelector.store'
import ScheduledPostStore from '../../stores/ScheduledPost.store'

import ScheduledPostActions from '../../actions/ScheduledPost.action'

import QueueComponent from './Queue.component'
import CTAToEditSchedule from '../null-states/CTAToEditSchedule.component';
import CTAToSchedulePostOrDefineTimeslots from '../null-states/CTAToSchedulePostOrDefineTimeslots.component';

const DAYS_IN_A_WEEK = 7;

/**
 * Contains all the business logic for the Calendar Queue view
 * Note: This component is wrapped by alt's High Order Component that manages which stores to listen to for updates
 * and passes down relevant data that this component will process to define QueueComponent's props
 * @return React.Component
 */
class QueueContainer extends React.Component {

    state = {
        ...QueueContainer.initialState
    }

    componentDidMount() {
        this.fetchScheduledPosts(this.props, this.state)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState === this.state) {
            if (prevProps.selectedProfile !== this.props.selectedProfile) { // selected a different profile
                this.setState(this.resetView)
                this.fetchScheduledPosts(this.props, this.state)
            }

            if (prevProps.posts !== this.props.posts) { // loaded new set of posts
                this.setState(this.groupPostsIntoQueues)
            }
        }
    }

    render() {
        return (
            <QueueComponent
                loading={this.props.loading}
                mini={this.props.mini}
                onLoadMore={this.loadMore}
                queues={this.getQueues(this.props, this.state)}
                selectedProfile={this.props.selectedProfile}
                switchingInfluencers={this.state.switchingInfluencers}
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
            date: start,
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
                timeslots: _.filter(queue.timeslots, slot => slot.time > timeNow),
                scheduledPosts: _.filter(queue.scheduledPosts, post => post.time > timeNow)
            }
        }

        return queue
    }

    fetchScheduledPosts(props, state) {
        const { selectedProfile } = props
        const { numberOfWeeks, today } = state
        const start = moment.tz(today, selectedProfile.timezone).startOf('day')
        const end = start.clone().add(numberOfWeeks, 'weeks').endOf('day')

        return _.defer(ScheduledPostActions.getScheduledPosts, selectedProfile.id, start, end)
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
            return false
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
            loading: false,
            switchingInfluencers: false,
            queues
        }
    }

    // TODO: append to state.queues rather than recreating everything
    loadMore = () => {
        const { selectedProfile } = this.props

        if (!!selectedProfile) {
            this.setState(this.incrementNumberOfWeeks, () => {
                this.fetchScheduledPosts(this.props, this.state)
            })
        }
    }

    resetView(prevState, props) {
        return {
            loading: true,
            numberOfWeeks: 1,
            switchingInfluencers: true
        }
    }

    incrementNumberOfWeeks(prevState, props) {
        return { numberOfWeeks: prevState.numberOfWeeks + 1 }
    }

    static initialState = {
        loading: true,
        switchingInfluencers: true,
        numberOfWeeks: 1,
        today: moment.tz('UTC'),
        queues: []
    }

    static propTypes = {
        loading: PropTypes.bool,
        mini: PropTypes.bool,
        posts: PropTypes.arrayOf(PropTypes.object),
        selectedProfile: PropTypes.object,
        totalScheduledPostsAmount: PropTypes.number
    }

    static defaultProps = {
        loading: true,
        mini: false,
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
            // ...props, // TODO specify each property explicitly so we know what to compare
            loading,
            posts,
            selectedProfile: ProfileSelectorStore.getState().selectedProfile,
            totalScheduledPostsAmount
        }
    },

})(QueueContainer)
