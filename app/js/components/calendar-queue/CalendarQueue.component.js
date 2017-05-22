import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import moment from 'moment-timezone';

import { AppContent } from '../shared';
import QueueItem from './QueueItem.component';
import ProfileSelector from '../multi-influencer-selector';

import Styles from './styles';
import { columns, stretch } from '../common';


class CalendarQueueComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
           <div className={columns}>
                <ProfileSelector isPinned disableDisconnectedInfluencers />
                <AppContent id="CalendarQueue"  className={stretch}>
                    {this.props.profiles.selectedProfile && !/^inf/.test(this.props.profiles.selectedProfile.id) ? (
                        this.renderContent(this.props.scheduledPosts, this.props.profiles.selectedProfile, this.props.weeks)
                    ): (
                        <div>loading...</div>
                    )}
                </AppContent>
            </div>
        );
    }

    renderContent(posts, selectedProfile, weeks) {
        posts = posts || [];
        let days = weeks ? weeks * 7 : 7;

        posts = _.sortBy(posts, post => moment.utc(post.scheduledTime));

        // Get slots for currently selected profile, generate slots for current query timeframe, and merge with posts
        let slots = selectedProfile ? selectedProfile.slots : {};
        let profileTimezone = selectedProfile ? selectedProfile.timezone : "UTC";

        let currentTime = moment.utc();
        let currentDay = currentTime.format("d");

        let slotsForCurrentDay = slots[currentDay];

        // If we have slots for the current day, we're going to only display slots that are in the future
        if (slotsForCurrentDay) {
            slotsForCurrentDay = _.filter(slotsForCurrentDay, (slot) => {
                let slotTimestamp = currentTime.format('YYYY MM DD ') + slot.timestamp;
                let slotTime = moment.utc(slotTimestamp);

                return slotTime.isAfter(currentTime);
            });
        }

        // Figure out how many days of slots to generate
        // Should show slots from now until end of day 7 days from now
        let generatedSlots = [];

        _.each(slotsForCurrentDay, (slot) => {
            let slotTimestamp = currentTime.format('YYYY MM DD ') + slot.timestamp;
            let slotTime = moment.utc(slotTimestamp);

            generatedSlots.push(slotTime);
        });

        // Iterate over future days to generate slots
        for (let dayIndex = 1; dayIndex < days; dayIndex++) {
            // Get offset future date
            let futureDate = moment.utc().add(dayIndex, 'days');

            // get day of week for date
            let futureDayOfWeek = futureDate.format("d");

            // check slot map for slots on this day of week
            let slotsForDay = slots[futureDayOfWeek];

            if (slotsForDay) {
                _.each(slotsForDay, (slot) => {
                    let slotTimestamp = futureDate.format('YYYY MM DD ') + slot.timestamp;
                    let slotTime = moment.utc(slotTimestamp);

                    generatedSlots.push(slotTime);
                });
            }
        }

        let queueItems = [];

        // React expects in an array of components ot have unique keys, we're using this for that purpose
        let keyIndex = 0;

        // Keep track of the current slot we're looking at
        let slotsIndex = 0;

        // Keep track of the current scheduled post we're looking at
        let postsIndex = 0;

        while ((slotsIndex < generatedSlots.length || postsIndex < posts.length) && keyIndex < posts.length + generatedSlots.length) {

            if (slotsIndex < generatedSlots.length && (postsIndex === posts.length || posts.length === 0)) {
                // Case for where we only have slots left
                let item = (
                    <QueueItem key={keyIndex} slot={generatedSlots[slotsIndex]}/>
                    );

                queueItems.push(item);

                slotsIndex++;
            } else if (postsIndex < posts.length && (slotsIndex === generatedSlots.length || generatedSlots.length === 0)) {
                // Case for where we only have posts left
                let item = (
                    <QueueItem key={keyIndex} post={posts[postsIndex]}/>
                    );

                queueItems.push(item);

                postsIndex++;
            } else {
                // Get a moment object for the next post's scheduled time
                let postTime = moment.utc(posts[postsIndex].scheduledTime);

                if (generatedSlots[slotsIndex].isBefore(postTime)) {
                    // Case for when the next generated slot time is before the next post's scheduled time
                    let item = (
                        <QueueItem key={keyIndex} slot={generatedSlots[slotsIndex]}/>
                        );

                    queueItems.push(item);

                    slotsIndex++;
                } else if (generatedSlots[slotsIndex].isAfter(postTime)) {
                    // Case for when the next post's scheduled time is before the next generated slot time
                    let item = (
                        <QueueItem key={keyIndex} post={posts[postsIndex]}/>
                        );

                    queueItems.push(item);

                    postsIndex++;
                } else {
                    // Case for when the next generated slot time is equal to the next post's scheduled time
                    let item = (
                        <QueueItem key={keyIndex} post={posts[postsIndex]}/>
                        );

                    queueItems.push(item);

                    // We also increment the slot pointer, since we're displaying the post instead, we want to skip the slot
                    slotsIndex++;
                    postsIndex++;
                }
            }

            keyIndex++;
        }

        if (queueItems.length === 0) {
            queueItems = (<p>Nothing is currently queued.</p>);
        } else {
            let loadMoreButton = (
                    <Button
                        key={keyIndex}
                        className={Styles.loadMoreButton}
                        label="Next Week"
                        raised
                        accent
                        onClick={this.props.loadMore} />
                )

            queueItems.push(loadMoreButton)
        }

        return (
            <div>
                {queueItems}
            </div>
            );
    }
}

export default CalendarQueueComponent;
