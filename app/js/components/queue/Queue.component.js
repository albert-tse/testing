import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import map from 'lodash/map';

import QueueItemCollection from '../queue-item/QueueItemCollection.component';

import Styles from './styles';

export default class QueueComponent extends Component {

    constructor(props) {
        super(props);

        props.reloadPosts();
    }

    componentWillUpdate(nextProps, nextState){
        if(this.props.SelectedProfile != nextProps.SelectedProfile){
            nextProps.reloadPosts();
        }
    }

    render() {
        const {
            loadMore,
            queues,
            SelectedProfile,
            mini,
            onDeleteCall
        } = this.props;

        return (
            <div className={Styles.queueContainer}>
                {map(queues, function renderQueue(queue, index) {
                    return (<QueueItemCollection
                        key={index}
                        queue={queue}
                        mini={mini}
                        selectedProfile={SelectedProfile}
                        onDeleteCall={onDeleteCall}
                    />);
                })}
                <Button className={Styles.loadMoreButton} raised accent label="Next Week" onClick={loadMore} />
            </div>
        );
    }

}