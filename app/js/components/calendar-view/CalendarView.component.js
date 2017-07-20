import React from 'react';
import { compose, pure } from 'recompose';

import Toolbar from '../toolbar';
import { CalendarMenu } from '../toolbar/toolbar_components';

import Styles from './styles';

/**
 * Page that has several sub-views that deal with Scheduling
 * @param {object} props is passed by Container component containing stores/actions
 * @param {React.Component} subview child component representing the sub-view
 * @param {string} pathname is used by CalendarMenu to highlight which current subview is being shown
 * @return {React.Component}
 */
function CalendarViewComponent({
    // Subview ie. My Links, Queue, and Edit Schedule components
    children: subview,
    location: { pathname }
}) {
    return (
        <div>
            <Toolbar name="Calendar" center={<CalendarMenu value={pathname} />} />
            {subview}
        </div>
    );
}

export default compose(
    pure
)(CalendarViewComponent);
