import React, { Component } from 'react';
import { Button, IconMenu, MenuItem } from 'react-toolbox';
import { DatePicker, TimePicker } from 'antd';
import classnames from 'classnames';
import { delay } from 'lodash';
import moment from 'moment';

import Styles from './styles';

export default class SchedulePostButton extends Component {

    constructor(props) {
        super(props);
        this.updateSelectedDate = this.props.onSelectedDateUpdated.bind(this);
        this.submit = this.props.onSubmit.bind(this);
        this.removeSchedule = this.props.onRemoveSchedule.bind(this);
        this.state = {
            view: props.view || 'post-now'
        };

    }

    componentWillReceiveProps(nextProps) {
        let newState = {};
        const selectedDate = moment(nextProps.selectedDate);

        if (nextProps.view !== this.props.view) {
            newState.view = nextProps.view;
        }

        if (selectedDate !== this.state.selectedDate) {
            newState.selectedDate = selectedDate;
        }

        this.setState(newState);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
        const returnable = this.props.selectedDate !== nextProps.selectedDate ||
               this.props.disabled !== nextProps.disabled ||
               this.props.isEditing !== nextProps.isEditing ||
               this.state !== nextState;

        return returnable;
    }

    render() {
        const { isEditing, disabled } = this.props;

        return (
            <div className={Styles.root}>
                <div className={classnames(Styles.buttonWithDropdown, disabled && Styles.disabled)}>
                    <this.ScheduleDropdown />
                    <this.PostNowButton />
                    <this.ScheduleButton />
                </div>
                {this.state.view === 'schedule' && <this.DateAndTimePicker />}
            </div>
        );
    }

    PostNowButton = props => {
        return this.state.view === 'post-now' && (
            <Button
                theme={Styles}
                raised
                accent
                label="Post Now"
                disabled={this.isDisabled()}
                onClick={this.submit}
            />
        );
    }

    ScheduleButton = props => {
        return /(editing\-)?schedule/.test(this.state.view) && (
            <Button
                theme={Styles}
                accent
                raised
                label={(this.props.isEditing ? 'Re-' : '') + "Schedule"}
                disabled={this.isDisabled()}
                onClick={this.submit}
            />
        );
    }

    ScheduleDropdown = props => {
        return (
            <IconMenu
                icon="arrow_drop_down"
                theme={Styles}
                className={classnames(props.disabled && Styles.disabled)}
                onSelect={selection => selection === 'remove-schedule' ? this.removeSchedule() : this.switchViews(selection)}
                position="topRight"
            >
                {this.state.view === 'post-now' && <MenuItem value="schedule" caption="Schedule" disabled={props.disabled} />}
                {this.state.view === 'schedule' && <MenuItem value="post-now" caption="Post Now" disabled={props.disabled} />}
                {this.props.isEditing && <MenuItem value="remove-schedule" caption="Remove Schedule" disabled={props.disabled} />}
            </IconMenu>
        );
    }

    DateAndTimePicker = props => {
        return (
            <div className={Styles.scheduler}>
                <TimePicker
                    use12Hours
                    format="h:mm A"
                    value={moment.tz(this.props.selectedDate, this.props.timezone)}
                    onChange={selectedDate => this.updateSelectedDate({selectedDate: !!selectedDate ? selectedDate.toDate() : moment.tz(moment(), this.props.timezone)})}
                />
                <DatePicker
                    format="MM/DD/YYYY"
                    placeholder="Select date"
                    value={moment(this.props.selectedDate)}
                    disabledDate={date => date < moment().startOf('day').toDate()}
                    onChange={selectedDate => this.updateSelectedDate({selectedDate: !!selectedDate  ? selectedDate.toDate() : moment.tz(moment(), this.props.timezone)})}
                />
            </div>
        );
    }

    switchViews = selection => {
        if (selection === 'post-now') {
            this.updateSelectedDate({ selectedDate: new Date() });
        }

        delay(() => this.setState({
            view: selection
        }), 300);
    }

    isDisabled() {
        if (this.state.view === 'schedule') {
            return this.props.disabled || moment().isAfter(this.state.selectedDate);
        } else {
            return this.props.disabled;
        }
    }
}
