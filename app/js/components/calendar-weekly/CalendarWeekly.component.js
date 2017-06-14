import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import moment from 'moment-timezone';
import BigCalendar from 'react-big-calendar';
import { map } from 'lodash';

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

    return <QueueItem key={event.index} {...event.post} timeslot={moment(event.start).format('MMM D z')} mini={true}/>
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
    }

    render() {
        let events = map(this.props.scheduledPosts, function(el, i){
            return {
                index: i,
                start: moment(el.scheduledTime).toDate(),
                end: moment(el.scheduledTime).add(1, 'hour').toDate(),
                post: el
            };

        });

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

        const { selectedProfile } = this.props.profiles;

        return selectedProfile && ! /^inf/.test(selectedProfile.id) ? (
            <div className={columns}>
                <ProfileSelector isPinned disableDisconnectedInfluencers />
                <AppContent id="CalendarWeekly"  className={stretch}>
                        <BigCalendar
                            events={events}
                            views={views}
                            defaultView={'week'}
                            components={components}
                            formats={formats}
                            eventPropGetter={eventProps}
                          />
                </AppContent>
            </div>
        ) : <div />;
    }
}

export default CalendarWeeklyComponent;
