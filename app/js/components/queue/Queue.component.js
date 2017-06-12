import React from 'react';
import { Button } from 'react-toolbox';
import map from 'lodash/map';

import QueueItemCollection from '../queue-item/QueueItemCollection.component';

import Styles from './styles';

function QueueComponent({
    queues,
    loadMore,
    mini,
    selectedProfile
}) {
    return (
        <div>
            {map(queues, function renderQueue({ title, queueItems }, index) {
                return <QueueItemCollection key={index} title={title} items={queueItems} mini={mini} selectedProfile={selectedProfile}/>
            })}
            <Button className={Styles.loadMoreButton} raised accent label="Next Week" onClick={loadMore} />
        </div>
    );
}

export default QueueComponent;
