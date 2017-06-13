import React, { Component } from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import PropTypes from 'prop-types';

import ScheduledPostStore from '../../stores/ScheduledPost.store';
import ProfileSelectorStore from '../../stores/ProfileSelector.store';
import FilterStore from '../../stores/Filter.store';
import UserStore from '../../stores/User.store';

import FilterActions from '../../actions/Filter.action';
import ProfileSelectorActions from '../../actions/ProfileSelector.action';
import ScheduledPostActions from '../../actions/ScheduledPost.action';

import QueueContainer from './Queue.container';
import QueueItemCollection from '../queue-item/QueueItemCollection.component';

export default class Queue extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // FilterActions.update({calendarQueueWeek: 1});
        // ScheduledPostActions.getScheduledPosts();
    }

    render() {
        return (
            <QueueContainer
                inject={{
                    mini: this.props.mini
                }}
                actions={FilterActions}
                stores={{ ScheduledPostStore, ProfileSelectorStore, FilterStore }}
                {...this.props}
            />
        )
    }

}
