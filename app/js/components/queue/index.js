import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { compose, pure, setPropTypes } from 'recompose';
import moment from 'moment-timezone';
import extend from 'lodash/extend';
import filter from 'lodash/filter';
import PropTypes from 'prop-types';

import ScheduledPostSource from '../../sources/ScheduledPost.source';
import ScheduledPostStore from '../../stores/ScheduledPost.store';
import ProfileSelectorStore from '../../stores/ProfileSelector.store';
import FilterStore from '../../stores/Filter.store';

import FilterActions from '../../actions/Filter.action';
import ScheduledPostActions from '../../actions/ScheduledPost.action';

import QueueComponent from './Queue.component';

const fetchScheduledPosts = ScheduledPostSource.getPosts().remote;

export default class Queue extends Component {

    render() {
        var comp = this;

        var stores = {
            SelectedProfile:  function (props) {
                return {
                    store: ProfileSelectorStore,
                    value: ProfileSelectorStore.getState().selectedProfile
                };
            },
            ScheduledPosts: ScheduledPostStore,
            Filters: FilterStore
        };

        var injected = {
            mini: this.props.mini == true
        }

        return (
            <AltContainer
                inject={injected}
                stores={stores}
                actions={ScheduledPostActions}
                component={QueueComponent}
            />
        )
    }

}
