import React, { Component } from 'react';
import { Avatar, Button } from 'react-toolbox';
import { defer } from 'lodash';
import classnames from 'classnames';
import moment from 'moment';

import UserStore from '../../stores/User.store';

import LinkActions from '../../actions/Link.action';
import ShareDialogActions from '../../actions/ShareDialog.action';
import AnalyticsActions from '../../actions/Analytics.action';
import AddToListButton from '../shared/article/AddToListButton.component';
import ShareButton from '../shared/article/ShareButton.component';
import SlidingIndicator from '../shared/SlidingIndicator';

import { responsive, hideOnPhonePortrait, hideOnPhoneLandscape, hideOnTabletPortrait } from '../common';
import Style from './style.queueItem';

export default class QueueItem extends Component {

    constructor(props) {
        super(props);
        this.showShareDialog = this.showShareDialog.bind(this);
    }

    render() {
        if (this.props.post) {
            return this.renderScheduledPost();
        }  else {
            return this.renderSlot();
        }
    }

    renderScheduledPost() {
        this.processPostProps();
        return (
            <div className={classnames(Style.linkItem, this.post.scheduled && Style.scheduled)}>
                <div className={Style.leftSide}>
                    <i className={ classnames(Style.linkIcon, this.linkIconStyle, 'material-icons') } data-text={this.linkLabel}>{this.linkIcon}</i>
                    <span>{this.displayDate}</span>
                    <span>{this.displayTime}</span>
                </div>
                <div className={Style.rightSide}>
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
            </div>
        );
    }

    renderSlot() {
        this.processSlotProps();
        return (
            <div className={classnames(Style.linkItem)}>
                <div className={Style.leftSide}>
                    <span>{this.displayDate}</span>
                    <span>{this.displayTime}</span>
                </div>
                <div className={Style.rightSide}>
                    <section>
                        <h4>SLOT</h4>
                    </section>
                </div>
            </div>
        );
    }

    processPostProps() {
        this.post = this.props.post;

        // TODO: need to display in profile timezone
    	this.displayDate = moment.utc(this.post.scheduledTime).local().format('MMM DD, YYYY');
        this.displayTime = moment.utc(this.post.scheduledTime).local().format('hh:mm A');

        this.post.scheduled = true;

        this.linkIconStyle = Style.scheduled;
        this.linkIcon = 'access_time';
        this.linkLabel = 'scheduled for';
    }

    processSlotProps() {
        this.slot = this.props.slot;

        // TODO: need to display in profile timezone
        this.displayDate = moment.utc(this.slot).local().format('MMM DD, YYYY');
        this.displayTime = moment.utc(this.slot).local().format('hh:mm A');
    }

    /**
     * Call this when user clicks on share button
     * Determines whether it should show legacy sharing or scheduler dialog
     * @param {Object} article contains information about the story the user wants to share/schedule
     */
    showShareDialog(link) {
        // TODO: no legacy share support needed here
        const { isSchedulingEnabled, hasConnectedProfiles } = UserStore.getState();
        let article = {
            ucid: link.ucid,
            image: link.articleImage,
            title: link.articleTitle,
            description: link.articleDescription,
            site_name: link.siteName
        };

        if (isSchedulingEnabled && hasConnectedProfiles) {
            AnalyticsActions.openShareDialog('Scheduler', article);
            defer(ShareDialogActions.open, { article });
        } else {
            AnalyticsActions.openShareDialog('Legacy Share Dialog', article);
            defer(LinkActions.generateLink, { ucid: link.ucid });
        }
    }

    renderLinkActions(link) {
        // TODO: should be DELETE, EDIT, SHARE NOW buttons
        let editButton = false;

        if (link.scheduled) {
            editButton = <Button primary label='Edit' onClick={evt => this.editScheduledLink(link, evt)} flat />;
        }

        return (
            <footer className={Style.callToActions}>
                <section className={Style.articleActions}>
                    <ShareButton primary article={link} label="Share" onClick={this.showShareDialog}/>
                    {editButton}
                </section>
            </footer>
        );
    }

    editScheduledLink(link, evt) {

        evt.stopPropagation();

        let article = {
            ucid: link.ucid,
            image: link.articleImage,
            title: link.articleTitle,
            description: link.articleDescription,
            site_name: link.siteName
        };

        defer(ShareDialogActions.edit, { article, link });
    }
}
