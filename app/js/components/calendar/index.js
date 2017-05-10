import React, { Component } from 'react';
import AltContainer from 'alt-container';

function CalendarComponent({
    history,
    route: { path }
}) {
    return (
        <div>
            <h1>This is a calendar {JSON.stringify(history)}</h1>
        </div>
    );
}

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
