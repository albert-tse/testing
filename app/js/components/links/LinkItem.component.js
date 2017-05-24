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
            <div className={classnames(Style.linkItem, this.link.scheduled && Style.scheduled)}>
            	<div className={Style.leftSide}>
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
                            {!!this.props.profile && (
                                <p><i className={'fa fa-' + this.link.platformName.toLowerCase() + '-square'}></i>{this.props.profile.profile_name}</p>
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
    	this.displayDate = moment.utc(this.link.sortDate).local().format('MMM DD, YYYY');
        this.displayTime = moment.utc(this.link.sortDate).local().format('hh:mm A');

        this.link.published = this.link.sharedDate || this.link.postedTime;
        this.link.scheduled = this.link.scheduledTime && !this.link.published && !this.link.deleted;

        this.linkIconStyle = Style.default;
        this.linkLabel = 'saved on';
        this.linkIcon = 'link';
        this.influencer = this.props.influencer || {};

        this.displayTitle = this.link.attachmentTitle || this.link.articleTitle;

        if (this.link.published) {
            this.linkIconStyle = Style.published;
            this.linkIcon = 'check';
            this.linkLabel = 'posted on';
        } else if (this.link.scheduled) {
            this.linkIconStyle = Style.scheduled;
            this.linkIcon = 'access_time';
            this.linkLabel = 'scheduled for';
        }

        this.profileImage = <Avatar icon="person" />;

        if (this.influencer.fb_profile_image) {
            this.profileImage = (<Avatar><img src={this.influencer.fb_profile_image}/></Avatar>);
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
        const { isSchedulingEnabled, hasConnectedProfiles } = UserStore.getState();
        let article = {
            ucid: link.ucid,
            image: link.articleImage,
            title: link.articleTitle,
            description: link.articleDescription,
            site_name: link.siteName,
            site_url: link.siteUrl
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
