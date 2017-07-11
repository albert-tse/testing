import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { compose, pure, setPropTypes } from 'recompose';
import moment from 'moment-timezone';
import extend from 'lodash/extend';
import filter from 'lodash/filter';
import PropTypes from 'prop-types';

import ScheduledPostSource from '../../sources/ScheduledPost.source';
import ProfileSelectorStore from '../../stores/ProfileSelector.store';
import FilterStore from '../../stores/Filter.store';

import FilterActions from '../../actions/Filter.action';

import QueueComponent from './Queue.component';

const fetchScheduledPosts = ScheduledPostSource.getPosts().remote;

const DAYS_IN_A_WEEK = 7;

export default class Queue extends Component {

    constructor(props) {
        super(props);

        this.state = {
            numberOfWeeks: 1,
            today: moment.tz('UTC'),
            scheduledPosts: []
        };
    }

    render() {
        var comp = this;

        var stores = {
            SelectedProfile:  function (props) {
                return {
                    store: ProfileSelectorStore,
                    value: ProfileSelectorStore.getState().selectedProfile
                };
            },

            Filters: FilterStore
        };

        var injected = {
            loadMore: () => {return loadMore.bind(comp);},
            mini: this.props.mini == true,
            scheduledPosts: comp.state.scheduledPosts,
            reloadPosts: () => {return loadScheduledPosts.bind(comp);},
            onDeleteCall: () => {return loadScheduledPosts.bind(comp);}
        }

        var transform = function(props){
            var queues = [];
            var startDate = comp.state.today.tz(props.SelectedProfile.timezone).startOf('day');

            for(var i=0; i<(comp.state.numberOfWeeks*DAYS_IN_A_WEEK); i++){
                var date = startDate.clone().add(i, 'days');
                var endOfDate = date.clone().add(1,'day');

                var slots = props.SelectedProfile.slots[date.day()];
                if(slots){
                    slots = slots.slice(0);
                } else {
                    slots = [];
                }
                
                slots = slots.map((slot) => {
                    var newSlot = extend({}, slot);
                    newSlot.time = date.clone().hour(newSlot.time.hour()).minute(newSlot.time.minute());
                    return newSlot;
                });

                queues[i] = {
                    date: date,
                    timeslots: slots,
                    scheduledPosts: filter(comp.state.scheduledPosts, function(post){
                        return post.time >= date && post.time < endOfDate;
                    })
                }
            }

            //filter out any old posts or time slots that happened today
            if(queues.length > 0){
                queues[0].timeslots = filter(queues[0].timeslots, function(slot){
                    return slot.time > moment.tz(props.SelectedProfile.timezone);
                });
                queues[0].scheduledPosts = filter(queues[0].scheduledPosts, function(post){
                    return post.time > moment.tz(props.SelectedProfile.timezone);
                });
            }

            props.queues = queues;

            return props;
        }

        return (
            <AltContainer
                inject={injected}
                stores={stores}
                actions={FilterActions}
                transform={transform}
                component={QueueComponent}
            />
        )
    }

}

function reOrientTimeSlots(slots, startDate){
    slots = extend({},slots);
    var currentDay = startDate.clone();

    for(var i=0;i<7;i++){
        currentDay.add(i,'day');

        slots[i] = slots[i].map((slot) => {
            slot.time = currentDay.clone().hour(slot.time.hour()).minute(slot.time.minute());
            return slot;
        });
    }

    return slots;
}

function loadMore(){
    this.setState({
        numberOfWeeks: this.state.numberOfWeeks + 1
    });

    loadScheduledPosts.call(this);
}

function loadScheduledPosts(){
    console.log('loading ');
    var comp = this;
    fetchScheduledPosts(false, ProfileSelectorStore.getState().selectedProfile.id, this.state.today, this.state.today.clone().add(this.state.numberOfWeeks, 'weeks')).then(function(posts){
        comp.setState({
            scheduledPosts: posts.data.data.map(function(post){
                post.time = moment.tz(post.scheduledTime, 'UTC').tz(ProfileSelectorStore.getState().selectedProfile.timezone);
                return post;
            })
        });
    });
}
