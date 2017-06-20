import React, { Component } from 'react';
import classnames from 'classnames';
import { Button } from 'react-toolbox';
import moment from 'moment-timezone';
import map from 'lodash/map';

import { AppContent } from '../shared';
import Queue from '../queue';
import ProfileSelector from '../multi-influencer-selector';
import { CTAToAddProfiles } from '../null-states';
import ArticleDialogs from '../shared/article/ArticleDialogs.component';

import Styles from './styles';
import { columns, stretch } from '../common';

import QueueItemCollection from '../queue-item/QueueItemCollection.component';

/**
 * Pure component for Calendar > Queue view
 * Renders a list of scheduled posts and empty time slots starting from now to initially the next 7 days
 * @param {object} props contains timeslots and scheduled posts to show
 * @param {boolean} props.isEnabled if it isn't set to true, show a Call To Action that encourages user to connect profiles
 * @return {React.Component}
 */
function CalendarQueueComponent ({
    isEnabled,
}) {
    return (
       <div className={columns}>
           <AppContent id="CalendarQueue"  className={classnames(stretch, Styles.bottomPadding)}>
               {isEnabled ? <Queue /> : <CTAToAddProfiles />}
               {/* TODO we need to add isEnabled && isLoading so we don't show CTA when it's just loading */}
               <ArticleDialogs fullscreen />
           </AppContent>
        </div>
    );
}

export default CalendarQueueComponent;
