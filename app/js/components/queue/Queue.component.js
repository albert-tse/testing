import React from 'react';
import { Button } from 'react-toolbox';
import map from 'lodash/map';

import QueueItemCollection from '../queue-item/QueueItemCollection.component';

import Styles from './styles';

function QueueComponent({
    loadMore,
    mini,
    queues,
    selectedProfile,
    scheduledDate
}) {
    console.log('Queues', queues);
    return (
        <div className={Styles.queueContainer}>
            {map(queues, function renderQueue({ title, queueItems, day }, index) {
                return (
                    <QueueItemCollection
                        key={index}
                        title={title}
                        items={queueItems}
                        mini={mini}
                        selectedProfile={selectedProfile}
                        scheduledDate={scheduledDate}
                        day={day}
                    />
                )
            })}
            <Button className={Styles.loadMoreButton} raised accent label="Next Week" onClick={loadMore} />
        </div>
    );
}

export default QueueComponent;
