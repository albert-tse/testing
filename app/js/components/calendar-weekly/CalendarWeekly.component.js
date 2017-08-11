import React from 'react';
import moment from 'moment-timezone';
import BigCalendar from 'react-big-calendar';

BigCalendar.setLocalizer(
    BigCalendar.momentLocalizer(moment)
);

import QueueItem from '../queue-item';
import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';

import { columns, stretch } from '../common';
import { CTAToAddProfiles } from '../null-states';

import ArticleDialogs from '../shared/article/ArticleDialogs.component';

import History from '../../history'
import config from '../../config'

const SCHEDULED_POST_FORMAT = 'hh:mma (z)';

class CalendarWeeklyComponent extends React.PureComponent {

    componentWillMount() {
        this.enabledViews = [ 'week' ]
        this.components = {
            week: {
                event: EventComponent
            }
        }

        this.formats = {
            eventTimeRangeFormat: ({ start }, culture, localizer) => (
                localizer.format(start, 'MMMM Do YYYY, h:mm:ss a')
            ),
            dayFormat: (date, culture, localizer) => (
                localizer.format(date, 'ddd MM/DD')
            )
        }
    }

    render() {
        return (
            <div className={columns}>
                {this.props.isEnabled && <ProfileSelector isPinned disableDisconnectedInfluencers />}
                <AppContent id="CalendarWeekly" className={stretch}>
                    {this.props.isEnabled ? (
                        <BigCalendar
                            events={this.props.events}
                            defaultView="week"
                            views={this.enabledViews}
                            components={this.components}
                            formats={this.formats}
                            eventPropGetter={eventProps}
                            onNavigate={evt => console.log('I need to navigate')}
                        />
                    ) : <CTAToAddProfiles />}
                </AppContent>
                <ArticleDialogs fullscreen />
            </div>
        )
    }

    // TODO Move this to the container
    handleNavigation(selectedDate, view) {
        this.props.reloadScheduledPosts(selectedDate);

        let newState = {};
        newState.selectedDate = selectedDate;

        this.setState(newState);
    }

}

class EventComponent extends React.PureComponent {

    render() {
        const { event } = this.props

        return (
            <QueueItem
                key={event.index}
                timeslot={moment(event.start).format('MMM D z')}
                mini
                item={event.post}
                slotOnClick={this.redirectToContentView}
            />
        )
    }

    // TODO move this to the container
    redirectToContentView(evt) {
        History.push(config.routes.explore);
    }
}

function eventProps() {
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

export default CalendarWeeklyComponent;
