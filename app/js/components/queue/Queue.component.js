import React from 'react';
import QueueItem from '../queue-item';

import Styles from './styles';

/**
 * Displays a set of timeslots/scheduled posts for a given day
 * @param {string} title usually displays a formatted date
 * @param {array} items is an array of objects that may either be timeslots or scheduled posts
 * @param {boolean} showTooltip set this to true if the Queue will only show minified queue items
 * @return {React.Component}
 */
function Queue ({
    title,
    items,
    showTooltip
}) {
    return (
        <section>
            <h1 className={Styles.title}>{title}</h1>
            <ul>
                {items.map(function renderQueueItem(queueItem, index) {
                    return <QueueItem key={index} {...queueItem} showTooltip={showTooltip} />
                })}
        </ul>
        </section>
    );
}

/**
 * Renders a queue item, which is either a scheduled post or an empty timeslot
 * @param {object} queueItem contains data necessary to render item
 * @param {number} index used for distinguishing queue item in React
 * @return {React.Component}
 */
function renderQueueItem(queueItem, index) {
    return <QueueItem key={index} {...queueItem} />
}

export default Queue;
