import React, { Component } from 'react';
import { Dialog, Button, IconButton, Link } from 'react-toolbox';

import AddToListButton from '../article/AddToListButton.component';
import ArticleModalStats from './ArticleModalStats.component';
import RescrapeButton from '../article/RescrapeButton.component';
import SaveButton from '../article/SaveButton.component';
import ShareButton from '../article/ShareButton.component';

import Styles from './styles';
import { headlineIssue } from '../article/styles';

import UserStore from '../../../stores/User.store';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';

import classnames from 'classnames';
import moment from 'moment';
import defer from 'lodash/defer';

/**
 * How to use this:
 * TODO: specify the props a container should pass to this component to properly render
 */
class ArticleModal extends React.Component {

    constructor(props) {
        super(props);
        this.componentWillMount = this.componentWillUpdate = this.processData.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.hide = this.hide.bind(this);
    }

    componentDidMount() {
        if (document && document.body) {
            document.body.addEventListener('keyup', this.onKeyUp);
        }
    }

    componentWillUnmount() {
        if (document && document.body) {
            document.body.removeEventListener('keyup', this.onKeyUp);
        }
    }

    render() {
        const article = this.props.article;

        if (article.isLoading) {
            return null;
        }

        return (
            <div className={Styles.overlay} onClick={this.hide} onScroll={evt => evt.stopPropagation()}>
                <div className={Styles.appBar}>
                    <Button className={Styles.normal} icon="arrow_back" label="back" />
                    <div className={Styles.actions}>
                        {this.rescrapeButton}
                        <AddToListButton />
                        <SaveButton ucid={article.ucid} />
                    </div>
                </div>
                <div>
                    <div className={Styles.viewer}>
                        <ShareButton ucid={article.ucid} floating accent />
                        <section className={classnames(Styles.mainContent, this.hasEngagement() && Styles.hasEngagement)} onClick={evt => evt.stopPropagation()}>
                            <img className={Styles.coverImage} src={article.image} />
                            <div className={Styles.content}>
                                <span className={Styles.siteName}>{article.site_name.toUpperCase()}</span>
                                <span className={Styles.publishDate}>
                                    {moment(article.publish_date).fromNow()}
                                </span>
                                <h2 className={Styles.title}>{article.title}</h2>
                                <p className={Styles.description}>{article.description}</p>
                                <Button label="Read Story" href={article.url} target="_blank" primary />
                            </div>
                        </section>
                        {(this.hasEngagement() || this.articleLinkStats.length > 0) &&
                        <aside className={Styles.metadata}>
                            <div className={Styles.viewport}>
                                {this.hasEngagement() &&
                                    <div className={Styles.summary} onClick={evt => evt.stopPropagation()}>
                                    <header>Summary</header>
                                    <div className={Styles.stats}>
                                        <Stat label="shares" value={this.numLinks} />
                                        <Stat label="clicks" value={this.clicks} />
                                        <Stat label="Facebook CTR" value={this.fbCTR} />
                                    </div>
                                </div>}
                                {this.articleLinkStats.length > 0 &&
                                <div className={Styles.recentActivity} onClick={evt => evt.stopPropagation()}>
                                    <header>Recent Activity</header>
                                    <div className={Styles.linkStats}>
                                        {this.articleLinkStats}
                                    </div>
                                </div>}
                            </div>
                        </aside>}
                    </div>
                </div>
            </div>
        );
    }

    hasEngagement() {
        return this.numLinks > 0 || this.clicks > 0 || this.fbCTR > 0;
    }

    onKeyUp(evt) {
        if (evt.key.toLowerCase() === 'escape') {
            this.hide();
        }
    }

    processData() {
        const article = this.props.article;

        this.classNames = classnames(this.props.visible, Styles.articleModal);
        this.articleLinkStats = !hasStats(article) ? 
            (<p>Sorry, no stats are available for this article</p>) : 
            article.links.map((link, index) => <ArticleModalStats link={link} key={index} index={index}/>
        );

        this.numLinks = article.links.length;
        this.clicks = _.reduce(article.links, function(acm, el){
            if(el.stats.facebook && el.stats.facebook.clicks > 0){
                acm += el.stats.facebook.clicks;
            } else if(el.stats.post && el.stats.post.clicks > 0){
                acm += el.stats.post.clicks;
            }
            return acm;
        }, 0);

        this.fbCTR = article.averageFbCtr;
        this.hasHeadlineIssue = article.clickbaitScore >= 3;
        this.user = UserStore.getState().user;
        this.rescrapeButton = _(this.user.permissions).includes('edit_articles') && <RescrapeButton ucid={article.ucid} />;
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

class Stat extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={Styles.stat}>
                <strong>{this.props.value.toLocaleString()}</strong>
                <span>{this.props.label}</span>
            </div>
        );
    }
}
