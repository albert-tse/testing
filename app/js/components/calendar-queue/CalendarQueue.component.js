import React, { Component } from 'react';
import classnames from 'classnames';
import { Button } from 'react-toolbox';
import moment from 'moment-timezone';
import { compose, onlyUpdateForKeys, pure, withHandlers } from 'recompose';
import map from 'lodash/map';

import { AppContent } from '../shared';
import Queue from '../queue';
import ProfileSelector from '../multi-influencer-selector';

import Styles from './styles';
import { columns, stretch } from '../common';

/**
 * Pure component for Calendar > Queue view
 * Renders a list of scheduled posts and empty time slots starting from now to initially the next 7 days
 * @param {object} props contains timeslots and scheduled posts to show
 * @param {boolean} props.isEnabled if it isn't set to true, show a Call To Action that encourages user to connect profiles
 * @return {React.Component}
 */
function CalendarQueueComponent ({
    isEnabled,
    loadMore,
    queues
}) {
    return isEnabled ? (
       <div className={columns}>
            <ProfileSelector isPinned disableDisconnectedInfluencers />
            <AppContent id="CalendarQueue"  className={classnames(stretch, Styles.bottomPadding)}>
                {map(queues, function renderQueue({ title, queueItems }, index) {
                    return <Queue key={index} title={title} items={queueItems} />
                })}
                <Button className={Styles.loadMoreButton} raised accent label="Next Week" onClick={loadMore} />
            </AppContent>
        </div>
    ) : <div />;
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

export default compose(
    withHandlers({ loadMore }),
    pure
)(CalendarQueueComponent);
