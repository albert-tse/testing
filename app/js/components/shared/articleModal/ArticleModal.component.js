import React from 'react';
import ArticleModalStats from './ArticleModalStats.component';
import { Dialog } from 'react-toolbox';
import moment from 'moment';
import Styles from './styles';

/**
 * How to use this:
 * TODO: specify the props a container should pass to this component to properly render
 */
class ArticleModal extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        var article = this.props.article;

        var classNames = [
            this.props.visible,
            Styles.articleModal
        ].filter(Boolean).join(' ');

        var publishedDate = article.publish_date ? moment(article.publish_date).format("MM/DD/YYYY hh:mma") : 'Unknown';

        var articleFbCtr = hasStats(article) ? (<span>Average FB CTR: {article.averageFbCtr}%</span>) : '';

        var articleLinkStats = !hasStats(article) ? (<p>Sorry, no stats are available for this article</p>) : article.links.map(function (link, index) {
            return (
                <ArticleModalStats link={link} key={index}/>
            );
        });

        return (
            <Dialog 
                id="info-bar"
                active={this.props.visible}
                className={classNames}
                onOverlayClick={evt => ::this.hide()}>
                <div className={Styles.articleDetail}>
                    <h3 className={Styles.articleTitle}><a href={article.url} target="_blank">{article.title}</a></h3>
                    <img className={Styles.articleImage} src={article.image} />
                    <p className={Styles.articleDescription}>
                        <em>{article.site_name.toUpperCase()}</em> - {article.description}
                        <p className={Styles.articlePublishDate}>
                            Published: {publishedDate}
                        </p>
                    </p>
                    <br style={{clear:'both'}} />
                </div>
                <div className={Styles.linkStats}>
                    <h1>Links</h1>
                    {articleFbCtr}
                    {articleLinkStats}
                </div>
            </Dialog>
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

export default ArticleModal;
