import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import moment from 'moment-timezone';
import BigCalendar from 'react-big-calendar';

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);

import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';

import Styles from './styles';
import { columns, stretch } from '../common';

function EventComponent({ event }) {
    return (
        <span>
            {event.title}
            <br />
            {event.customThing || ''}
            <p>
                {event.desc}
            </p>
        </span>
    )
}

class CalendarWeeklyComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let events = [{
            title: 'Event 1',
            start: moment().add(23, 'hour').toDate(),
            end: moment().add(24, 'hour').toDate(),
            desc: 'Something Something here',
            customThing: 'custom text'
        }, {
            title: 'Event 2',
            start: moment().add(25, 'hour').toDate(),
            end: moment().add(26, 'hour').toDate(),
            desc: 'Other event here'
        }, {
            title: 'Event 3',
            start: moment().add(18, 'hour').toDate(),
            end: moment().add(19, 'hour').toDate(),
            desc: 'A post'
        }];

        let views = ['week'];

        let components = {
            week: {
                event: EventComponent
            }
        }

        let formats = {
            eventTimeRangeFormat: ({ start }, culture, localizer) => {
              return localizer.format(start, 'MMMM Do YYYY, h:mm:ss a');
            }
        }

        return (
            <div className={columns}>
                <ProfileSelector isPinned disableDisconnectedInfluencers />
                <AppContent id="CalendarWeekly"  className={stretch}>
                        <BigCalendar
                            events={events}
                            views={views}
                            defaultView={'week'}
                            components={components}
                            formats={formats}
                          />
                </AppContent>
            </div>
        );
    }
}

export default CalendarWeeklyComponent;
