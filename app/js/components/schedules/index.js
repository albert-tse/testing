import React, { Component } from 'react';

import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';
import { columns, stretch } from '../common';

class Schedules extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={columns}>
                <ProfileSelector isPinned />
                <AppContent id="Schedules" className={stretch}>
                    <h1>SCHEDULES PLACEHOLDER</h1>
                </AppContent>
            </div>
        );
    }
}

export default Schedules;
