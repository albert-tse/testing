import React from 'react';
import { compose, pure } from 'recompose';

import { Toolbars } from '../toolbar';
import MultiInfluencerSelector from '../multi-influencer-selector';

import Styles from './styles';

function CalendarComponent({
    route: { path },
    // Subview ie. My Links, Queue, and Edit Schedule components
    children: subview
}) {
    return (
        <div className={Styles.columns}>
            <MultiInfluencerSelector isPinned />
            <div className={Styles.stretch}>
                <Toolbars.Calendar />
                {subview}
            </div>
        </div>
    );
}

const Calendar = compose(
    pure
)(CalendarComponent);

export default Calendar;
