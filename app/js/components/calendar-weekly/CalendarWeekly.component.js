import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import moment from 'moment-timezone';

import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';

import Styles from './styles';
import { columns, stretch } from '../common';

class CalendarWeeklyComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
           <div className={columns}>
                <ProfileSelector isPinned disableDisconnectedInfluencers />
                <AppContent id="CalendarWeekly"  className={stretch}>
                        <div>Placeholder</div>
                </AppContent>
            </div>
        );
    }
}

export default CalendarWeeklyComponent;
