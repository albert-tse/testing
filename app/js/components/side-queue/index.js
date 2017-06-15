import React, { Component } from 'react';

import ArticleStore from '../../stores/Article.store';
import FilterStore from '../../stores/Filter.store';
import ProfileSelectorStore from '../../stores/ProfileSelector.store';
import ScheduledPostStore from '../../stores/ScheduledPost.store';
import ShareDialogStore from '../../stores/ShareDialog.store';

import FilterActions from '../../actions/Filter.action';
import ScheduledPostActions from '../../actions/ScheduledPost.action';

import SideQueueContainer from './SideQueue.container';
import SideQueueComponent from './SideQueue.component';

export default class SideQueue extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        FilterActions.update({ calendarQueueWeek: 1 });
        //ScheduledPostActions.getScheduledPosts();
    }

    render() {
        // actions={{FilterActions}}
        // stores={{ScheduledPostStore, ProfileSelectorStore, FilterStore}}
        return (
            <SideQueueContainer
                component={SideQueueComponent}
                stores={{ArticleStore, ProfileSelectorStore, ShareDialogStore}}
            />
        )
    }
}
