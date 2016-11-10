import React from 'react';
import Styles from './stats';
import moment from 'moment';
import classnames from 'classnames';

class ArticleModalStats extends React.Component {

    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillUpdate.bind(this);
    }

    componentWillUpdate() {
        const link = this.props.link;

        this.displayLink = link.shortlink.replace('po.st', 'qklnk.co');
        this.savedDate = link.saved_date ? moment(link.saved_date).format("llll") : 'Unknown';
        this.stats = '';
        this.fbStats = false;
        this.postStats = false;

        if (this.hasFbStats(link)) {
            let {
                shareDate = null,
                clicks = 0,
                reach = 0,
                ctr = 0,
                likes = 0,
                shares = 0,
                comments = 0,
                permalink = '#'
            } = link.stats.facebook;

            shareDate = shareDate ? moment(shareDate).format("MM/DD/YYYY hh:mma") : 'Unknown';
            
            this.fbStats = (
                <div className={Styles.statBlock}>
                    <div className={Styles.heading}>
                        Posted on <a href={permalink} target="_blank">Facebook</a>
                        <small className={Styles.statValue}>{shareDate}</small>
                    </div>
                    <div className={Styles.statCounts}>
                        <p>Clicks: <span className={Styles.statValue}>{parseInt(clicks).toLocaleString()}</span></p>
                        <p>Reach: <span className={Styles.statValue}>{parseInt(reach).toLocaleString()}</span></p>
                        <p>CTR: <span className={Styles.statValue}>{parseFloat(ctr).toLocaleString()}%</span></p>
                        <p>Likes: <span className={Styles.statValue}>{parseInt(likes).toLocaleString()}</span></p>
                        <p>Shares: <span className={Styles.statValue}>{parseInt(shares).toLocaleString()}</span></p>
                        <p>Comments: <span className={Styles.statValue}>{parseInt(comments).toLocaleString()}</span></p>
                    </div>
                </div>
            );
        }

        if (!this.fbStats && link.stats.post.clicks) {
            this.postStats = (
                <div className={classnames(Styles.statBlock, Styles.statCounts)}>
                    <p>Clicks: <span className={Styles.statValue}>{parseInt(link.stats.post.clicks).toLocaleString()}</span></p>
                </div>
            );
        }

        this.stats = (
            <div>
                {this.fbStats}
                {this.postStats}
            </div>
        );

    }

    render() {
        return (
            <div className={Styles.link}>
                {/*<div>this.props.index + 1. </div>*/}
                <header className={Styles.influencerShared}>
                    <strong>{this.props.link.influencer_name}</strong>
                    <small>{this.savedDate}</small>
                </header>
                <a href={this.displayLink} target='_blank'>{this.displayLink}</a>
                <div>
                    {this.stats}
                </div>
            </div>
        );
    }

    hasFbStats(link) {
        return link.stats && link.stats.facebook &&
            (
                link.stats.facebook.clicks ||
                link.stats.facebook.reach ||
                link.stats.facebook.ctr ||
                link.stats.facebook.likes ||
                link.stats.facebook.shares ||
                link.stats.facebook.comments
            );
    }
}

                {/*
                <ul className={classnames(Styles.statBlock, Styles.fbStatBlock)}>
                    <li className={Styles.shareDate}>Facebook <a className={classnames('material-icons', Styles.permalink)} href={permalink} target="_blank">open_in_new</a> </li>
                </ul>
                */}

export default ArticleModalStats;
