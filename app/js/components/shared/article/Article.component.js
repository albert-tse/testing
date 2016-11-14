import React, { Component } from 'react';
import { Button, FontIcon, IconButton, ProgressBar, Tooltip } from 'react-toolbox';
import PublisherActions from './PublisherActions.component';

import SaveButton from './SaveButton.component';
import ShareButton from './ShareButton.component';
import HeadlineIssue from './HeadlineIssue.component';
import SelectArticleButton from './SelectArticleButton.component';
import Styles from './styles';

import FilterStore from '../../../stores/Filter.store';

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
        this.isPublisher = this.props.role === 'publisher';
        this.onClick = this.onClick.bind(this);
        this.onClickSelection = this.onClickSelection.bind(this);
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
                this.props.className && this.props.className,
                this.props.condensed && Styles.condensed,
                isShared && !this.props.isSelected && Styles.shared,
                isTestShared && !this.props.isSelected && Styles.sharedTest,
                hasHeadlineIssue && Styles.headlineIssue,
                !article.enabled && Styles.disabled
            );

            return (
                <div id={ 'article-' + article.ucid } className={articleClassNames} data-ucid={article.ucid} onClick={this.onClick}>
                    <div className={Styles.articleContainer}>
                        <div className={classnames(Styles.thumbnail)} style={{ backgroundImage: `url(${article.image})` }}>
                            <SelectArticleButton checked={this.props.isSelected} />
                        </div>
                        <div className={Styles.content}>
                            <div className={Styles.metadata}>
                                <span className={Styles.site}>{article.site_name}{/*article.site_rating*/}</span>
                                <time className={Styles.timeAgo} dateTime={moment(article.creation_date).format()}>{this.formatTimeAgo(article.creation_date)}</time>
                            </div>
                            <span className={Styles.headline}>
                                <header data-score={article.clickbaitScore}>
                                    <a href={article.url} target="_blank">{article.title}</a>
                                </header>
                            </span>
                            <p className={Styles.description}>{typeof article.description === 'string' && article.description.substr(0,200)}...</p>
                            <div className={Styles.actions}>
                                <span className={this.getPerformanceClassNames(article.performanceIndicator)}>{this.getPerformanceText(article.performanceIndicator)}</span>
                                {!this.isPublisher ? <SaveButton ucid={article.ucid} isOnCard /> : <PublisherActions article={article} />}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    showPlaceholder(evt) {
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

    isSelecting(evt) {
        return FilterStore.getState().ucids.length > 0 || /selectArticleButton/.test(evt.target.className);
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

    onClickSelection(evt) {
        this.props.isSelected ? 
            this.props.deselected(this.props.data.ucid) : 
            this.props.selected(this.props.data.ucid);
        return evt.stopPropagation();
    }

    onClick(evt) {
        this.isSelecting(evt) ? this.onClickSelection(evt) : this.props.showInfo(this.props.data);
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

