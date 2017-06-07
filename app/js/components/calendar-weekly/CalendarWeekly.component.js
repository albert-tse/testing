import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import moment from 'moment-timezone';
import BigCalendar from 'react-big-calendar';

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);

import QueueItem from '../queue-item';
import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';

import Styles from './styles';
import { columns, stretch } from '../common';

function EventComponent({ event }) {
    let queuePostData = {
        scheduledTime: event.start,
        hash: event.hash
    };

    let queueSlotData = {
        slot: event.start
    };

    return <QueueItem key={event.index} post={queuePostData} showTooltip={true}/>
}

class CalendarWeeklyComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        let events = [{
            index: 0,
            start: moment().add(23, 'hour').toDate(),
            end: moment().add(24, 'hour').toDate(),
            hash: 'fd98dsf'
        }, {
            index: 1,
            start: moment().add(25, 'hour').toDate(),
            end: moment().add(26, 'hour').toDate(),
            hash: '78fh0k'
        }, {
            index: 2,
            start: moment().add(18, 'hour').toDate(),
            end: moment().add(19, 'hour').toDate(),
            hash: 'ff89ko'
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
