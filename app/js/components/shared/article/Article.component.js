import React, { Component } from 'react';
import { Button, FontIcon, IconButton, ProgressBar, Tooltip } from 'react-toolbox';

import SaveButton from './SaveButton.component';
import ShareButton from './ShareButton.component';
import HeadlineIssue from './HeadlineIssue.component';
import Styles from './styles';

import moment from 'moment';
import classnames from 'classnames';

/**
 * Article Component
 * @prop int key is going to be used by React to manage a collection of this component
 * @prop Object data describes one article
 * @return React.Component
 */
export default class Article extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var article = this.props.data;

        if (article.isLoading) {
            return (
                <div id={ 'article-' + article.ucid } className={Styles.article} data-ucid={article.ucid}>
                    <div className={Styles.articleContainer}>
                        <ProgressBar type="circular" mode="indeterminate" />
                    </div>
                </div>
            );
        } else {
            const hasHeadlineIssue = article.clickbaitScore >= 3;
            const isShared = _.find(article.links, el => el.influencer_id == this.props.influencer.id);
            const isTestShared = !isShared && _.find(article.links, el => el.test_network);
            const TooltipButton = Tooltip(IconButton);
            const articleClassNames = classnames(
                Styles.article,
                this.props.isSelected && Styles.selected,
                isShared && !this.props.isSelected && Styles.shared,
                isTestShared && !this.props.isSelected && Styles.sharedTest,
                hasHeadlineIssue && Styles.headlineIssue
            );

            return (
                <div id={ 'article-' + article.ucid } className={articleClassNames} data-ucid={article.ucid} onClick={::this.onClick}>
                    <div className={Styles.articleContainer}>
                        <div className={Styles.topBar}>
                            <SaveButton ucid={article.ucid} />
                            <div className={Styles.showOnHover}>
                                <TooltipButton
                                    primary
                                    raised
                                    icon="info"
                                    ripple={false}
                                    onClick={::this.showArticleModal}
                                    tooltip="View Info"
                                />
                            </div>
                        </div>
                        <div className={classnames(Styles.thumbnail)} style={{ backgroundImage: `url(${article.image})` }}>
                        </div>
                        <div className={Styles.content}>
                            <div className={Styles.metadata}>
                                <span className={Styles.site}>{article.site_name}{/*article.site_rating*/}</span>
                                <time className={Styles.timeAgo} dateTime={moment(article.creation_date).format()}>{this.formatTimeAgo(article.creation_date)}</time>
                            </div>
                            <span className={Styles.headline}>
                                <header data-score={article.clickbaitScore}>
                                    {article.title}
                                    <a className={classnames("material-icons", Styles.openInNew)} href={article.url} target="_blank" onClick={evt => evt.stopPropagation()}>open_in_new</a>
                                </header>
                            </span>
                            <p className={Styles.description}>{typeof article.description === 'string' && article.description.substr(0,200)}...</p>
                            <a className={classnames(Styles.linkToSimilar, Styles.visibleOnHover)} href={'/#/related/' + article.ucid} onClick={evt => evt.stopPropagation()}>Related Stories</a>
                            <div className={Styles.actions}>
                                <span className={this.getPerformanceClassNames(article.performanceIndicator)}>{this.getPerformanceText(article.performanceIndicator)}</span>
                                <HeadlineIssue />
                                <ShareButton ucid={article.ucid} />
                            </div>

                        </div>
                    </div>
                </div>
            );
        }
    }

    showPlaceholder(evt) {
        // evt.currentTarget.src = PlaceholderImage;
        evt.currentTarget.className = Styles.noImage;
    }

    getPerformanceText(performance) {
        var label = '';

        if (performance < 6) {
            label = 'average';
        } else if (performance < 13) {
            label = 'good';
        } else if (performance >= 13) {
            label = 'very good';
        }

        return label;
    }

    getPerformanceClassNames(performance) {
        var classNames = [Styles.articlePerf];

        if (performance < 6) {
            classNames.push(Styles.average);
        } else if (performance < 13) {
            classNames.push(Styles.good);
        } else if (performance >= 13) {
            classNames.push(Styles.veryGood);
        }

        return classNames.join(' ');
    }

    formatTimeAgo(date) {
        var differenceInDays = moment().diff(date, 'days');
        var timeAgo = moment(date).fromNow();

        if (7 < differenceInDays && differenceInDays < 365) {
            timeAgo = moment(date).format('MMM D');
        } else if (/years?/.test(timeAgo)) {
            timeAgo = moment(date).format('MMM D YYYY');
        }

        return timeAgo;
    }

    onClick() {
        this.props.isSelected ? this.props.deselected(this.props.data.ucid) : this.props.selected(this.props.data.ucid);
    }

    showArticleModal(evt) {
        this.props.showInfo(this.props.data);
        return evt.stopPropagation();
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

}

export const Buttons = {
    RELATED: 'Related',
    SHARE: 'Share',
    MORE: 'More'
};
