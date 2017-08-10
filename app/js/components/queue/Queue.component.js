import React from 'react';
import PropTypes from 'prop-types';
import { Button, ProgressBar } from 'react-toolbox';
import classnames from 'classnames';
import _ from 'lodash';

import QueueItemCollection from '../queue-item/QueueItemCollection.component';
import Styles from './styles';

export default class QueueComponent extends React.PureComponent {

    // TODO: remove selectedProfile from dependency
    render() {
        return (
            <div className={classnames(Styles.queueContainer, this.props.mini && Styles.mini, this.props.CallToAction && Styles.showingCTA)}>
                <ScheduledPostAmount amount={this.props.totalScheduledPostsAmount} disabled={this.props.mini} />
                {this.props.CallToAction && <this.props.CallToAction />}
                <Loading visible={this.props.loading} />
                <div className={classnames(Styles.queueItemCollectionContainer, this.props.switchingInfluencers && Styles.dimmed)}>
                    {_.map(this.props.queues, queue => {
                        return (
                            <QueueItemCollection
                                key={queue.date.format()}
                                queue={queue}
                                mini={this.props.mini}
                                selectedProfile={this.props.selectedProfile}
                            />
                        )
                    })}
                    <LoadMoreButton visible={this.props.queues.length > 0} mini={this.props.mini} onClick={this.props.onLoadMore} />
                </div>
            </div>
        )
    }

    static propTypes = {
        CallToAction: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
        mini: PropTypes.bool,
        onLoadMore: PropTypes.func,
        queues: PropTypes.arrayOf(PropTypes.object),
        selectedProfile: PropTypes.object,
        totalScheduledPostsAmount: PropTypes.number
    }
}

class Loading extends React.PureComponent {
    render() {
        return (
            <div className={Styles.loadingIndicatorContainer}>
                <div className={classnames(Styles.loadingIndicator, this.props.visible && Styles.visible)}>
                    <ProgressBar type="circular" mode="indeterminate" />
                </div>
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
        return this.props.visible ? (
            <div className={classnames(!this.props.mini && Styles.mini, Styles.loadMoreContainer)}>
                <Button className={Styles.loadMoreButton} raised accent label="Next Week" onClick={this.props.onClick}  />
            </div>
        ) : <div />
    }
}
