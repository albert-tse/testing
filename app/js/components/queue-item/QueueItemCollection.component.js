import React from 'react';
import Container from 'alt-container';
import { compose, pure, setPropTypes, withProps } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import differenceBy from 'lodash/differenceBy';

import QueueItem from '../queue-item';

import Styles from './styles';

/**
 * Displays a set of timeslots/scheduled posts for a given day
 * @param {string} title usually displays a formatted date
 * @param {array} items is an array of objects that may either be timeslots or scheduled posts
 * @param {boolean} showTooltip set this to true if the Queue will only show minified queue items
 * @return {React.Component}
 * TODO: remove onDeleteCall from QueueItemCollection?
 */
class QueueItemCollection extends React.Component {
    render() {
        const {
            queue,
            mini,
            selectedProfile,
            onDeleteCall,
            ...props
        } = this.props;

        const emptySlots = differenceBy(queue.timeslots, queue.scheduledPosts, function(el){
            return el.time.format('HH:mm');
        });
        const items = queue.scheduledPosts.concat(emptySlots);
        items.sort(function(a,b){
            return a.time-b.time;
        });

        return (
            <section>
                <h1 className={mini ? Styles.titleMini : Styles.title}>{queue.date.format('dddd, MMMM D, YYYY')}</h1>
                {items.length > 0 ? (
                    <ul className={mini ? Styles.itemListMini : Styles.itemList}>
                        {items.map(item => (
                            <QueueItem
                                key={item.slotId || item.id}
                                mini={mini}
                                selectedProfile={selectedProfile}
                                item={item}
                                onDeleteCall={onDeleteCall}
                            />
                        ))}
                    </ul>
                ) : <div className={mini ? Styles.noTimeslotsMini : Styles.noTimeslots}>No timeslots found</div>}
            </section>
        )
    }
}

export default compose(
    setPropTypes({
        title: PropTypes.string,
        items: PropTypes.array
    }),
    pure
)(QueueItemCollection);
