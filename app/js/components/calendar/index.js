import React, { Component } from 'react';
import AltContainer from 'alt-container';

import CalendarComponent from './Calendar.component';
import ProfileActions from '../../actions/Profile.action';

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
