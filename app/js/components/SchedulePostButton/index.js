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
        this.ScheduleDropdown = this.ScheduleDropdown.bind(this);
        this.DateAndTimePicker = this.DateAndTimePicker.bind(this);
        this.switchViews = this.switchViews.bind(this);
        this.PostNowButton = this.PostNowButton.bind(this);
        this.ScheduleButton = this.ScheduleButton.bind(this);
        this.updateSelectedDate = this.props.onSelectedDateUpdated.bind(this);
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
        return this.props.selectedDate !== nextProps.selectedDate ||
               this.props.disabled !== nextProps.disabled ||
               this.props.isEditing !== nextProps.isEditing ||
               this.state !== nextState;
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

    PostNowButton(props) {
        return this.state.view === 'post-now' && (
            <Button
                theme={Styles}
                raised
                accent
                label="Post Now"
                disabled={this.isDisabled()}
                onClick={evt => this.updateSelectedDate({ selectedDate: this.state.selectedDate.toDate(), schedule: true })}
            />
        );
    }

    ScheduleButton(props) {
        return /(editing\-)?schedule/.test(this.state.view) && (
            <Button
                theme={Styles}
                accent
                raised
                label="Schedule"
                disabled={this.isDisabled()}
                onClick={evt => this.updateSelectedDate({ selectedDate: this.state.selectedDate.toDate(), schedule: true })}
            />
        );
    }

    ScheduleDropdown(props) {
        return (
            <IconMenu
                icon="arrow_drop_down"
                theme={Styles}
                className={classnames(props.disabled && Styles.disabled)}
                onSelect={selection => this.switchViews(selection)}
            >
                {this.state.view === 'post-now' && <MenuItem value="schedule" caption="Schedule" disabled={props.disabled} />}
                {this.state.view === 'schedule' && <MenuItem value="post-now" caption="Post Now" disabled={props.disabled} />}
            </IconMenu>
        );
    }

    DateAndTimePicker(props) {
        return (
            <div className={Styles.scheduler}>
                <TimePicker
                    use12Hours
                    format="h:mm A"
                    value={moment(this.state.selectedDate)}
                    onChange={selectedDate => this.updateSelectedDate({selectedDate: selectedDate.toDate()})}
                />
                <DatePicker
                    format="MM/DD/YYYY"
                    placeholder="Select date"
                    value={moment(this.state.selectedDate)}
                    disabledDate={date => date < moment().startOf('day').toDate()}
                    onChange={selectedDate => this.updateSelectedDate({selectedDate: selectedDate.toDate()})}
                />
            </div>
        );
    }

    switchViews(selection) {
        delay(() => this.setState({
            view: selection
        }), 300);
    }

    isDisabled() {
        if (this.state.view === 'schedule') {
            return this.props.disabled && moment().isAfter(this.state.selectedDate);
        } else {
            return this.props.disabled;
        }
    }
}
