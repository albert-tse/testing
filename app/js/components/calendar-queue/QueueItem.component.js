import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import { defer } from 'lodash';
import classnames from 'classnames';
import moment from 'moment';

import Config from '../../config';
import History from '../../history';

import ShareDialogActions from '../../actions/ShareDialog.action';
import AnalyticsActions from '../../actions/Analytics.action';

import { responsive, hideOnPhonePortrait, hideOnPhoneLandscape, hideOnTabletPortrait } from '../common';
import Style from './style.queueItem';

export default class QueueItem extends Component {

    constructor(props) {
        super(props);
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
            <div className={classnames(Style.queueItem, this.post.scheduled && Style.scheduled)}>
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
            <div className={classnames(Style.queueItem)}>
                <div className={Style.leftSide}>
                    <span>{this.displayDate}</span>
                    <span>{this.displayTime}</span>
                </div>
                <div className={Style.rightSide}>
                    <section className={Style.slotPlaceholder}>
                        <Button
                            className={Style.newPostButton}
                            label="New Post"
                            raised
                            accent
                            onClick={this.navigateToContent} />
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

        this.post.shortUrl = 'http://qklnk.co/' + this.post.hash;

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

    renderLinkActions(link) {
        return (
            <footer className={Style.callToActions}>
                <section className={Style.articleActions}>
                    <Button primary label='Delete' onClick={evt => this.deleteScheduledLink(link, evt)} flat />
                    <Button primary label='Edit' onClick={evt => this.editScheduledLink(link, evt)} flat />
                    <Button primary label='Share Now' onClick={evt => this.shareNowScheduledLink(link, evt)} flat />
                </section>
            </footer>
        );
    }

    // TODO
    deleteScheduledLink(link, evt) {
        evt.stopPropagation();
    }

    // TODO
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

    // TODO
    shareNowScheduledLink(link, evt) {
        evt.stopPropagation();
    }

    navigateToContent() {
        History.push(Config.routes.explore);
    }
}
