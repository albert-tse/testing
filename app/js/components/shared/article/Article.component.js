import React, { Component } from 'react';
import { Button, FontIcon, IconButton, ProgressBar, Tooltip } from 'react-toolbox';
import moment from 'moment';
import classnames from 'classnames';

import AddToListButton from './AddToListButton.component';
import HeadlineIssue from './HeadlineIssue.component';
import PublisherActions from './PublisherActions.component';
import SaveButton from './SaveButton.component';
import SelectArticleButton from './SelectArticleButton.component';
import ShareButton from './ShareButton.component';
import Styles from './styles';
import { responsive, hideOnPhonePortrait, hideOnPhoneLandscape, hideOnTabletPortrait } from '../../common';

import FilterStore from '../../../stores/Filter.store';

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
                <div id={ 'article-' + article.ucid } className={classnames(Styles.isLoading, Styles.article,this.props.className)} data-ucid={article.ucid}>
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

            const creationDate = article.creation_date + '+00:00';
            const capPercentage = article.capPercentage > 0 ? article.capPercentage * 100 : 0;
            return (
                <div ref={c => this.DOM = c} id={ 'article-' + article.ucid } className={articleClassNames} data-ucid={article.ucid} onClick={this.onClick}>
                    <div className={Styles.articleContainer}>
                        <div className={classnames(Styles.thumbnail)} style={{ backgroundImage: `url(${article.image})` }}>
                            {this.props.selectable && <SelectArticleButton checked={this.props.isSelected} />}
                        </div>
                        {capPercentage > 85 && (
                            <div
                                className={Styles.capPercentage} 
                                style={{ width: capPercentage+'%' }}>
                                <span className={Styles.label} >{capPercentage+'%'}</span>
                            </div>
                        )}
                        <div className={Styles.content}>
                            <div className={Styles.metadata}>
                                <span className={Styles.site}>{article.site_name}{/*article.site_rating*/}</span>
                                <time className={Styles.timeAgo} dateTime={moment(article.creation_date).format()}>{this.formatTimeAgo(article.creation_date)}</time>
                            </div>
                            <span className={Styles.headline}>
                                <header data-score={article.clickbaitScore}>
                                    <a href={article.url} target="_blank" onClick={evt => evt.stopPropagation()}>{article.title}</a>
                                </header>
                            </span>
                            <p className={Styles.description}>{typeof article.description === 'string' && article.description.substr(0,200)}...</p>
                            <div className={Styles.actions}>
                                <span className={this.getPerformanceClassNames(article.performanceIndicator)}>{this.getPerformanceText(article.performanceIndicator)}</span>
                                {!this.isPublisher ? this.renderArticleActions(article.ucid) : <PublisherActions article={article} />}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

renderArticleActions(ucid) {
    return (
        <div className={Styles.articleActions}>
            <AddToListButton className={classnames(responsive, hideOnPhonePortrait, hideOnPhoneLandscape, hideOnTabletPortrait)} ucid={ucid} isOnCard />
            <SaveButton ucid={ucid} isOnCard /> 
            <ShareButton article={this.props.data} onClick={this.props.showShareDialog} isOnCard />
        </div>
    );
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
        return Array.isArray(FilterStore.getState().ucids) || /selectArticleButton/.test(evt.target.className);
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
        this.isSelecting(evt) ? this.onClickSelection(evt) : this.props.showInfo({ data: this.props.data, dom: this.DOM });
        return evt.stopPropagation();
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

}

Article.defaultProps = {
    selectable: true
};

export const Buttons = {
    RELATED: 'Related',
    SHARE: 'Share',
    MORE: 'More'
};
