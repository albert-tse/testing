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
        this.processProps();
        return (
            <div className={classnames(Style.linkItem, this.link.scheduled && Style.scheduled)}>
            	<div className={Style.leftSide}>
                    <i className={ classnames(Style.linkIcon, this.linkIconStyle, 'material-icons') } data-text={this.linkLabel}>{this.linkIcon}</i>
            		<span>{this.displayDate}</span>
            		<span>{this.displayTime}</span>
            	</div>
            	<div className={Style.rightSide}>
                    <section>
                        <div className={Style.articleImage} style={{ backgroundImage: `url(${this.link.attachmentImage})` }} />
                    </section>
                    <section className={Style.metadata}>
                        <div className={Style.articleDetails}>
                            <h5 className={Style.articleTitle}>{this.link.attachmentTitle}</h5>
                            <a href={this.link.shortUrl} target="_blank" onClick={evt => evt.stopPropagation()} className={Style.shortUrl}>{this.link.shortUrl}</a>
                        </div>
                        {this.renderLinkActions(this.link)}
                    </section>
            	</div>
            </div>
        );
    }

    processProps() {
        this.link = this.props.link;
    	this.displayDate = moment.utc(this.link.scheduledTime).local().format('MMM DD, YYYY');
        this.displayTime = moment.utc(this.link.scheduledTime).local().format('hh:mm A');

        this.link.scheduled = true;

        this.linkIconStyle = Style.scheduled;
        this.linkIcon = 'access_time';
        this.linkLabel = 'scheduled for';
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
                    <AddToListButton primary className={classnames(responsive, hideOnPhonePortrait, hideOnPhoneLandscape, hideOnTabletPortrait)} ucid={link.ucid} />
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
