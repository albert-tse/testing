import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import moment from 'moment-timezone';
import extend from 'lodash/extend';
import filter from 'lodash/filter';
import defer from 'lodash/defer';
import map from 'lodash/map';

import QueueItemCollection from '../queue-item/QueueItemCollection.component';
import CTAToEditSchedule from '../null-states/CTAToEditSchedule.component';

import Styles from './styles';

const DAYS_IN_A_WEEK = 7;

export default class QueueComponent extends Component {

    constructor(props) {
        super(props);

        //props.reloadPosts();

        this.state = {
            numberOfWeeks: 1,
            today: moment.tz('UTC'),
            scheduledPosts: [],
            loadMore: ::this.loadMore
        };

        this.state = extend(this.state, this.convertPropsToState(props));
    }

    componentWillReceiveProps(nextProps){
        if(this.props.SelectedProfile != nextProps.SelectedProfile){
            //nextProps.reloadPosts();
        }

        this.setState(this.convertPropsToState(nextProps));
    }

    convertPropsToState(props, numWeeksOverride){
        var scheduledPosts = props.ScheduledPosts.posts;

        var state = {};

        var queues = [];
        var startDate = this.state.today.tz(props.SelectedProfile.timezone).startOf('day');

        var numberOfWeeks = this.state.numberOfWeeks;
        if(numWeeksOverride){
            numberOfWeeks = numWeeksOverride;
            state.numberOfWeeks = numWeeksOverride;
        }

        for(var i=0; i<(numberOfWeeks*DAYS_IN_A_WEEK); i++){
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
                scheduledPosts: filter(scheduledPosts, function(post){
                    post.time.tz(props.SelectedProfile.timezone);
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

        state.queues = queues;

        return state;
    }

    render() {
        const {
            loadMore,
            ScheduledPosts,
            SelectedProfile,
            mini,
            onDeleteCall
        } = this.props;

        const {
            queues
        } = this.state;

        const hasScheduledPosts = ScheduledPosts.posts.length;
        const hasTimeslots = Object.keys(SelectedProfile.slots).length;

        console.log('QueueComponent:render', hasScheduledPosts, hasTimeslots);

        let CallToAction = props => <div />;

        if (hasScheduledPosts && !hasTimeslots) {
            CallToAction = CTAToEditSchedule;
        }

        return (
            <div className={Styles.queueContainer}>
                <CallToAction />
                {map(queues, function renderQueue(queue, index) {
                    return (<QueueItemCollection
                        key={index}
                        queue={queue}
                        mini={mini}
                        selectedProfile={SelectedProfile}
                        onDeleteCall={onDeleteCall}
                    />);
                })}
                <Button className={Styles.loadMoreButton} raised accent label="Next Week" onClick={this.state.loadMore} />
            </div>
        );
    }

    loadMore(){
        let selectedProfile = this.props.SelectedProfile;

        if (selectedProfile) {

            let start = moment.tz(this.state.today, selectedProfile.timezone).startOf('day');
            let end = moment.tz(this.state.today, selectedProfile.timezone).add(this.state.numberOfWeeks + 1, 'weeks').endOf('day');

            defer(this.props.getScheduledPosts, selectedProfile.id, start, end);
        }

        var newState = this.convertPropsToState(this.props, this.state.numberOfWeeks + 1);
        this.setState(newState);
    }

}
