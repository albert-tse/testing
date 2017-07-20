import React from 'react';
import { Radio } from 'antd';
import {
    compose,
    defaultProps,
    mapProps,
    pure,
    withHandlers,
    withState
} from 'recompose';
import {
    curry,
    defer,
    find,
    includes,
    map
} from 'lodash';

import Config from '../../../config';
import History from '../../../history';

/**
 * Calendar Menu
 * A sub-navigation for the Calendar view that routes user to sub-views
 * that manages scheduling
 * @param {object} props implicit here because we destruct it immediately
 * @param {function} changeSegment is called whenever user clicks on one of the nav items
 * @param {array} segments is a set of nav items to show on the menu
 * @return {JSX} pure component
 */
function CalendarMenu({
    changeSegment,
    currentSegment,
    segments
}) {
    return (
        <Radio.Group onChange={changeSegment} value={currentSegment.value}>
            {map(segments, (segment, index) => (
                <Radio.Button
                    key={index}
                    value={segment.value}
                    checked={segment === currentSegment}
                >
                    {segment.label}
                </Radio.Button>
            ))}
        </Radio.Group>
    );
}

/**
 * @const {array} lists the nav menu items to show on segmented control
 */
const segments = [
    {
        label: 'My Links',
        value: Config.routes.links
    }, {
        label: 'Queue',
        value: Config.routes.calendarQueue
    }, {
        label: 'Week View',
        value: Config.routes.calendarWeekly
    }, {
        label: 'Edit Schedule',
        value: Config.routes.schedules
    }
];

/**
 * Routes the user to the selected segment so long as it is found on segments
 * @param {object} props of CalendarMenu
 * @param {Event} evt event contains the button that was clicked
 * @param {HTMLElement} evt.target the segment button the user clicked on
 * @param {string} evt.target.value the route to selected segment
 * @return {function} this is called when a segment button is clicked
 */
function changeSegmentHandler(props, evt) {
    const { target: { value } } = evt;
    const currentSegment = find(props.segments, { value });
    if (includes(props.segments, currentSegment)) {
        defer(props.pushRoute, value);
    }
}

/**
 * Determine the component's properties here based on the props passed by the owner
 * @param {object} props passed by the owner
 * @return {object}
 */
function setProps(props) {
    return {
        currentSegment: find(segments, { value: props.value }) || segments[0],
        pushRoute: History.push,
        segments
    };
}

export default compose(
    mapProps(setProps),
    withHandlers({
        changeSegment: curry(changeSegmentHandler)
    }),
    pure,
)(CalendarMenu);
