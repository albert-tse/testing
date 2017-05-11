import React from 'react';
import { compose, pure } from 'recompose';

import { Toolbars } from '../toolbar';

function CalendarComponent({
    route: { path },
    // Subview ie. My Links, Queue, and Edit Schedule components
    children: subview
}) {
    return (
        <div>
            <Toolbars.Calendar />
            {subview}
        </div>
    );
}

const Calendar = compose(
    pure
)(CalendarComponent);

export default Calendar;
