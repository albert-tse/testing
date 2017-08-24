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

    /**
     * Loads scheduled posts once the component is ready
     */
    componentDidMount() {
        this.fetchScheduledPosts(this.props, this.state)
    }

    /**
     * Updates component state and may dispatch actions from here depending on which portion of
     * the component changes
     * @param {object} prevProps previous component properties
     * @param {object} prevState previous component state
     */
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

    /**
     * This should only return the wrapped component along with explicitly specified
     * properties it should have so that it will only update when necessary
     */
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


    /**
     * Makes a request for the latest scheduled posts given the current date range
     * @param {object} props component properties
     * @param {object} state component state
     */
    fetchScheduledPosts(props, state) {
        const { selectedProfile } = props
        const { numberOfWeeks, today } = state
        const start = moment.tz(today, selectedProfile.timezone).startOf('day')
        const end = start.clone().add(numberOfWeeks, 'weeks').endOf('day')

        return _.defer(ScheduledPostActions.getScheduledPosts, selectedProfile.id, start, end)
    }

    /**
     * Returns a component that the wrapped component can display if the user needs to take a certain action
     * for instance: setting up scheduled time slots or scheduling a new post
     * @param {object} props component props
     * @return {React.Component|boolean}
     */
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

    /**
     * Returns the start time of day and start time of next day
     * @param {moment} startDate the date to get start time of
     * @param {integer} dayOffset set this to non-zero if you want the start date to be n number of days
     * @return {object}
     */
    getDateRange(startDate, dayOffset = 0) {
        const start = startDate.clone().add(dayOffset, 'days')
        const end = start.clone().add(1, 'day')
        return { start, end }
    }

    /**
     * Given a spec of timeslots for any given day of the week (represented as an integer),
     * return the array of timeslots for the specified day
     * @param {object} timeslots specifies set of timeslots for each day of the week (in integer)
     * @param {integer} day of the week
     * @return {array<object>}
     */
    getProfileTimeslotsForDayOfWeek(timeslots = {}, day) {
        const slots = timeslots[day.day()] || []
        return _.map(slots, slot => {
            return {
                ...slot,
                time: day.clone().hour(slot.time.hour()).minute(slot.time.minute())
            }
        })
    }

    /**
     * Returns an empty array if selected profile neither has timeslots nor scheduled posts
     * @param {object} props component prop containing the selected profile's timeslots
     * @param {object} state contains
     * @return {array}
     */
    getQueues(props, state) {
        if (Object.keys(props.selectedProfile.slots).length > 0 || props.totalScheduledPostsAmount > 0) {
            return state.queues
        } else {
            return []
        }
    }

    /**
     * Combines the selected profile's timeslots with scheduled posts fetched from the server
     * and return an array of Queue objects wherein each object is a combination of empty timeslots and scheduled posts for a given day of the week
     * @param {moment} date the starting date for current view
     * @param {array} posts scheduled posts fetched from server
     * @param {string} timezone selected profile's timezone
     * @param {integer} offsetInDays how many days from starting date is used to determine what next day is
     * @return {object}
     */
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
                // scheduledPosts: _.filter(queue.scheduledPosts, post => post.time > timeNow)
                // XXX We are not filtering scheduled posts because the users wanted to see the possts that went out today
            }
        }

        return queue
    }

    /**
     * Updates component state by creating new set of queues given recently loaded scheduled posts
     * or selected profile's timeslots
     * @param {object} state previous component state
     * @param {object} props component props
     * @return {object}
     */
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

    /**
     * Update the number of days to show for current queue
     * and fetch scheduled posts for those given days
     */
    loadMore = () => {
        const { selectedProfile } = this.props

        if (!!selectedProfile) {
            this.setState(this.incrementNumberOfWeeks, () => {
                this.fetchScheduledPosts(this.props, this.state)
            })
        }
    }

    /**
     * Reset the component state back to initial when changing selected profile
     * @param {object} prevState previous component state
     * @param {object} props component props
     * @return {object}
     */
    resetView(prevState, props) {
        return {
            loading: true,
            numberOfWeeks: 1,
            switchingInfluencers: true
        }
    }

    /**
     * Increments the number of weeks to show in current view by one
     * @param {object} prevState previous component state
     * @param {object} props component props
     * @return {object}
     */
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

    /**
     * Defines which stores the component should listen to for updates
     * @param {object} props component props
     * @return {array}
     */
    listenTo(props) {
        return [ProfileSelectorStore, ScheduledPostStore]
    },

    /**
     * Defines the properties to give to the container based on the
     * latest data obtained from store
     * @param {object} props component props
     * @return {object}
     */
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
