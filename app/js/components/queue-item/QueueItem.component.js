import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import classnames from 'classnames';
import { Button } from 'react-toolbox';

import Styles from './styles';

function QueueItem(props) {
    if (props.slotId) {
        if(props.mini){
            return <TimeslotMini {...props} />
        } else {
            return <Timeslot {...props} />
        }
    } else {
        if(props.mini){
            return <ScheduledPostMini {...props} />
        } else {
            return <ScheduledPost {...props} />
        }
    }
}

function ScheduledPost(props) {
    const {
        attachmentImage,
        attachmentTitle,
        hideTooltip,
        shortUrl,
        showTooltip,
        timeslot,
    } = props;

    const linkIconStyle = Styles.scheduled;
    const linkIcon = 'access_time';
    const linkLabel = 'scheduled for';

    return (
        <div className={classnames(Styles.queueItem, Styles.scheduled)}>
            <div className={Styles.leftSide}>
                <i className={ classnames(Styles.linkIcon, linkIconStyle, 'material-icons') } data-text={linkLabel}>{linkIcon}</i>
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
                    <LinkActions {...props} />
                </section>
            </div>
        </div>
    )
}

function ScheduledPostMini(props) {
    const bgUrl = props.selectedProfile ? props.selectedProfile.profile_picture : false;
    return (
        <div className={classnames(Styles.queueItemMini, Styles.scheduledMini)} style={{backgroundImage: `url(${props.attachmentImage})` }}  onMouseEnter={props.showTooltip} onMouseLeave={props.hideTooltip}>
            <Tooltip {...props} />
            <div className={Styles.fade}>
                <div className={Styles.time}><div className={Styles.influencerImage} style={{backgroundImage: `url(${bgUrl})` }}></div>{props.timeslot}</div>
            </div>
        </div>
    );
}

function TimeslotMini(props) {
    const bgUrl = props.selectedProfile ? props.selectedProfile.profile_picture : false;
    return (
        <div className={classnames(Styles.queueItemMini)}>
            <div className={Styles.fade}>
                <div className={Styles.time} onClick={props.updateScheduledDate(props.timeslotObject)}>
                    <div className={Styles.influencerImage} style={{backgroundImage: `url(${bgUrl})` }}></div>
                    {props.timeslot}
                </div>
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

function LinkActions({
    deleteScheduledLink,
    editScheduledLink,
    shareNowScheduledLink,
    ...props
}) {
    return (
        <footer className={Styles.callToActions}>
            <section className={Styles.articleActions}>
                <Button primary label='Delete' onClick={evt => deleteScheduledLink(link, evt)} flat />
                <Button primary label='Edit' onClick={evt => editScheduledLink(link, evt)} flat />
                <Button primary label='Share Now' onClick={evt => shareNowScheduledLink(link, evt)} flat />
            </section>
        </footer>
    )
}

function Tooltip(props) {
    const {
        attachmentImage,
        attachmentTitle,
        message,
        platformId,
        shortUrl,
        state,
        timeslot
    } = props;

    return (
        <div className={`${state.fadeIn && Styles.tooltipFadeIn} ${state.fadeOut && Styles.tooltipFadeOut} ${Styles.tooltip}`} style={{top: props.state.tooltipTop, left: props.state.tooltipLeft}}>
            <section className={Styles.message}>
                <div>{message}</div>
            </section>
            <section className={Styles.details}>
                <div>{timeslot} - { platformId == 1 ? 'Twitter' : 'Facebook'}</div>
            </section>
            <div className={Styles.tooltipLink}>
                <section>
                    <div className={Styles.articleImage} style={{ backgroundImage: `url(${attachmentImage})` }} />
                </section>
                <section className={Styles.metadata}>
                    <div className={Styles.articleDetails}>
                        <h5 className={Styles.articleTitle}>{attachmentTitle}</h5>
                        <a href={shortUrl} target="_blank" onClick={evt => evt.stopPropagation()} className={Styles.shortUrl}>{shortUrl}</a>
                    </div>
                    <LinkActions {...props} />
                </section>
            </div>
            <div className={Styles.triangleDown}><div></div></div>
            <div className={Styles.gap}></div>
        </div>
    )
}

export default QueueItem;
