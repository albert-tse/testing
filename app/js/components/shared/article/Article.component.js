import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import FontIcon from 'react-toolbox/lib/font_icon';
import moment from 'moment';
import Styles from './styles';
// import PlaceholderImage from '../../../../images/logo.svg'; Browserify+svgify returns an error because get() is deprecated
import SaveButton from './SaveButton.component';
import MenuButton from './MenuButton.component';
import { IconButton, Tooltip } from 'react-toolbox';

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

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.data.ucid != this.props.data.ucid) {
            return true;
        }

        if (nextProps.data.isLoading != this.props.data.isLoading) {
            return true;
        }

        if (nextProps.isSelected != this.props.isSelected) {
            return true;
        }

        return false;
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
        }

        var isShared = article.links && article.links.length > 0;

        var classNames = [
            Styles.article,
            this.props.isSelected && Styles.selected,
            isShared && !this.props.isSelected && Styles.shared
        ].filter(Boolean).join(' ');

        var titleClass = Styles.headline;

        if (article.clickbaitScore >= 3) {
            titleClass += ' ' + Styles.headlineIssue;
        }

        const TooltipButton = Tooltip(IconButton);
        const TitleIssueTooltip = () => (
            <TooltipButton className={Styles.headlineTooltip} icon='warning' tooltip='This title may not follow our content guidelines. Consider rewriting before sharing.' />
        );

        return (
            <div id={ 'article-' + article.ucid } className={classNames} data-ucid={article.ucid} onClick={::this.onClick}>
                <div className={Styles.articleContainer}>
                    <div className={Styles.thumbnail}>
                        <img src={article.image} onError={::this.showPlaceholder} />
                    </div>
                    <div className={Styles.metadata}>
                        <span className={Styles.site}>{article.site_name}{/*article.site_rating*/}</span>
                        <time className={Styles.timeAgo} datetime={moment(article.creation_date).format()}>{this.formatTimeAgo(article.creation_date)}</time>
                    </div>
                    <span className={titleClass}>
                        <h1 data-score={article.clickbaitScore}>{article.title}</h1>
                        <a href={article.url} target="_blank" onClick={ ::this.stopPropagation }>
                            <FontIcon value='open_in_new' />
                        </a>
                        <TitleIssueTooltip />
                    </span>
                    <p className={Styles.description}>{typeof article.description === 'string' && article.description.substr(0,200)}...</p>
                    <div className={Styles.actions}>
                        <span className={this.getPerformanceClassNames(article.performanceIndicator)}>{this.getPerformanceText(article.performanceIndicator)}</span>
                        <IconButton
                            icon={'information'}
                            onClick={::this.showInfoBar}
                        />
                        <SaveButton ucid={article.ucid} />
                        <MenuButton ucid={article.ucid} />
                    </div>
                </div>
            </div>
        );
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
        var timeAgo = moment(date).fromNow(true);

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

    showInfoBar(evt) {
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
