import React, { Component } from 'react';
import AltContainer from 'alt-container';
import CalendarComponent from './Calendar.component';

export default class Calendar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={CalendarComponent}
                inject={this.props}
            />
        );
    }
}
