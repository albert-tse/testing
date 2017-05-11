import React from 'react';
import { compose, pure } from 'recompose';

import { Toolbars } from '../toolbar';
import MultiInfluencerSelector from '../multi-influencer-selector';

function CalendarComponent({
    route: { path },
    // Subview ie. My Links, Queue, and Edit Schedule components
    children: subview
}) {
    return (
        <div>
            <Toolbars.Calendar />
            <div style={{ display: 'flex' }}>
                <MultiInfluencerSelector isPinned selectProfile={evt => console.log('select')} deselectProfile={evt => console.log('deselect')} />
                {subview}
            </div>
        </div>
    );
}

const Calendar = compose(
    pure
)(CalendarComponent);

export default Calendar;
