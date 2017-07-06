import React from 'react';
import Container from 'alt-container';
import { compose, pure, setPropTypes, withProps } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

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
function QueueItemCollectionComponent({
    title,
    items,
    isArticleModalOpen,
    isShareDialogOpen,
    showTooltip,
    mini,
    scheduledDate,
    selectedProfile,
    day,
    ...props
}) {
    return (
        <section>
            <h1 className={mini ? Styles.titleMini : Styles.title}>{title}</h1>
            {items.length > 0 ? (
                <ul className={mini ? Styles.itemListMini : Styles.itemList}>
                    {items.map(function renderQueueItem(queueItem, index) {
                        const queueItemTimeslot = queueItem.timeslotUnix;
                        const shareDialogTimeslot = moment(scheduledDate).format('x');

                        return (
                            <QueueItem
                                key={index}
                                showTooltip={showTooltip}
                                mini={mini}
                                selectedProfile={selectedProfile}
                                isArticleModalOpen={isArticleModalOpen}
                                isShareDialogOpen={isShareDialogOpen}
                                isActive={queueItemTimeslot == shareDialogTimeslot}
                                day={day}
                                {...queueItem}
                            />
                        )
                    })}
                </ul>
            ) : <div>No timeslots found</div>}
        </section>
    );
}

function enhance(component) {
    return compose(
        setPropTypes({
            title: PropTypes.string,
            items: PropTypes.array
        }),
        withProps(transform),
        pure
    )(component);
}

function transform({ ArticleStore, ShareDialogStore, ...props }) {
    return {
        ...props,
        isArticleModalOpen: !!ArticleStore.viewing,
        isShareDialogOpen: ShareDialogStore.isActive,
        scheduledDate: ShareDialogStore.scheduledDate
    }
}

export default QueueItemCollection;
