import React from 'react';
import { Button, ProgressBar } from 'react-toolbox';
import classnames from 'classnames';
import _ from 'lodash';

import QueueItemCollection from '../queue-item/QueueItemCollection.component';
import Styles from './styles';

export default class QueueComponent extends React.Component {

    // TODO: remove selectedProfile from dependency
    // TODO: remove onDeleteCall from QueueItemCollection?
    render() {
        return (
            <div className={classnames(Styles.queueContainer, this.props.mini && Styles.mini)}>
                <ScheduledPostAmount amount={this.props.totalScheduledPostsAmount} disabled={this.props.mini} />
                <this.props.CallToAction />
                {this.props.queues.length > 0 && (
                    <div>
                        {_.map(this.props.queues, (queue, index) => (
                            <QueueItemCollection
                                key={index}
                                queue={queue}
                                mini={this.props.mini}
                                selectedProfile={this.props.selectedProfile}
                            />
                        ))}
                        <LoadMoreButton mini={this.props.mini} onClick={this.props.loadMore} />
                    </div>
                )}
            </div>
        )
    }
}

class ScheduledPostAmount extends React.PureComponent {
    render() {
        return this.props.disabled ? <div /> : (
            <p className={Styles.scheduledPostAmount}>You have <strong>{this.props.amount}</strong> scheduled posts</p>
        )
    }
}

class LoadMoreButton extends React.PureComponent {
    render() {
        return (
            <div className={classnames(!this.props.mini && Styles.mini, Styles.loadMoreContainer)}>
                <Button className={Styles.loadMoreButton} raised accent label="Next Week" onClick={this.props.onClick}  />
            </div>
        )
    }
}

export class Loading extends React.PureComponent {
    render() {
        return (
            <div className={Styles.loadingIndicator}>
                <ProgressBar type="circular" mode="indeterminate" />
            </div>
        )
    }
}
