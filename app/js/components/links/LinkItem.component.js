import React, { Component } from 'react';

import Style from './style.linkItem';

import moment from 'moment';

export default class LinkItem extends Component {

    constructor(props) {
        super(props);

        this.link = this.props.link;
    }

 
    render() {

    	let displayDate = moment.utc(this.link.sortDate).local().format('MMM DD, YYYY');
    	let displayTime = moment.utc(this.link.sortDate).local().format('hh:mm A');

        return (
            <div className={Style.linkItem}>
            	<div className={Style.leftSide}>
            		<span>{displayDate}</span>
            		<span>{displayTime}</span>
            	</div>
            	<div className={Style.rightSide}>
	            	<div className={Style.influencerAvatar}></div>
	            	
            		<div className={Style.articleImage} style={{ backgroundImage: `url(${this.link.articleImage})` }}>
            		</div>
	        
	            	<div className={Style.articleDetails}>
		            	<h5 className={Style.articleTitle}>{this.link.articleTitle}</h5>
		            	<span className={Style.shortUrl}>{this.link.shortUrl}</span>
	            	</div>
            	</div>
            </div>
        );
    }
}