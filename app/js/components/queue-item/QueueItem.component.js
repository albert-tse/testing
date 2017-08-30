import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import classnames from 'classnames';
import { Button } from 'react-toolbox';
import {defer} from 'lodash';

import History from '../../history';
import Config from '../../config';

import ScheduledPostMini from './ScheduledPostMini.component'
import ReconnectButton from './ReconnectButton.component'
import RescheduleButton from './RescheduleButton.component'
import LinkActions from './LinkActions.component';

import Styles from './styles';

function QueueItem(props) {
    if (props.item.slotId) {
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
        hideTooltip,
        item
    } = props;

    const {
        message,
        hash,
        attachmentImage,
        attachmentTitle,
        failureCode,
        postedTime,
        time,
        tokenError
    } = item;

    const disconnectedProfile = tokenError > 0
    const failedPost = failureCode > 0
    const linkIconStyle = Styles.scheduled;

    const linkIcon = postedTime
        ? 'check'
        : failedPost
            ? 'warning'
            : 'access_time';

    const linkLabel = postedTime
        ? 'posted on'
        : failedPost
            ? 'failed'
            : 'scheduled for';

    const LINK_SHORTENER_SERVICE = 'http://qklnk.co/';
    const shortlink = LINK_SHORTENER_SERVICE + hash;

    return (
        <div className={classnames(Styles.queueItem, Styles.scheduled)}>
            <div className={Styles.leftSide}>
                <i className={ classnames(Styles.linkIcon, linkIconStyle, 'material-icons', failedPost && Styles.failedPostIcon) } data-text={linkLabel}>{linkIcon}</i>
                <span className={classnames(failedPost && Styles.failedPostIcon)}>{time.format('h:mma (z)')}</span>
            </div>
            <div className={classnames(Styles.rightSide, postedTime && Styles.published, !postedTime && failedPost && Styles.failedPost)}>
                <div className={Styles.articleImage} style={{ backgroundImage: `url(${attachmentImage})` }} />
                <section className={Styles.metadata}>
                    <div className={Styles.articleDetails}>
                        <p className={Styles.message}>{message}</p>
                        <h1 className={Styles.articleTitle}>{attachmentTitle}</h1>
                        <a href={shortlink} target="_blank" onClick={evt => evt.stopPropagation()} className={Styles.shortUrl}>{shortlink}</a>
                    </div>
                    {!postedTime && <LinkActions {...props} />}
                </section>
            </div>
        </div>
    )
}

function TimeslotMini(props) {
    var isActive = false;

    const {
        item,
        selectedProfile,
        isShareDialogOpen,
        isArticleModalOpen,
        openShareDialogWithTimeslot,
        updateScheduledDate
    } = props;

    const bgUrl = selectedProfile ? selectedProfile.profile_picture : false;
    const isHighlighted = isArticleModalOpen || isShareDialogOpen;
    let onClick = null;
    const className = classnames(
        Styles.queueItemMini,
        isHighlighted && Styles.highlighted,
        isShareDialogOpen && isActive && Styles.active,
        'queueItemMini'
    );

    if (isHighlighted) {
        onClick = isShareDialogOpen ? updateScheduledDate(item.time) : openShareDialogWithTimeslot(item.time);
    }
    if(props.slotOnClick){
        onClick = props.slotOnClick;
    }

    return (
        <div className={className}>
            <div className={classnames(Styles.fade)}>
                <div className={classnames(Styles.time, !bgUrl && Styles.noAvatar)} onClick={onClick}>
                    {bgUrl && <div className={Styles.influencerImage} style={{backgroundImage: `url(${bgUrl})` }}></div>}
                    {item.time ? item.time.format('h:mma (z)') : 'No Time'}
                </div>
            </div>
        </div>
    )
}

function Timeslot(props) {
    return (
        <div className={classnames(Styles.queueItem)}>
            <div className={Styles.leftSide}>
                <span>{props.item.time.format('h:mma (z)')}</span>
            </div>
            <div className={Styles.rightSide}>
                <section className={Styles.slotPlaceholder}>
                    <Button
                        className={Styles.newPostButton}
                        label="New Post"
                        raised
                        accent
                        onClick={evt => _.defer(() => History.push(Config.routes.default))} />
                </section>
            </div>
        </div>
    )
}

/*
function LinkActions(props) {
    const {
        deleteScheduledLink,
        editScheduledLink,
        shareNowScheduledLink,
    } = props;

    var del = function(event){
        deleteScheduledLink()(event);
        setTimeout(props.onDeleteCall, 100);
    }

    return (
        <footer className={Styles.callToActions}>
            <section className={Styles.articleActions}>
                <Button primary label='Delete' onClick={del} flat />
                <Button primary label='Edit' onClick={editScheduledLink()} flat />
            </section>
        </footer>
    )
    // <Button primary label='Share Now' onClick={shareNowScheduledLink()} flat />
}
*/

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
            <div className={props.state.arrowDown ? Styles.triangleDown : Styles.triangleUp} style={{left: props.state.arrowLeft}}><div></div></div>
            <div className={props.state.arrowDown ? Styles.gap : Styles.gapTop}></div>
        </div>
    )
}

export default QueueItem;
