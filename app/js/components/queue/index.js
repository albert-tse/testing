import React, { Component } from 'react';
import { AppContent } from '../shared';
import ProfileSelector from '../multi-influencer-selector';
import { columns, stretch } from '../common';

class Queue extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={columns}>
                <ProfileSelector isPinned />
                <AppContent id="Queue" className={stretch}>
                    <h1 className={stretch}>QUEUE PLACEHOLDER</h1>
                </AppContent>
            </div>
        );
    }
}

export default Queue;
