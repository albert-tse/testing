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
        this.state = {
            view: props.view || 'post-now',
            selectedDate: new Date()
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.view !== this.props) {
            console.log('changing views', nextProps.view);
            this.setState({
                view: nextProps.view
            });
        }
    }

    render() {
        const { isEditing, disabled } = this.props;

        console.log(isEditing && 'isEditing', disabled && 'isDisabled');
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
                disabled={this.props.disabled} />
        );
    }

    ScheduleButton(props) {
        return /(editing\-)?schedule/.test(this.state.view) && (
            <Button
                theme={Styles}
                accent
                raised
                label="Schedule"
                disabled={this.props.disabled} />
        );
    }

    ScheduleDropdown(props) {
        return (
            <IconMenu
                icon="arrow_drop_down"
                theme={Styles}
                className={classnames(props.disabled && Styles.disabled)}
                onSelect={this.switchViews}
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
                    onChange={selectedDate => this.setState({ selectedDate })}
                />
                <DatePicker
                    format="MM/DD/YYYY"
                    placeholder="Select date"
                    disabledDate={date => date < moment().startOf('day').toDate()}
                    onChange={selectedDate => this.setState({ selectedDate })}
                />
            </div>
        );
    }

    switchViews(selection) {
        delay(() => this.setState({
            view: selection
        }), 300);
    }
}
