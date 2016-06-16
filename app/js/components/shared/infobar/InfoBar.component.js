import React from 'react';
import InfoBarStats from './InfoBarStats.component';
import Styles from './styles';

/**
 * How to use this:
 * TODO: specify the props a container should pass to this component to properly render
 */
class InfoBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var article = this.props.article;

        var classNames = [
            Styles.infoBar,
            this.props.visible && Styles.slideIn
        ].filter(Boolean).join(' ');

        var articleFbCtr = hasStats(article) ? (<span>Average FB CTR: {article.averageFbCtr}%</span>) : '';

        var articleLinkStats = !hasStats(article) ? (<p>Sorry, no stats are available for this article</p>) : article.links.map(function (link, index) {
            return (
                <InfoBarStats link={link} key={index}/>
            );
        });

        return (
            <aside id="info-bar" className={classNames}>
                <i className="fa fa-times" onClick={this.hide.bind(this)}></i>
                <h1>
                    <small>{article.site_name}</small>
                    {article.title}
                </h1>
                {articleFbCtr}
                {articleLinkStats}
            </aside>
        );
    }

    /**
     * Hide this component from the view
     */
    hide() {
        this.props.hide();
    }
}

/**
 * Checks if the article has been shared by at least one influencer
 * @param Object article that may have been shared
 * @return boolean true if it has at least one influencer
 */
function hasStats(article) {
    return article && article.links && article.links.length > 0;
}

export default InfoBar;
