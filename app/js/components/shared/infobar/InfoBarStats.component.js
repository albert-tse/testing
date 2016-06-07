import React from 'react';
import Styles from './styles';

class InfoBarStats extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        var link = this.props.link;

        var displayLink = link.shortlink.replace('po.st', 'qklnk.co');

        var fbStats = '';

        if (this.hasFbStats(link)) {
            var {
                clicks = 0,
                    reach = 0,
                    ctr = 0,
                    likes = 0,
                    shares = 0,
                    comments = 0
            } = link.stats.facebook;

            fbStats = (
                <div className={Styles.statBlock}>
                    <h5>Facebook</h5>
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
                <h2>{link.influencer_name} - <a href={displayLink} target='_blank'>{displayLink}</a></h2>
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

export default InfoBarStats;
