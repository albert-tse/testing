import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import moment from 'moment-timezone';
import BigCalendar from 'react-big-calendar';
import map from 'lodash/map';
import each from 'lodash/each';
import differenceBy from 'lodash/differenceBy';

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);

import QueueItem from '../queue-item';
import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';

import Styles from './styles';
import { columns, stretch } from '../common';
import { CTAToAddProfiles } from '../null-states';

const SCHEDULED_POST_FORMAT = 'hh:mma (z)';

function EventComponent({ event }) {
    return (
        <QueueItem
            key={event.index}
            timeslot={moment(event.start).format('MMM D z')}
            mini
            {...event.post}
        />
    )
}

function eventProps(){
    return {
        className: false,
        style: {
            padding: 0,
            border: 0,
            borderRadius: '3px',
            overflow: 'initial'
        }
    };
}

class CalendarWeeklyComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            selectedDate: new Date()
        };
    }

    render() {

        if (this.state) {

            this.state.events = this.generateEvents(this.state.selectedDate);

            let views = ['week'];

            let components = {
                week: {
                    event: EventComponent
                }
            }

            let formats = {
                eventTimeRangeFormat: ({ start }, culture, localizer) => {
                  return localizer.format(start, 'MMMM Do YYYY, h:mm:ss a');
                },
                dayFormat: (date, culture, localizer) => {
                  return localizer.format(date, 'ddd MM/DD');
                }
            }

            const { selectedProfile } = this.props.profiles;
            const isEnabled = selectedProfile && ! /^inf/.test(selectedProfile.id);

            return (
                <div className={columns}>
                    {isEnabled && <ProfileSelector isPinned disableDisconnectedInfluencers />}
                    <AppContent id="CalendarWeekly"  className={stretch}>
                        {isEnabled ? (
                            <BigCalendar
                                events={this.state.events}
                                views={views}
                                defaultView={'week'}
                                components={components}
                                formats={formats}
                                eventPropGetter={eventProps}
                                onNavigate={::this.handleNavigation}
                            />
                        ) : <CTAToAddProfiles />}
                    </AppContent>
                </div>
            );
        } else {
            return false;
        }
    }

    handleNavigation(selectedDate, view) {
        this.props.reloadScheduledPosts(selectedDate);

        let newState = {};
        newState.selectedDate = selectedDate;

        this.setState(newState);
    }

    generateEvents(selectedDate) {
        if (this.state && this.props.profiles.selectedProfile) {

            // Build list of scheduled post items
            let posts = map(this.props.scheduledPosts, (el, i) => {
                const { timezone } = this.props.profiles.selectedProfile;
                const timeslot = moment.tz(el.scheduledTime + '+00:00', timezone);
                return {
                    index: i,
                    start: moment(timeslot).toDate(),
                    end: moment(timeslot).add(1, 'hour').toDate(),
                    post: {
                        ...el,
                        timeslot: moment(timeslot).format(SCHEDULED_POST_FORMAT)
                    }
                };

            });

            // Generate timeslots for the visible week

            // Get start of week
            const { timezone } = this.props.profiles.selectedProfile;
            let currentDate = moment.tz(selectedDate, timezone).startOf('week');

            let generatedSlots = [];

            const { selectedProfile } = this.props.profiles;

            let slotIndex = posts.length;

            if (selectedProfile) {
                let slots = selectedProfile.slots;

                for (let i = 0; i < 7; i++) {
                    let slotsForDay = slots[i];

                    if (slotsForDay) {
                        each(slotsForDay, (slot) => {
                            let slotTimestamp = currentDate.format('YYYY-MM-DD ') + slot.timestamp;
                            let slotTime = moment.tz(slotTimestamp, timezone);

                            generatedSlots.push({
                                index: slotIndex,
                                start: moment(slotTime).toDate(),
                                end: moment(slotTime).add(1, 'hour').toDate(),
                                post: {
                                    slotId: true,
                                    timeslot: slotTime.format('hh:mma (z)')
                                }
                            });

                            slotIndex++;
                        });
                    }

                    currentDate.add(1, 'days');
                }
            }

            let emptySlots = differenceBy(generatedSlots, posts, item => item.start.toString());

            let mergedEvents = posts.concat(emptySlots);

            return mergedEvents;

        } else {
            return [];
        }
    }
}

export default CalendarWeeklyComponent;
