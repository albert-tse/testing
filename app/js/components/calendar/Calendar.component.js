import React from 'react';
import { compose, pure } from 'recompose';

function CalendarComponent({
    history,
    route: { path }
}) {
    return (
        <div>
            <h1>This is a calendar {JSON.stringify(history)}</h1>
            <p>How are you doing today?</p>
        </div>
    );
}

const Calendar = compose(
    pure
)(CalendarComponent);

export default Calendar;
