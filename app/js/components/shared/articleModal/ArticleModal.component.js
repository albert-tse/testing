import React from 'react';
import ArticleModalStats from './ArticleModalStats.component';
import { Dialog } from 'react-toolbox';
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
                title={article.title}
                className={classNames}
                onOverlayClick={evt => ::this.hide()}>
                <h1>
                    <small>{article.site_name}</small>
                </h1>
                <p className={Styles.articleDescription}>
                    {article.description}
                </p>
                <img className={Styles.articleImage} src={article.image} />
                <h1>Links</h1>
                {articleFbCtr}
                {articleLinkStats}
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
