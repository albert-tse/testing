import React from 'react';
import Container from 'alt-container';
import { compose, pure, setPropTypes, withProps } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import differenceBy from 'lodash/differenceBy';

import ArticleStore from '../../stores/Article.store';
import ShareDialogStore from '../../stores/ShareDialog.store';
import QueueItem from '../queue-item';

import Styles from './styles';

function QueueItemCollection(props) {
    return (
        <Container
            component={enhance(QueueItemCollectionComponent)}
            stores={{ArticleStore, ShareDialogStore}}
            inject={props}
        />
    );
}

/**
 * Displays a set of timeslots/scheduled posts for a given day
 * @param {string} title usually displays a formatted date
 * @param {array} items is an array of objects that may either be timeslots or scheduled posts
 * @param {boolean} showTooltip set this to true if the Queue will only show minified queue items
 * @return {React.Component}
 */
function QueueItemCollectionComponent(props) {
    const {
        queue,
        mini,
        selectedProfile
    } = props;

    const emptySlots = differenceBy(queue.timeslots, queue.scheduledPosts, function(el){
        return el.time.format('hh:mm');
    });
    const items = queue.scheduledPosts.concat(emptySlots);
    items.sort(function(a,b){
        return a.time-b.time;
    });

    return (
        <section>
            <h1 className={props.mini ? Styles.titleMini : Styles.title}>{props.queue.date.format('dddd, MMMM D, YYYY')}</h1>
            {items.length > 0 ? (
                <ul className={mini ? Styles.itemListMini : Styles.itemList}>
                    {items.map(function renderQueueItem(item, index) {
                        return (
                            <QueueItem
                                key={index}
                                mini={mini}
                                selectedProfile={selectedProfile}
                                item={item}
                                isShareDialogOpen={ShareDialogStore.isActive}
                                isArticleModalOpen={!!ArticleStore.viewing}
                                scheduledDate={ShareDialogStore.scheduledDate}
                            />
                        )
                    })}
                </ul>
            ) : <div className={mini ? Styles.noTimeslotsMini : Styles.noTimeslots}>No timeslots found</div>}
        </section>
    );
}

function enhance(component) {
    return compose(
        setPropTypes({
            title: PropTypes.string,
            items: PropTypes.array
        }),
        pure
    )(component);
}

export default QueueItemCollection;
