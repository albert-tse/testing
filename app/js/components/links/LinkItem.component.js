import React, { Component } from 'react';
import { Avatar, Button } from 'react-toolbox';
import { defer } from 'lodash';
import classnames from 'classnames';
import moment from 'moment-timezone';

import History from '../../history';
import Config from '../../config';

import UserStore from '../../stores/User.store';

import LinkActions from '../../actions/Link.action';
import ShareDialogStore from '../../stores/ShareDialog.store';
import ShareDialogActions from '../../actions/ShareDialog.action';
import AnalyticsActions from '../../actions/Analytics.action';
import SaveToListButton from '../shared/article/SaveToListButton.component';
import ShareButton from '../shared/article/ShareButton.component';
import SlidingIndicator from '../shared/SlidingIndicator';

import { responsive, hideOnPhonePortrait, hideOnPhoneLandscape, hideOnTabletPortrait } from '../common';
import Style from './style.linkItem';

export default class LinkItem extends Component {

    constructor(props) {
        super(props);
        this.showArticleInfo = this.showArticleInfo.bind(this);
        this.showShareDialog = this.showShareDialog.bind(this);
    }

    render() {
        this.processProps();
        return (
            <div className={classnames(Style.linkItem, this.link.scheduled ? Style.scheduled : '', this.link.failed && Style.failed)}>
            	<div className={classnames(Style.leftSide)}>
                    <i className={ classnames(Style.linkIcon, this.linkIconStyle, 'material-icons') } data-text={this.linkLabel}>{this.linkIcon}</i>
            		<span>{this.displayDate}</span>
            		<span>{this.displayTime}</span>
            	</div>
            	<div className={Style.rightSide} onClick={this.showArticleInfo}>
                    <section>
                        <div className={Style.influencerAvatar}>
                            {this.profileImage}
                        </div>
                        <div className={Style.articleImage} style={{ backgroundImage: `url(${this.link.articleImage})` }} />
                    </section>
                    <section className={Style.metadata}>
                        <div className={Style.articleDetails}>
                            {!!this.props.profileName && (
                                <p><i className={'fa fa-' + this.link.platformName.toLowerCase() + '-square'}></i>{this.props.profileName}</p>
                            )}
                            <h5 className={Style.articleTitle}>{this.displayTitle}</h5>
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
    	this.displayDate = moment.tz(this.link.sortDate, 'UTC').tz(moment.tz.guess()).format('MMM DD, YYYY');
        this.displayTime = moment.tz(this.link.sortDate, 'UTC').tz(moment.tz.guess()).format('hh:mm A (z)');

        this.link.published = this.link.sharedDate || this.link.postedTime;
        this.link.scheduled = this.link.scheduledTime && !this.link.published && !this.link.deleted && this.link.enabledProfile;
        this.link.failed = !!this.link.failureCode;

        this.linkIconStyle = Style.default;
        this.linkLabel = 'saved on';
        this.linkIcon = 'link';

        this.displayTitle = this.link.attachmentTitle || this.link.articleTitle;

        if (this.link.published) {
            this.linkIconStyle = Style.published;
            this.linkIcon = 'check';
            this.linkLabel = 'posted on';
        } else if (this.link.failed) {
            this.linkIconStyle = Style.failed;
            this.linkIcon = 'warning';
            this.linkLabel = 'failed';
        } else if (this.link.scheduled) {
            this.linkIconStyle = Style.scheduled;
            this.linkIcon = 'access_time';
            this.linkLabel = 'scheduled for';
        }

        this.profileImage = <Avatar icon="person" />;

        if (this.link.influencerAvatar) {
            this.profileImage = (<Avatar><img src={this.link.influencerAvatar}/></Avatar>);
        }
    }

    showArticleInfo() {
        this.props.showInfo(this.link);
    }

    /**
     * Call this when user clicks on share button
     * Determines whether it should show legacy sharing or scheduler dialog
     * @param {Object} article contains information about the story the user wants to share/schedule
     */
    showShareDialog(link) {
        const { hasConnectedProfiles } = UserStore.getState();
        let article = {
            ucid: link.ucid,
            image: link.articleImage,
            title: link.articleTitle,
            description: link.articleDescription,
            site_name: link.siteName,
            site_url: link.siteUrl
        };

        if (hasConnectedProfiles) {
            AnalyticsActions.openShareDialog('Scheduler', article);
            defer(ShareDialogActions.open, { article });
        } else {
            AnalyticsActions.openShareDialog('Legacy Share Dialog', article);
            defer(LinkActions.generateLink, { ucid: link.ucid });
        }
    }

    renderLinkActions(link) {
        let editButton = false;

        if (link.scheduled) {
            editButton = <Button primary label='Edit' onClick={evt => this.editScheduledLink(link, evt)} flat />;
        }

        return (
            <footer className={Style.callToActions}>
                <section>
                    {link.capPercentage > 0.85 && (
                        <SlidingIndicator percentage={link.capPercentage || 0} />
                    )}
                </section>
                <section className={Style.articleActions}>
                    {!link.failed && <SaveToListButton isOnCard primary className={classnames(responsive, hideOnPhonePortrait, hideOnPhoneLandscape, hideOnTabletPortrait)} ucid={link.ucid} />}
                    {!link.failed && <ShareButton primary article={link} label="Share" onClick={this.showShareDialog}/>}
                    {!link.failed && editButton}
                    {link.tokenError > 0 && link.failed && <Button accent label="Reconnect" onClick={evt => History.push(Config.routes.manageAccounts)} />}
                    {link.tokenError < 1 && link.failed && <Button accent label="Reschedule" onClick={evt => this.editScheduledLink(link, evt)} />}
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

        defer(ShareDialogActions.edit, { article, link, profileId: link.profileId });
    }
}
