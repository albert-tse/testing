import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import classnames from 'classnames';
import { Button } from 'react-toolbox';
import {defer} from 'lodash';
import History from '../../history';
import Config from '../../config';

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
        message,
        hash,
        showTooltip,
        timeslot,
    } = props;

    const linkIconStyle = Styles.scheduled;
    const linkIcon = 'access_time';
    const linkLabel = 'scheduled for';
    const LINK_SHORTENER_SERVICE = 'http://qklnk.co/';
    const shortlink = LINK_SHORTENER_SERVICE + hash;

    return (
        <div className={classnames(Styles.queueItem, Styles.scheduled)}>
            <div className={Styles.leftSide}>
                <i className={ classnames(Styles.linkIcon, linkIconStyle, 'material-icons') } data-text={linkLabel}>{linkIcon}</i>
                <span>{timeslot}</span>
            </div>
            <div className={Styles.rightSide}>
                <div className={Styles.articleImage} style={{ backgroundImage: `url(${attachmentImage})` }} />
                <section className={Styles.metadata}>
                    <div className={Styles.articleDetails}>
                        <p className={Styles.message}>{message}</p>
                        <h1 className={Styles.articleTitle}>{attachmentTitle}</h1>
                        <a href={shortlink} target="_blank" onClick={evt => evt.stopPropagation()} className={Styles.shortUrl}>{shortlink}</a>
                    </div>
                    <LinkActions {...props} />
                </section>
            </div>
        </div>
    )
}

function ScheduledPostMini({
    editScheduledLink,
    isArticleModalOpen,
    isShareDialogOpen,
    ...props
}) {
    const bgUrl = props.selectedProfile ? props.selectedProfile.profile_picture : false;
    const isDimmed = isArticleModalOpen || isShareDialogOpen;
    const className = classnames(
        Styles.queueItemMini,
        Styles.scheduledMini,
        isDimmed && Styles.dimmed
    );

    // <div className={className} style={{backgroundImage: `url(${props.attachmentImage})` }}  onMouseEnter={props.showTooltip} onMouseLeave={props.hideTooltip}>
    //     <Tooltip {...props} />

    return (
        <div className={className} style={{backgroundImage: `url(${props.attachmentImage})` }} onClick={editScheduledLink()}>
            <div className={Styles.fade}>
                <div className={classnames(Styles.time, !bgUrl && Styles.noAvatar)}>
                    {bgUrl && <div className={Styles.influencerImage} style={{backgroundImage: `url(${bgUrl})` }}></div>}
                    <div>{props.timeslot}</div>
                </div>
            </div>
        </div>
    );
}

function TimeslotMini({
    isActive,
    isArticleModalOpen,
    isShareDialogOpen,
    selectedProfile,
    openShareDialogWithTimeslot,
    time,
    timeslot,
    timeslotObject,
    updateScheduledDate,
    ...props
}) {
    const bgUrl = selectedProfile ? selectedProfile.profile_picture : false;
    const isHighlighted = isArticleModalOpen || isShareDialogOpen;
    let onClick = null;
    const className = classnames(
        Styles.queueItemMini,
        isHighlighted && Styles.highlighted,
        isShareDialogOpen && isActive && Styles.active
    );

    if (isHighlighted) {
        onClick = isShareDialogOpen ? updateScheduledDate(timeslotObject) : openShareDialogWithTimeslot(timeslotObject);
    }

    return (
        <div className={className}>
            <div className={classnames(Styles.fade)}>
                <div className={classnames(Styles.time, !bgUrl && Styles.noAvatar)} onClick={onClick}>
                    {bgUrl && <div className={Styles.influencerImage} style={{backgroundImage: `url(${bgUrl})` }}></div>}
                    {time ? time.format() : 'No Time'} {timeslot} {timeslotObject ? timeslotObject.format() : 'No TimeSO'}
                </div>
            </div>
        </div>
    )
}

//{time ? time.format('h:mma (z)') : 'no time'}

function Timeslot(props) {
    return (
        <div className={classnames(Styles.queueItem)}>
            <div className={Styles.leftSide}>
                <span>{props.time.format('h:mma (z)')}</span>
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

function LinkActions(props) {
    const {
        deleteScheduledLink,
        editScheduledLink,
        shareNowScheduledLink,
    } = props;

    return (
        <footer className={Styles.callToActions}>
            <section className={Styles.articleActions}>
                <Button primary label='Delete' onClick={deleteScheduledLink()} flat />
                <Button primary label='Edit' onClick={editScheduledLink()} flat />
                <Button primary label='Share Now' onClick={shareNowScheduledLink()} flat />
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
            <div className={props.state.arrowDown ? Styles.triangleDown : Styles.triangleUp} style={{left: props.state.arrowLeft}}><div></div></div>
            <div className={props.state.arrowDown ? Styles.gap : Styles.gapTop}></div>
        </div>
    )
}

export default QueueItem;
