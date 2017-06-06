import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import classnames from 'classnames';
import { Button } from 'react-toolbox';

import Styles from './styles';

function QueueItem(props) {
    if (props.slotId) {
        return <Timeslot {...props} />
    } else if (props.linkId) {
        return <ScheduledPost {...props} />
    } else {
        <div>I don't know what to do here</div>
    }
}

function ScheduledPost(props) {
    const {
        attachmentImage,
        attachmentTitle,
        shortUrl,
        timeslot
    } = props;
    const linkLabel = 'scheduled for';
    const linkIcon = 'access_time';

    return (
        <div className={classnames(Styles.queueItem, Styles.scheduled)}>
            <div className={Styles.leftSide}>
                <i className={ classnames(Styles.linkIcon, Styles.scheduled, 'material-icons') } data-text={linkLabel}>{linkIcon}</i>
                <span>{timeslot}</span>
            </div>
            <div className={Styles.rightSide}>
                <section>
                    <div className={Styles.articleImage} style={{ backgroundImage: `url(${attachmentImage})` }} />
                </section>
                <section className={Styles.metadata}>
                    <div className={Styles.articleDetails}>
                        <h5 className={Styles.articleTitle}>{attachmentTitle}</h5>
                        <a href={shortUrl} target="_blank" onClick={evt => evt.stopPropagation()} className={Styles.shortUrl}>{shortUrl}</a>
                    </div>
                    {<LinkActions {...props} />}
                </section>
            </div>
        </div>
    )
}

function Timeslot({
    timeslot,
    ...props
}) {
    return (
        <div className={classnames(Styles.queueItem)}>
            <div className={Styles.leftSide}>
                <span>{timeslot}</span>
            </div>
            <div className={Styles.rightSide}>
                <section className={Styles.slotPlaceholder}>
                    <Button
                        className={Styles.newPostButton}
                        label="New Post"
                        raised
                        accent
                        onClick={evt => console.log('this.navigateToContent')} />
                </section>
            </div>
        </div>
    )
}

function LinkActions(props) {
    return (
        <div>Link Actions here</div>
    )
    return (
        <footer className={Styles.callToActions}>
            <section className={Styles.articleActions}>
                <Button primary label='Delete' onClick={evt => this.deleteScheduledLink(link, evt)} flat />
                <Button primary label='Edit' onClick={evt => this.editScheduledLink(link, evt)} flat />
                <Button primary label='Share Now' onClick={evt => this.shareNowScheduledLink(link, evt)} flat />
            </section>
        </footer>
    )
}

function Tooltip(props) {
    return (
        <div className={`${this.state.fadeIn && Style.tooltipFadeIn} ${this.state.fadeOut && Style.tooltipFadeOut} ${Style.tooltip}`}>
            <section className={Style.message}>
                <div>{this.post.message}</div>
            </section>
            <section className={Style.details}>
                <div>{moment(this.post.scheduledTime).format("ddd, MMM Do YYYY, h:mm:ss a")} - { this.post.platformId == 1 ? 'Twitter' : 'Facebook'}</div>
            </section>
            <div className={Style.tooltipLink}>
                <section>
                    <div className={Style.articleImage} style={{ backgroundImage: `url(${this.post.attachmentImage})` }} />
                </section>
                <section className={Style.metadata}>
                    <div className={Style.articleDetails}>
                        <h5 className={Style.articleTitle}>{this.post.attachmentTitle}</h5>
                        <a href={this.post.shortUrl} target="_blank" onClick={evt => evt.stopPropagation()} className={Style.shortUrl}>{this.post.shortUrl}</a>
                    </div>
                    {this.renderLinkActions(this.post)}
                </section>
            </div>
            <div className={Style.triangleDown}><div></div></div>
            <div className={Style.gap}></div>
        </div>
    )
}

function renderScheduledPostMini(props) {
    return (
        <div className={classnames(Style.queueItemMini, this.post.scheduled && Style.scheduledMini)}>
        </div>
    );
}

export default QueueItem;
