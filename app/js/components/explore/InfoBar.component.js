import React from 'react';
import InfluencerPostStats from './InfluencerPostStats.component';

/**
 * How to use this:
 * TODO: specify the props a container should pass to this component to properly render
 */
class InfoBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var article = this.props.store;

        var classNames = [
            this.props.store.show && 'slide-in'
        ].filter(Boolean).join(' ');

        var influencerPostStats = !hasStats(article) ? (<p>Sorry, no stats are available for this article</p>)
            : article.influencers.map(function (influencer, index) {
                return (
                    <InfluencerPostStats key={index}
                                         name={influencer.name}
                                         platforms={influencer.platforms} />
                );
            });

        return (
            <aside id="info-bar" className={classNames}>
                <i className="fa fa-times" onClick={this.hide.bind(this)}></i>
                <h1>
                    <small>{article.site}</small>
                    {article.title}
                </h1>
                {influencerPostStats}
            </aside>
        );
    }

    /**
     * Hide this component from the view
     */
    hide() {
        this.props.toggle(false);
    }
}

/**
 * Checks if the article has been shared by at least one influencer
 * @param Object article that may have been shared
 * @return boolean true if it has at least one influencer
 */
function hasStats(article) {
    return 'influencers' in article && article.influencers.length > 0;
}

export default InfoBar;
