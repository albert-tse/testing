import React, { Component } from 'react';
import { Button, Dropdown, IconButton, Input } from 'react-toolbox';
import calendarFactory from 'react-toolbox/lib/date_picker/Calendar';
import Clock from 'react-toolbox/lib/time_picker/Clock';
import moment from 'moment';
import classnames from 'classnames';

import Config from '../../config';
import calendarTheme from './styles.calendar';
import clockTheme from './styles.clock';
import Styles from './styles';
import InputStyles from './styles.input';

/**
 * This is used to specify the date and time
 */
export default class DatePicker extends Component {

    /**
     * Create a date picker component
     * @param {Object} props are defined at the bottom * @return {DatePicker} */
    constructor(props) {
        super(props);
        this.updateParent = this.props.onChange;
        this.updateTime = this.updateTime.bind(this);
        this.toggleAMPM = this.toggleAMPM.bind(this);
        this.postNow = this.postNow.bind(this);
        this.cancelScheduling = this.cancelScheduling.bind(this);
        this.state = initialState(props);
        this.state.selectedDate = this.props.selectedDate;
    }

    /**
     * Reset component state back to initial
     */
    componentWillMount() {
        this.setState(initialState(this.props));
    }

    componentWillUnmount() {
        // remove event listener
    }

    /**
     * Define the component
     * Top portion is for display while the bottom switches between calendar/analog clock or confirmation screen * @return {JSX}
     */
    render() {
        const selectedDate = moment(this.state.selectedDate);
        const ctaLabel = ctaLabels[this.state.selectionIndex];
        const className = classnames(
            Styles.scheduler,
            this.state.selectionIndex === 3 && Styles.confirming,
            selectedDate.toDate() < new Date() && Styles.cannotSchedule
        );

        return (
            <section className={className}>
                <div className={Styles.container}>
                    <header className={classnames(Styles.display, this.state.flash && Styles.highlight)}>
                        <p className={Styles.displayYear}>{selectedDate.format('YYYY')}</p>
                        <div className={classnames(Styles.displayDate, this.state.selectionIndex === selectionIndex.DATE && Styles.active)}>
                            <p className={Styles.displayMonthYear}>{selectedDate.format('ddd, MMM D')}</p>
                        </div>
                    </header>
                    <section className={Styles.selectors}>
                        {this.state.selectionIndex === selectionIndex.DATE && (
                            <Calendar
                                handleSelect={this.nextStep}
                                minDate={moment().subtract(1, 'day').toDate()}
                                selectedDate={this.state.selectedDate}
                                theme={calendarTheme}
                                onChange={this.update.bind(this, 'selectedDate')}
                            />
                        )}
                        {this.state.selectionIndex > selectionIndex.DATE && this.state.selectionIndex <= selectionIndex.MINUTE && (
                            <div>
                                <Clock
                                    format="ampm"
                                    display={this.state.selectionIndex === selectionIndex.HOUR ? 'hours' : 'minutes' }
                                    onChange={this.updateTime}
                                    theme={clockTheme}
                                    time={new Date(this.state.selectedDate)}
                                />
                                <div className={Styles.timeGroup}>
                                    <div className={Styles.displayHourMinutes}>
                                        <Input theme={InputStyles} className={classnames(this.state.selectionIndex === selectionIndex.HOUR && Styles.active)} value={selectedDate.format('h')} onChange={this.updateHourMinute.bind(this, 'hour')} />
                                        <span>:</span>
                                        <Input theme={InputStyles} className={classnames(this.state.selectionIndex === selectionIndex.MINUTE && Styles.active)} value={selectedDate.format('mm')} onChange={this.updateHourMinute.bind(this, 'minute')} />
                                    </div>
                                    <div className={Styles.displayAMPM} onClick={this.toggleAMPM}>
                                        <p className={classnames(Styles.ampm, selectedDate.hour() < 12 && Styles.active)}>AM</p>
                                        <p className={classnames(Styles.ampm, selectedDate.hour() >= 12 && Styles.active)}>PM</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <p className={Styles.warning}>Looks like you are selecting a time in the past. Please choose a later time.</p>
                    </section>
                </div>
                <footer className={Styles.cta}>
                    {this.renderBackButton()}
                    <Button
                        accent
                        raised
                        label={ctaLabel}
                        onClick={this.update.bind(this, 'selectionIndex', this.state.selectionIndex + 1)}
                        disabled={this.state.selectionIndex >= selectionIndex.HOUR && selectedDate.toDate() < new Date()} />
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
            return <Button label="Back" onClick={this.cancelScheduling} neutral={false} />;
        } else {
            return <Button neutral={false} label="Back" onClick={this.update.bind(this, 'selectionIndex', this.state.selectionIndex - 1)} />;
        }
    }

    /**
     * Cancel scheduling post
     */
    cancelScheduling() {
        this.updateParent(null);
    }

    /**
     * Call once user picks a date from the calendar
     * @param {String} key name of the property found in current state (ie. selectedDate or selectionIndex)
     * @param {mixed} value can either be the selected date or the index of the screen to switch to
     */
    update(key, value) {
        if (key === 'selectionIndex' && value > selectionIndex.MINUTE) {
            this.updateParent({ selectedDate: this.state.selectedDate, schedule: true });
        } else {
            this.setState({ [key]: value });
            if (key === 'selectedDate') {
                this.updateParent({ selectedDate: value });
            }
        }
    }

    /**
     * When choosing the hour, move on to the selecting minutes immediately
     * @param {Date} selectedDate
     */
    updateTime(selectedDate) {
        this.setState({
            selectedDate,
            selectionIndex: this.state.selectionIndex === selectionIndex.HOUR ? selectionIndex.MINUTE : this.state.selectionIndex
        });

        this.updateParent({ selectedDate });
    }

    /**
     * Update the hour and minute
     * @param {String} type can be hour or minute
     * @param {String} value can either be the hour or minute entered
     */
    updateHourMinute(type, value) {
        if (type === 'hour') {
            let selectedDate = moment(this.state.selectedDate);
            value = parseInt(value) || 0;

            if (value > 12) {
                value %= 10;

                if (value !== 0) {
                    selectedDate = selectedDate.hour(value % 10).toDate();
                    this.setState({ selectedDate });
                }
            } else {
                selectedDate = selectedDate.hour(value).toDate();
                this.setState({ selectedDate });
            }
        } else if (type === 'minute') {
            if (value < 60) {
                this.setState({
                    selectedDate: moment(this.state.selectedDate).minute(parseInt(value)).toDate()
                });
            } else {
                this.setState({
                    selectedDate: moment(this.state.selectedDate).minute(parseInt(value) % 10).toDate()
                });
            }
        }
    }

    /**
     * Post immediately instead of scheduling this post
     */
    postNow() {
        this.setState({
            selectedDate: new Date(),
            selectionIndex: selectionIndex.MINUTE
        });
    }

    toggleAMPM() {
        let selectedDate = moment(this.state.selectedDate);
        const hour = selectedDate.hours();

        if (hour === 0) {
            selectedDate = selectedDate.hours(12).toDate();
        } else if (hour === 12) {
            selectedDate = selectedDate.hours(0).toDate();
        } else {
            selectedDate = selectedDate[hour > 12 ? 'subtract' : 'add'](12, 'hours').toDate()
        }
        this.setState({ selectedDate });
    }

}

const Calendar = calendarFactory(IconButton);

const initialState = props => {
    const selectedDate = props && props.selectedDate && props.selectedDate > new Date()
        ? moment(props.selectedDate).toDate()
        : moment().add(1, 'hour').toDate();

    return {
        selectionIndex: 0,
        selectedDate
    };
};

const selectionIndex = {
    DATE: 0,
    HOUR: 1,
    MINUTE: 2
};

const ctaLabels = {
    0: 'Next',
    1: 'Next',
    2: 'Schedule'
};

const selectionTypes = [ selectionIndex.DATE, selectionIndex.HOUR, selectionIndex.MINUTE ];
