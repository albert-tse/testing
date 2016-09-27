import React from 'react';
import ArticleModalStats from './ArticleModalStats.component';
import SaveButton from '../article/SaveButton.component';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';
import { Dialog } from 'react-toolbox';
import Link from 'react-toolbox/lib/link';
import moment from 'moment';
import defer from 'lodash/defer';
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

        if (article.isLoading) {
            return null;
        }

        var classNames = [
            this.props.visible,
            Styles.articleModal
        ].filter(Boolean).join(' ');

        var articleLinkStats = !hasStats(article) ? (<p>Sorry, no stats are available for this article</p>) : article.links.map(function (link, index) {
            return (
                <ArticleModalStats link={link} key={index} index={index}/>
            );
        });

        var numLinks = article.links.length;
        var clicks = _.reduce(article.links, function(acm, el){ 
            if(el.stats.facebook && el.stats.facebook.clicks > 0){
                acm += el.stats.facebook.clicks;
            } else if(el.stats.post && el.stats.post.clicks > 0){
                acm += el.stats.post.clicks;
            }
            return acm;
        }, 0);
        var fbCTR = article.averageFbCtr;

        return (
            <Dialog 
                id="info-bar"
                active={this.props.visible}
                className={classNames}
                onOverlayClick={evt => ::this.hide()}>
                
                <div className={Styles.articleDetail}>
                    <div className={Styles.articleImage}>
                        <div style={{backgroundImage: 'url(' + article.image + ')'}}>
                            <div className={Styles.saveButton}>
                                <SaveButton ucid={article.ucid} />
                            </div>
                        </div>
                    </div>

                    <div className={Styles.articleDescription}>
                        <span className={Styles.siteName}>{article.site_name.toUpperCase()}</span>
                        <span className={Styles.articlePublishDate}>
                            {moment(article.publish_date).fromNow()}
                        </span>
                        <div className={Styles.articleTitle}>
                            {article.title}<Link icon='open_in_new' href={article.url} target="_new" rel="nofollow"/>
                        </div>
                    </div>
                    <br className={Styles.clear} />
                </div>
                <div className={Styles.totals}>
                    <div className={Styles.totalsHeader}>Compiled Data</div>
                    <ul>
                        <li>Links: <span className={Styles.statValue}>{numLinks.toLocaleString()}</span></li>
                        <li>Clicks: <span className={Styles.statValue}>{clicks.toLocaleString()}</span></li>
                        <li>FB CTR: <span className={Styles.statValue}>{fbCTR.toLocaleString()}%</span></li>
                    </ul>
                    <div className={Styles.clear}></div>
                </div>
                <div className={Styles.linkStats}>
                    <h1>All Links ({numLinks})</h1>
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
