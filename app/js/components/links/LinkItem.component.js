import React, { Component } from 'react';

import { Avatar, Button } from 'react-toolbox';
import Style from './style.linkItem';
import LinkActions from '../../actions/Link.action';
import UserStore from '../../stores/User.store';
import AddToListButton from '../shared/article/AddToListButton.component';
import ShareButton from '../shared/article/ShareButton.component';

import { responsive, hideOnPhonePortrait, hideOnPhoneLandscape, hideOnTabletPortrait } from '../common';

import classnames from 'classnames';
import moment from 'moment';

export default class LinkItem extends Component {

    constructor(props) {
        super(props);

        this.link = this.props.link;

        let influencers = UserStore.getState().user.influencers;

        this.influencer = _.find(influencers, inf => inf.id === this.link.influencerId);
    }

 
    render() {

    	let displayDate = moment.utc(this.link.sortDate).local().format('MMM DD, YYYY');
    	let displayTime = moment.utc(this.link.sortDate).local().format('hh:mm A');

        this.link.published = this.link.sharedDate || this.link.postedTime;
        this.link.scheduled = this.link.scheduledTime && !this.link.published;

        let linkIconStyle = Style.default;
        let linkIcon = 'link';

        if (this.link.published) {
            linkIconStyle = Style.published;
            linkIcon = 'check';
        } else if (this.link.scheduled) {
            linkIconStyle = Style.scheduled;
            linkIcon = 'access_time';
        }

        let profileImage = <Avatar icon="person" />;

        if (this.influencer.fb_profile_image) {
            profileImage = (<Avatar><img src={this.influencer.fb_profile_image}/></Avatar>);
        }

        return (
            <div className={Style.linkItem}>
            	<div className={Style.leftSide}>
                    <i className={ classnames(Style.linkIcon, linkIconStyle, 'material-icons') }>{linkIcon}</i>
            		<span>{displayDate}</span>
            		<span>{displayTime}</span>
            	</div>
            	<div className={Style.rightSide}>
	            	<div className={Style.influencerAvatar}>
                        {profileImage}
                    </div>
	            	
            		<div className={Style.articleImage} style={{ backgroundImage: `url(${this.link.articleImage})` }}>
            		</div>
	        
	            	<div className={Style.articleDetails}>
		            	<h5 className={Style.articleTitle}>{this.link.articleTitle}</h5>
		            	<span className={Style.shortUrl}>{this.link.shortUrl}</span>
	            	</div>

                    {this.renderLinkActions(this.link)}
            	</div>
            </div>
        );
    }

    renderLinkActions(link) {

        let editButton = false;

        if (link.scheduled) {
            editButton = <Button label='Edit' onClick={evt => this.editScheduledLink(link.scheduledPostId)} flat />;
        } 

        return (
            <div className={Style.articleActions}>
                <AddToListButton className={classnames(responsive, hideOnPhonePortrait, hideOnPhoneLandscape, hideOnTabletPortrait)} ucid={link.ucid} />
                <ShareButton isOnCard ucid={link.ucid} />
                {editButton}
            </div>
        );
    }

    editScheduledLink(postId) {
        defer(LinkActions.removeScheduledLink, { postId });
    }
}