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
        this.updateSelectedDate = this.updateSelectedDate.bind(this);
        this.updateSelectedTime = this.updateSelectedTime.bind(this);
        this.state = {
            selectionIndex: 0,
            selectedDate: new Date()
        };
    }

    /**
     * Define the component
     * Top portion is for display while the bottom switches between calendar/analog clock or confirmation screen * @return {JSX}
     */
    render() {
        const selectedDate = moment(this.state.selectedDate);
        const ctaLabel = ctaLabels[this.state.selectionIndex];

        return (
            <section className={Styles.scheduler}>
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
                            <div className={Styles.displayAMPM}>
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
                                onChange={this.updateSelectedDate}
                            />
                        </div>
                        {this.state.selectionIndex > selectionIndex.DATE && this.state.selectionIndex < selectionIndex.CONFIRM && (
                            <Clock
                                format="ampm"
                                display={this.state.selectionIndex === selectionIndex.HOUR ? 'hours' : 'minutes' }
                                onChange={this.updateSelectedTime}
                                theme={clockTheme}
                                time={new Date(this.state.selectedDate)}
                            />
                        )}
                    </section>
                </div>
                <footer className={Styles.cta}>
                    <Button accent raised label={ctaLabel} onClick={() => this.setState({ selectionIndex: this.state.selectionIndex + 1 })} />
                </footer>
            </section>
        );
    }

    /**
     * Call once user picks a date from the calendar
     * Move on to picking an hour
     * @param {Date} selectedDate date picked from the calendar
     */
    updateSelectedDate(selectedDate) {
        this.setState({
            selectedDate
            // selectionIndex: this.state.selectionIndex + 1
        });
    }

    /**
     * Call once user picks either an hour or minute from time picker
     * @param {Date} selectedDate
     */
    updateSelectedTime(selectedDate) {
        this.setState({
            selectedDate,
            selectionIndex: this.state.selectionIndex + (this.state.selectionIndex < selectionIndex.MINUTE ? 1 : 0)
        }, () => console.log(this.state.selectionIndex));
    }

}

const Calendar = calendarFactory(IconButton);
const selectionIndex = {
    DATE: 0,
    HOUR: 1,
    MINUTE: 2,
    CONFIRM: 3
};

const ctaLabels = {
    0: 'Choose Time',
    1: 'Choose Hour',
    2: 'Schedule'
};

const selectionTypes = [ selectionIndex.DATE, selectionIndex.HOUR, selectionIndex.MINUTE, selectionIndex.CONFIRM ];
