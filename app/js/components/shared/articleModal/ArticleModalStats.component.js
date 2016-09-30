import React from 'react';
import Styles from './stats';
import moment from 'moment';
import classnames from 'classnames';

class ArticleModalStats extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var link = this.props.link;

        var displayLink = link.shortlink.replace('po.st', 'qklnk.co');
        var savedDate = link.saved_date ? moment(link.saved_date).format("llll") : 'Unknown';

        var stats = '';
        var fbStats = false;
        var postStats = false;

        if (this.hasFbStats(link)) {
            var {
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
            
            fbStats = (
                <ul className={Styles.statBlock + " " + Styles.fbStatBlock}>
                    <li className={Styles.shareDate}>Facebook <a className={classnames('material-icons', Styles.permalink)} href={permalink} target="_blank">open_in_new</a> <span className={Styles.statValue}>{shareDate}</span></li>
                    <li>Clicks: <span className={Styles.statValue}>{parseInt(clicks).toLocaleString()}</span></li>
                    <li>Reach: <span className={Styles.statValue}>{parseInt(reach).toLocaleString()}</span></li>
                    <li>CTR: <span className={Styles.statValue}>{parseFloat(ctr).toLocaleString()}%</span></li>
                    <li>Likes: <span className={Styles.statValue}>{parseInt(likes).toLocaleString()}</span></li>
                    <li>Shares: <span className={Styles.statValue}>{parseInt(shares).toLocaleString()}</span></li>
                    <li>Comments: <span className={Styles.statValue}>{parseInt(comments).toLocaleString()}</span></li>
                </ul>
            );
        }

        if(!fbStats && link.stats.post.clicks){
            postStats = (
                <ul className={Styles.statBlock + " " + Styles.postStatBlock}>
                    <li>Clicks: <span className={Styles.statValue}>{parseInt(link.stats.post.clicks).toLocaleString()}</span></li>
                </ul>
            );
        }

        stats = (
            <div>
                {fbStats}
                {postStats}
            </div>
        );

        return (
            <div className={Styles.link}>
                <div>{this.props.index + 1}. {link.influencer_name}: - <a href={displayLink} target='_blank'>{displayLink}</a></div>
                <div><span className={Styles.statValue}>Created {savedDate}</span></div>
                {stats}
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

export default ArticleModalStats;
