import React from 'react';
import Styles from './styles';
import moment from 'moment';

class ArticleModalStats extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var link = this.props.link;

        var displayLink = link.shortlink.replace('po.st', 'qklnk.co');
        var savedDate = link.saved_date ? moment(link.saved_date).format("MM/DD/YYYY hh:mma") : 'Unknown';

        var fbStats = '';

        if (this.hasFbStats(link)) {
            var {
                shareDate = null,
                clicks = 0,
                reach = 0,
                ctr = 0,
                likes = 0,
                shares = 0,
                comments = 0
            } = link.stats.facebook;

            shareDate = shareDate ? moment(shareDate).format("MM/DD/YYYY hh:mma") : 'Unknown';
            
            fbStats = (
                <div className={Styles.statBlock}>
                    <span className={Styles.platform}>Facebook</span>
                    <p>Share Date: {shareDate}</p>
                    <p>Clicks: {parseInt(clicks).toLocaleString()}</p>
                    <p>Reach: {parseInt(reach).toLocaleString()}</p>
                    <p>CTR: {parseFloat(ctr).toLocaleString()}%</p>
                    <p>Likes: {parseInt(likes).toLocaleString()}</p>
                    <p>Shares: {parseInt(shares).toLocaleString()}</p>
                    <p>Comments: {parseInt(comments).toLocaleString()}</p>
                </div>
            );
        }

        return (
            <div className="influencer">
                <h2>{link.influencer_name} - <a href={displayLink} target='_blank'>{displayLink}</a> - Created: {savedDate}</h2>
                {fbStats}
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
