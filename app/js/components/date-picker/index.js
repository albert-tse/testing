import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import calendarFactory from 'react-toolbox/lib/date_picker/Calendar';
import calendarTheme from './styles.calendar';
import moment from 'moment';
import classnames from 'classnames';

import Styles from './styles.scss';

export default class DatePicker extends Component {

    constructor(props) {
        super(props);
        this.updateParent = this.props.onChange;
        this.updateSelectedDate = this.updateSelectedDate.bind(this);
        this.state = {
            selectedDate: new Date(),
            selecting: selectionTypes[0]
        };
    }

    render() {
        const selectedDate = moment(this.state.selectedDate);

        return (
            <div className={Styles.container}>
                <header className={Styles.display}>
                    <p className={Styles.displayDay}>{selectedDate.format('dddd')}</p>
                    <div className={classnames(Styles.displayDate, this.state.selecting === selectionIndex.DATE && Styles.active)}>
                        <p className={Styles.displayMonthYear}>{selectedDate.format('MMM YYYY')}</p>
                        <p className={Styles.displayDateth}>{selectedDate.format('Do')}</p>
                    </div>
                    <div className={Styles.timeGroup}>
                        <p className={Styles.displayHourMinutes}>
                            <span className={classnames(Styles.displayHour, this.state.selecting === selectionIndex.HOUR && Styles.active)}>{selectedDate.format('h')}</span>
                            <span>:</span>
                            <span>{selectedDate.format('mm')}</span>
                        </p>
                        <div className={Styles.displayAMPM}>
                            <p className={classnames(Styles.ampm)}>AM</p>
                            <p className={classnames(Styles.ampm)}>PM</p>
                        </div>
                    </div>
                </header>
                <div className={classnames(this.state.selecting !== selectionIndex.DATE && Styles.hide)}>
                    <Calendar 
                        handleSelect={this.nextStep}
                        minDate={moment().subtract(1, 'day').toDate()}
                        selectedDate={this.state.selectedDate}
                        theme={calendarTheme}
                        onChange={this.updateSelectedDate}
                    />
                </div>
            </div>
        );
    }

    updateSelectedDate(selectedDate) {
        this.setState({
            selectedDate,
            selecting: selectionTypes[selectionIndex.HOUR]
        }, () => console.log(this.state));
    }

}

const Calendar = calendarFactory(IconButton);
const selectionIndex = {
    DATE: 0,
    HOUR: 1,
    MINUTE: 2,
    AMPM: 3
};

const selectionTypes = [ selectionIndex.DATE, selectionIndex.HOUR, selectionIndex.MINUTE, selectionIndex.AMPM ];
