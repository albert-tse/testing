import React from 'react';
import { compose, defaultProps, pure, withHandlers, withProps, withState } from 'recompose';
import { Radio } from 'antd';
import { defer, find, includes, map } from 'lodash';

import Config from '../../../config';
import History from '../../../history';

/**
 * Calendar Menu
 * A sub-navigation for the Calendar view that routes user to sub-views
 * that manages scheduling
 * @param {object} props implicit here because we destruct it immediately
 * @param {function} changeSegment is called whenever user clicks on one of the nav items
 * @param {string} defaultValue initial route to the Calendar sub-view
 * @param {array} segments is a set of nav items to show on the menu
 * @return {JSX} pure component
 */
function CalendarMenu({
    changeSegment,
    currentSegment,
    defaultValue,
    segments
}) {
    return (
        <Radio.Group onChange={changeSegment} defaultValue={defaultValue}>
            {map(segments, function (segment, index) {
                return (
                    <Radio.Button
                        key={index}
                        value={segment.value}
                        checked={segment === currentSegment}
                    >
                        {segment.label}
                    </Radio.Button>
                );
            })}
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
function changeSegment(props) {
    return function onChangeSegment (evt) {
        const { target: { value } } = evt;
        const currentSegment = find(props.segments, { value });
        if (includes(props.segments, currentSegment)) {
            props.setCurrentSegment(currentSegment);
            defer(props.pushRoute, value);
        }
    };
}

export default compose(
    withProps(function (props) {
        const currentSegment = find(segments, { value: props.defaultValue }) || segments[0];

        return {
            changeSegment,
            currentSegment,
            defaultValue: currentSegment.value,
            pushRoute: History.push,
            segments
        };
    }),
    withState('currentSegment', 'setCurrentSegment', segments[0]),
    withHandlers({ changeSegment }),
    pure,
)(CalendarMenu);
