import React, { Component } from 'react';
import { Dialog, Button, IconButton, Link } from 'react-toolbox';
import classnames from 'classnames';
import moment from 'moment';
import defer from 'lodash/defer';

import UserStore from '../../../stores/User.store';
import LinkStore from '../../../stores/Link.store';
import LinkActions from '../../../actions/Link.action';

import AddToListButton from '../article/AddToListButton.component';
import ArticleModalStats from './ArticleModalStats.component';
import RescrapeButton from '../article/RescrapeButton.component';
import DisableButton from '../article/DisableButton.component';
import SaveButton from '../article/SaveButton.component';
import ShareButton from '../article/ShareButton.component';

import Styles from './styles';
import { overlay } from '../../../../scss/overlay';
import { headlineIssue } from '../article/styles';
import { scrollable } from '../../common';

const FULLSCREEN_CLASSNAME = 'fullscreen';

/**
 * How to use this:
 * TODO: specify the props a container should pass to this component to properly render
 */
class ArticleModal extends React.Component {

    constructor(props) {
        super(props);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.hide = this.hide.bind(this);
        this.onClick = this.props.onClick;

        this.state = this.processData(props);
    }

    componentWillReceiveProps(nextProps){
        this.setState(this.processData(nextProps));
    }

    componentDidMount() {
        if (document && document.body) {
            document.body.addEventListener('keyup', this.onKeyUp);
            this.props.fullscreen && document.body.classList.add(FULLSCREEN_CLASSNAME);
        }
    }

    componentWillUnmount() {
        if (document && document.body) {
            document.body.removeEventListener('keyup', this.onKeyUp);
            document.body.classList.remove(FULLSCREEN_CLASSNAME);
        }
    }

    render() {
        const article = this.props.article;

        if (article.isLoading) {
            return null;
        }

        var rescrapeButton = _(this.state.user.permissions).includes('edit_articles') && <RescrapeButton ucid={this.props.article.ucid} />;
        var disableButton = this.state.user.role == 'admin' && <DisableButton ucid={this.props.article.ucid} />;

        return (
            <div className={classnames(Styles.overlay)} onClick={this.hide} onScroll={evt => evt.stopPropagation()}>
                <div className={Styles.backdrop} />
                <div className={Styles.appBar}>
                    <div className={Styles.upButton}>
                        <IconButton icon="arrow_back" />
                        <h1>Back</h1>
                    </div>
                </div>
                <div>
                    <div className={Styles.viewer}>
                        <div className={classnames(Styles.viewer__container, scrollable)}>
                            <section className={classnames(Styles.mainContent, this.hasEngagement() && Styles.hasEngagement)} onClick={evt => evt.stopPropagation()}>
                                <img className={Styles.coverImage} src={article.image} />
                                <div className={Styles.content}>
                                    <div className={Styles.actions}>
                                        {disableButton}
                                        {rescrapeButton}
                                        <AddToListButton ucid={article.ucid} closeDialog={this.hide} />
                                        <SaveButton ucid={article.ucid} />
                                        <ShareButton article={article} label="Share" primary onClick={this.onClick} />
                                    </div>
                                    <span className={Styles.siteName}>{article.site_name.toUpperCase()}</span>
                                    <span className={Styles.publishDate}>
                                        {moment(article.publish_date).fromNow()}
                                    </span>
                                    <h2 className={classnames('selectable', Styles.title)}>{article.title}</h2>
                                    <p className={Styles.description}>{article.description}</p>
                                    <Button label="Read Story" href={article.url} target="_blank" />
                                    <Button label="Related Stories" href={'/#/related/' + this.props.article.ucid} target="_blank" />
                                </div>
                            </section>
                            {(this.hasEngagement() || this.state.articleLinkStats.length > 0) &&
                            <aside className={Styles.metadata}>
                                <div className={Styles.viewport}>
                                    {this.hasEngagement() &&
                                        <div className={Styles.summary} onClick={evt => evt.stopPropagation()}>
                                        <header>Summary</header>
                                        <div className={Styles.stats}>
                                            <Stat label="shares" value={this.state.numLinks} />
                                            <Stat label="clicks" value={this.state.clicks} />
                                            <Stat label="Facebook CTR" value={this.state.fbCTR} />
                                        </div>
                                    </div>}
                                    {this.state.articleLinkStats.length > 0 &&
                                    <div className={Styles.recentActivity} onClick={evt => evt.stopPropagation()}>
                                        <header>Recent Activity</header>
                                        <div className={Styles.linkStats}>
                                            {this.state.articleLinkStats}
                                        </div>
                                    </div>}
                                </div>
                            </aside>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    hasEngagement() {
        return this.state.numLinks > 0 || this.state.clicks > 0 || this.state.fbCTR > 0;
    }

    onKeyUp(evt) {
        if (evt.key.toLowerCase() === 'escape') {
            this.hide();
        }
    }

    processData(props) {
        var state = {};

        const article = props.article;

        state.classNames = classnames(props.visible, Styles.articleModal);
        state.articleLinkStats = !hasStats(article) ?
            (<p>Sorry, no stats are available for this article</p>) :
            article.links.map((link, index) => <ArticleModalStats link={link} key={index} index={index}/>
        );

        state.numLinks = Array.isArray(article.links) ? article.links.length : 0;
        state.clicks = _.reduce(article.links, function(acm, el){
            if(el.stats.facebook && el.stats.facebook.clicks > 0){
                acm += el.stats.facebook.clicks;
            } else if(el.stats.post && el.stats.post.clicks > 0){
                acm += el.stats.post.clicks;
            }
            return acm;
        }, 0);

        state.fbCTR = article.averageFbCtr && article.averageFbCtr.toFixed(2) + '%';
        state.hasHeadlineIssue = article.clickbaitScore >= 3;
        state.user = UserStore.getState().user;

        return state;
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
