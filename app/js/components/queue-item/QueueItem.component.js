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
        time
    } = item;

    const linkIconStyle = Styles.scheduled;
    const linkIcon = 'access_time';
    const linkLabel = 'scheduled for';
    const LINK_SHORTENER_SERVICE = 'http://qklnk.co/';
    const shortlink = LINK_SHORTENER_SERVICE + hash;

    return (
        <div className={classnames(Styles.queueItem, Styles.scheduled)}>
            <div className={Styles.leftSide}>
                <i className={ classnames(Styles.linkIcon, linkIconStyle, 'material-icons') } data-text={linkLabel}>{linkIcon}</i>
                <span>{time.format('h:mma (z)')}</span>
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

function ScheduledPostMini(props) {
    const {
        isArticleModalOpen,
        isShareDialogOpen,
        editScheduledLink,
        item
    } = props;

    const bgUrl = props.selectedProfile ? props.selectedProfile.profile_picture : false;
    const isDimmed = isArticleModalOpen || isShareDialogOpen;
    const className = classnames(
        Styles.queueItemMini,
        Styles.scheduledMini,
        isDimmed && Styles.dimmed,
        !!item.failureCode && Styles.failed
    );

    // <div className={className} style={{backgroundImage: `url(${props.attachmentImage})` }}  onMouseEnter={props.showTooltip} onMouseLeave={props.hideTooltip}>
    //     <Tooltip {...props} />

    return (
        <div className={className} style={{backgroundImage: `url(${item.attachmentImage})` }} onClick={editScheduledLink(item)}>
            <div className={Styles.fade}>
                <div className={classnames(Styles.time, !bgUrl && Styles.noAvatar)}>
                    {bgUrl && <div className={Styles.influencerImage} style={{backgroundImage: `url(${bgUrl})` }}></div>}
                    <div>{item.time.format('h:mma (z)')}</div>
                </div>
                {item.failureCode && ( item.tokenError > 0 ? (
                    <ReconnectButton />
                ) : (
                    <RescheduleButton />
                ))}
            </div>
        </div>
    );
}

class RescheduleButton extends React.PureComponent {
    render() {
        return (
            <Button
                className={Styles.reconnectButton}
                label="Reschedule"
                onClick={evt => {}}
            />
        )
    }
}

class ReconnectButton extends React.PureComponent {
    render() {
        return (
            <Button
                className={Styles.reconnectButton}
                label="Reconnect"
                onClick={evt => {
                    History.push(Config.routes.manageAccounts)
                    evt.stopPropagation()
                }}
            />
        )
    }
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
