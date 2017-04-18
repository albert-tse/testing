import React, { Component } from 'react';
import { Button, DatePicker, IconMenu, MenuItem } from 'react-toolbox';
import classnames from 'classnames';
import { delay } from 'lodash';
import moment from 'moment';

import Styles from './styles';

export default class SchedulePostButton extends Component {

    constructor(props) {
        super(props);
        this.ScheduleDropdown = this.ScheduleDropdown.bind(this);
        this.switchViews = this.switchViews.bind(this);
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
                    <this.ScheduleDropdown disabled={disabled} />
                    {/(editing\-)?schedule/.test(this.state.view) && <Button theme={Styles} label="Schedule" ripple={false} disabled={disabled} />}
                    {this.state.view === 'post-now' && <Button theme={Styles} label="Post Now" ripple={false} disabled={disabled} />}
                </div>
                <DatePicker
                    theme={Styles}
                    icon="event"
                    inputFormat={date => moment(date).format('l')}
                    onChange={selectedDate => this.setState({ selectedDate })}
                    value={this.state.selectedDate} />
            </div>
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

    switchViews(selection) {
        delay(() => this.setState({
            view: selection
        }), 300);
    }
}
