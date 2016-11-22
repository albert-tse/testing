import React, { Component } from 'react';
import { DatePicker, Dialog } from 'react-toolbox';
import moment from 'moment';

export default class CustomDateRangeDialog extends Component {

    constructor(props) {
        super(props);
        this.handleToggle = this.props.handleToggle;
        this.handleUpdate = this.props.handleUpdate;
        this.handleDateChange = this.handleDateChange.bind(this);
        this.update = this.update.bind(this);

        this.state = {
            startDate: new Date(new Date().getTime() - 6.048E8),
            endDate: new Date()
        }

        this.actions = [
            { label: 'Cancel', onClick: this.handleToggle },
            { label: 'Update', onClick: this.update, accent: true, raised: true }
        ];
    }

    render() {
        return (
            <Dialog
                style={{width: '30%'}}
                actions={this.actions}
                active={this.props.active}
                onEscKeyDown={this.handleToggle}
                onOverlayClick={this.handleToggle}
                title="Choose Date Range"
            >
                <div>
                    <DatePicker 
                        label="Starting from"
                        sundayFirstDayOfWeek
                        onChange={this.handleDateChange.bind(this, 'startDate')}
                        value={this.state.startDate}
                        autoOk
                    />
                    <DatePicker 
                        label="Ending on"
                        sundayFirstDayOfWeek
                        onChange={this.handleDateChange.bind(this, 'endDate')}
                        value={this.state.endDate}
                        autoOk
                    />
                </div>
            </Dialog>
        );
    }

    handleDateChange (dateType, value) {
        value = moment(value);
        if (dateType === 'startDate') {
            value = value.startOf('day');
        } else {
            value = value.endOf('day');
        }

        this.setState({ [dateType]: value.toDate() });
    }

    update() {
        this.handleUpdate({
            date_start: this.state.startDate,
            date_end: this.state.endDate
        });
    }
}

CustomDateRangeDialog.propTypes = {
    active: React.PropTypes.bool
};
