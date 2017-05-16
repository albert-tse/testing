import React, { Component } from 'react';

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
                <ProfileSelector isPinned />
                <AppContent id="CalendarQueue"  className={stretch}>
                    {this.renderContent(this.props.posts)}
                </AppContent>
            </div>
        );
    }

    renderContent(posts) {
        let queueItems = false;

        // TODO: get slots for currently selected profile, generate slots for current query timeframe, and merge with posts

        if (Array.isArray(posts)) {
             queueItems = posts.map((post, index) => (
                <QueueItem key={index} link={post}/>
                )
            );
        }

        return (
            <div>
                {queueItems}
            </div>
            );
    }
}

export default CalendarQueueComponent;
