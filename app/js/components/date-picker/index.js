import React, { Component } from 'react';
import { Button, IconButton } from 'react-toolbox';
import calendarFactory from 'react-toolbox/lib/date_picker/Calendar';
import Clock from 'react-toolbox/lib/time_picker/Clock';
import moment from 'moment';
import classnames from 'classnames';

import calendarTheme from './styles.calendar';
import clockTheme from './styles.clock';
import Styles from './styles';

/**
 * This is used to specify the date and time
 */
export default class DatePicker extends Component {

    /**
     * Create a date picker component
     * @param {Object} props are defined at the bottom
     * @return {DatePicker}
     */
    constructor(props) {
        super(props);
        this.updateParent = this.props.onChange;
        this.updateTime = this.updateTime.bind(this);
        this.toggleAMPM = this.toggleAMPM.bind(this);
        this.postNow = this.postNow.bind(this);
        this.state = initialState;
    }

    /**
     * Reset component state back to initial
     */
    componentWillUnmount() {
        this.setState(initialState);
    }

    /**
     * Define the component
     * Top portion is for display while the bottom switches between calendar/analog clock or confirmation screen * @return {JSX}
     */
    render() {
        const selectedDate = moment(this.state.selectedDate);
        const ctaLabel = ctaLabels[this.state.selectionIndex];

        return (
            <section className={classnames(Styles.scheduler, this.state.selectionIndex === 3 && Styles.confirming)}>
                <div className={Styles.container}>
                    <header className={Styles.display}>
                        <p className={Styles.displayDay}>{selectedDate.format('dddd')}</p>
                        <div className={classnames(Styles.displayDate, this.state.selectionIndex === selectionIndex.DATE && Styles.active)}>
                            <p className={Styles.displayMonthYear}>{selectedDate.format('MMM YYYY')}</p>
                            <p className={Styles.displayDateth}>{selectedDate.format('Do')}</p>
                        </div>
                        <div className={Styles.timeGroup}>
                            <p className={Styles.displayHourMinutes}>
                                <span className={classnames(this.state.selectionIndex === selectionIndex.HOUR && Styles.active)}>{selectedDate.format('h')}</span>
                                <span>:</span>
                                <span className={classnames(this.state.selectionIndex === selectionIndex.MINUTE && Styles.active)}>{selectedDate.format('mm')}</span>
                            </p>
                            <div className={Styles.displayAMPM} onClick={this.toggleAMPM}>
                                <p className={classnames(Styles.ampm, selectedDate.hour() < 13 && Styles.active)}>AM</p>
                                <p className={classnames(Styles.ampm, selectedDate.hour() > 12 && Styles.active)}>PM</p>
                            </div>
                        </div>
                    </header>
                    <section className={Styles.selectors}>
                        <div className={classnames(this.state.selectionIndex !== selectionIndex.DATE && Styles.hide)}>
                            <Calendar
                                handleSelect={this.nextStep}
                                minDate={moment().subtract(1, 'day').toDate()}
                                selectedDate={this.state.selectedDate}
                                theme={calendarTheme}
                                onChange={this.update.bind(this, 'selectedDate')}
                            />
                        </div>
                        {this.state.selectionIndex > selectionIndex.DATE && this.state.selectionIndex < selectionIndex.CONFIRM && (
                            <Clock
                                format="ampm"
                                display={this.state.selectionIndex === selectionIndex.HOUR ? 'hours' : 'minutes' }
                                onChange={this.updateTime}
                                theme={clockTheme}
                                time={new Date(this.state.selectedDate)}
                            />
                        )}
                    </section>
                </div>
                <footer className={Styles.cta}>
                    {this.renderBackButton()}
                    <Button accent raised label={ctaLabel} onClick={this.update.bind(this, 'selectionIndex', this.state.selectionIndex + 1)} />
                </footer>
            </section>
        );
    }

    /**
     * Depending on which screen the scheduler is on, 
     * render a back button with the correct label, color, and callback method
     * @return {JSX}
     */
    renderBackButton() {
        if (this.state.selectionIndex === selectionIndex.DATE) {
            return <Button label="Post Now" onClick={this.postNow} />;
        } else {
            return <Button className={classnames(this.state.selectionIndex === selectionIndex.CONFIRM && Styles.invert)} neutral={false} label="Back" onClick={this.update.bind(this, 'selectionIndex', this.state.selectionIndex - 1)} />;
        }
    }

    /**
     * Call once user picks a date from the calendar
     * @param {String} key name of the property found in current state (ie. selectedDate or selectionIndex)
     * @param {mixed} value can either be the selected date or the index of the screen to switch to
     */
    update(key, value) {
        if (key === 'selectionIndex' && value > selectionIndex.CONFIRM) {
            this.updateParent(this.state.selectedDate);
        } else {
            this.setState({ [key]: value });
        }
    }

    /**
     * When choosing the hour, move on to the selecting minutes immediately
     * @param {Date} selectedDate
     */
    updateTime(selectedDate) {
        if (selectedDate > new Date()) {
            this.setState({ 
                selectedDate,
                selectionIndex: this.state.selectionIndex === selectionIndex.HOUR ? selectionIndex.MINUTE : this.state.selectionIndex
            });
        }
    }

    /**
     * Post immediately instead of scheduling this post
     */
    postNow() {
        this.setState({
            selectedDate: new Date(),
            selectionIndex: selectionIndex.CONFIRM
        });
    }

    toggleAMPM() {
        let selectedDate = moment(this.state.selectedDate);
        selectedDate = selectedDate[selectedDate.hours() > 12 ? 'subtract' : 'add'](12, 'hours').toDate()
        selectedDate > new Date() && this.setState({ selectedDate });
    }

}

const Calendar = calendarFactory(IconButton);

const initialState = {
    selectionIndex: 0,
    selectedDate: new Date()
};

const selectionIndex = {
    DATE: 0,
    HOUR: 1,
    MINUTE: 2,
    CONFIRM: 3
};

const ctaLabels = {
    0: 'Set Date',
    1: 'Set Hour',
    2: 'Set Minutes',
    3: 'Post'
};

const selectionTypes = [ selectionIndex.DATE, selectionIndex.HOUR, selectionIndex.MINUTE, selectionIndex.CONFIRM ];
