import React from 'react';
import Container from 'alt-container';
import concat from 'lodash/concat';
import defer from 'lodash/defer';
import differenceBy from 'lodash/differenceBy';
import filter from 'lodash/fp/filter';
import flow from 'lodash/fp/flow';
import get from 'lodash/fp/get';
import isEqual from 'lodash/isEqual';
import map from 'lodash/fp/map';
import orderBy from 'lodash/fp/orderBy';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';
import xorBy from 'lodash/xorBy';
import Moment from 'moment-timezone';
import { extendMoment } from 'moment-range';
import { compose, withHandlers } from 'recompose';

import QueueComponent from './Queue.component';

function QueueContainer(props) {
    return (
        <Container
            component={composed(QueueComponent)}
            transform={transform}
            {...props}
        />
    );
}

const moment = extendMoment(Moment);
const DAYS_IN_A_WEEK = 7;
const MONTH_AND_DATE_FORMAT = 'MMM D z';
const SCHEDULED_TIME_PROPERTY = 'scheduledTime';
const TIMESLOT_PROPERTY = 'timestamp';
const TIMESLOT_FORMAT = 'hh:mma (z)';
const QUEUE_TITLE_FORMAT = 'dddd, MMMM D, YYYY';
const DATE_FORMAT = 'MMMM D, YYYY';
const UTC_OFFSET = '+00:00';
const YEAR_MONTH_DAY_FORMAT = 'YYYY-MM-DD';

function composed(component) {
    return compose(
        withHandlers({ loadMore }),
    )(component);
}

/**
 * Determine the props that will be passed down to the component here
 * Store's state data can be found in getComponentProps()
 * @param {object} props may contain store and action set when creating AltContainer
 * @return {object}
 */
function transform(props) {
    const componentProps = flow(
        getDaysInQueue,
        buildQueuesPerDay
    )(getComponentProps(props));

    return {
        queues: componentProps.queues,
        selectedProfile: props.ProfileSelectorStore.selectedProfile,
        mini: componentProps.mini,
        numberOfWeeks: props.FilterStore.calendarQueueWeek,
        scheduledDate: props.ShareDialogStore.scheduledDate,
        update: props.update,
    }
}

/**
 * Fetches next day days from API server
 * @param {object} componentProps
 */
function loadMore({ update, numberOfWeeks }) {
    return function loadMoreCall() {
        update({ calendarQueueWeek: numberOfWeeks + 1 });
    }
}

/**
 * Determine all the data we'll need to compose the props for Calendar Queue component here
 * @return {object}
 */
function getComponentProps({
    FilterStore,
    loadMore,
    mini,
    ProfileSelectorStore,
    ScheduledPostStore
}) {
    let props = {
        mini: mini,
        numberOfWeeks: FilterStore.calendarQueueWeek,
        queues: [],
        selectedProfile: ProfileSelectorStore.selectedProfile,
        scheduledPosts: ScheduledPostStore.posts || [],
        timezone: ProfileSelectorStore.getSelectedProfileTimezone(),
        timeslots: ProfileSelectorStore.getSelectedProfileTimeslots()
    };

    return {
        ...props,
        startDate: moment.tz(props.timezone)
    };
}

function getDaysInQueue({ startDate, numberOfWeeks, ...componentProps }) {
    return {
        ...componentProps,
        daysInQueue: getDaysFromDate(startDate, numberOfWeeks * DAYS_IN_A_WEEK)
    };
}

/**
 * Given a starting date and number of days from it,
 * return all the dates from start to end
 * @param {moment} startDate starting date
 * @param {number} numberOfDays how many days from start to create
 * @return {array}
 */
function getDaysFromDate(startDate, numberOfDays) {
    const endDate = startDate.clone().add(numberOfDays - 1, 'days');
    const datesFromNowToEndDate = moment.range(startDate, endDate).by('day'); // returns an iterable
    return Array.from(datesFromNowToEndDate);
}

/**
 * For each day in the queue, populate it with the corresponding scheduled posts
 * and show any time slots that are not yet filled with scheduled post
 * @param {object} componentProps contains days, timeslots, and scheduled posts
 * @param {array} daysInQueue is where timeslots+scheduled posts will be grouped by
 * @return {object}
 */
function buildQueuesPerDay({ daysInQueue, ...componentProps }) {
    return reduce(daysInQueue, buildQueue, { ...componentProps }); // we're cloning componentProps here to ensure there are no side effects
}

/**
 * Build a queue consisting of scheduled posts and time slots that are not yet filled with posts
 * @param {object} state contains timeslots, scheduled posts, and the queues array to push built queue
 * @param {Date} day a single day for which to filter timeslots and scheduled posts by
 * @return {object}
 */
function buildQueue(state, day) { const queue = flow(
        getTimeslotsForDay,
        getScheduledPostsForDay,
        injectTimeslotsToQueueItems,
        mergeToQueueItems,
        sortQueueItems,
        removeOldTimeslots,
        getTitle
    )({
        day: moment.tz(day, state.timezone),
        timeslots: {...state.timeslots},
        scheduledPosts: [...state.scheduledPosts],
        queueItems: []
    });

    return {
        ...state,
        queues: [ ...state.queues, queue]
    };
}

/**
 * Get the corresponding timeslots for the given day
 * @param {object} queue contains the timeslots and current day info
 * @return {object}
 */
function getTimeslotsForDay(queue) {
    const dayOfWeek = queue.day.format('d');
    return {
        ...queue,
        timeslots: queue.timeslots[dayOfWeek] || []
    }
}

/**
 * Filter out the posts that are not scheduled for the given day
 * @param {object} queue contains all loaded scheduled posts
 * @return {object}
 */
function getScheduledPostsForDay(queue) {
    const timezone = queue.day.tz();
    const monthAndDate = queue.day.format(MONTH_AND_DATE_FORMAT);
    const filteredScheduledPosts = filter(
        function matchesMonthAndDate(scheduledPost) {
            const scheduledTimeAsMonthAndDate = moment.tz(scheduledPost.scheduledTime+UTC_OFFSET, timezone).format(MONTH_AND_DATE_FORMAT);
            return  scheduledTimeAsMonthAndDate === monthAndDate;
        }
    )(queue.scheduledPosts)

    return {
        ...queue,
        scheduledPosts: filteredScheduledPosts
    }
}

/**
 * Insert a common property across shceduled posts and timeslots
 * so that they can be compared and merged later on
 * @param {object} queue containing scheduled posts and timeslots already filtered to one day
 * @return {object}
 */
function injectTimeslotsToQueueItems(queue) {
    const scheduledPosts = map(
        injectTimeslots(SCHEDULED_TIME_PROPERTY, queue.day)
    )(queue.scheduledPosts);

    const timeslots = map(
        injectTimeslots(TIMESLOT_PROPERTY, queue.day)
    )(queue.timeslots);

    return {
        ...queue,
        scheduledPosts,
        timeslots
    }
}

/**
 * Injects the timeslot to a queue item
 * each item's timeslot is converted differently depending on whether it is scheduled post or timeslot
 * Note: Timeslot is timezone agnostic
 * @param {string} propertyName determines what type of queue item it is (ie. schedled post or timeslot)
 * @param {moment} day contains timezone info to use
 * @return {object}
 */
function injectTimeslots(propertyName, day) {
    return function injectTimeslotsToQueueItem(queueItem) {
        const timezone = day.tz();
        let timeslot= {};

        if (propertyName === SCHEDULED_TIME_PROPERTY) { // format: 1970-01-01 01:23:00
            timeslot = moment.tz(queueItem[SCHEDULED_TIME_PROPERTY] + UTC_OFFSET, timezone);
        } else if (propertyName === TIMESLOT_PROPERTY) { // format: 01:23:00
            timeslot = moment.tz(day.format('YYYY-MM-DD ') + queueItem[TIMESLOT_PROPERTY], timezone);
        } else {
            timeslot = moment.tz(timezone);
        }

        return {
            ...queueItem,
            timeslotObject: timeslot,
            timeslotUnix: parseInt(timeslot.format('x')),
            timeslot: timeslot.format(TIMESLOT_FORMAT)
        }
    }
}

/**
 * Merges scheduled posts and timeslots, leaving out timeslots that are filled by scheduled post
 * Note: scheduledPost and timeslots are destructured so that the returned queue will no longer contain it
 * @param {object} queue contains scheduledPost and timeslots to merge
 * @return {object}
 */
function mergeToQueueItems({ scheduledPosts, timeslots, ...queue }) {
    const emptyTimeslots = differenceBy(timeslots, scheduledPosts, 'timeslot')
    return {
        ...queue,
        queueItems: concat(scheduledPosts, emptyTimeslots)
    }
}

/**
 * Sorts the queue items by unix timestamp
 * @param {object} queue
 * @return {object}
 */
function sortQueueItems({ queueItems, ...queue }) {
    return {
        ...queue,
        queueItems: orderBy('timeslotUnix', 'asc')(queueItems)
    }
}

/**
 * Removes any timeslots or scheduled posts whose timeslot is older
 * than now
 * @param {object} queue contains queueItems which is a merge of schedled posts and empty timeslots
 * @return {object}
 */
function removeOldTimeslots({ queueItems, ...queue }) {
    const now = new Date();
    const filteredQueueItems = filter(function timeslotIsNewerThanNow(queueItem) {
        return queueItem.timeslotObject.isAfter(now);
    })(queueItems);

    return {
        ...queue,
        queueItems: filteredQueueItems
    }
}

/**
 * Set the queue's title to current day in month and date format (ie. Jan 3)
 * @param {object} queue Note that we're also going to be removing day property from queue as it will be replaced by title
 * @return {object}
 */
function getTitle({ day, ...queue }) {
    const todaysDate = moment.tz(new Date(), day.tz()).format(YEAR_MONTH_DAY_FORMAT);
    const isQueueDayToday = day.format(YEAR_MONTH_DAY_FORMAT) === todaysDate;
    const title = day.format(isQueueDayToday ? '[Today,] ' + DATE_FORMAT : QUEUE_TITLE_FORMAT);

    return {
        ...queue,
        title
    }
}

export default QueueContainer;
