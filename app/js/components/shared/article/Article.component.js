import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import classnames from 'classnames'
import Button from 'react-toolbox/lib/button'
import FontIcon from 'react-toolbox/lib/font_icon'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import Tooltip from 'react-toolbox/lib/tooltip'

import FilterStore from 'stores/Filter.store'

import { responsive, hideOnPhonePortrait, hideOnPhoneLandscape, hideOnTabletPortrait } from 'components/common'
import { IconButton } from '../../index'
import HeadlineIssue from './HeadlineIssue.component'
import PublisherActions from './PublisherActions.component'
import SaveToListButton from './SaveToListButton.component'
import SelectArticleButton from './SelectArticleButton.component'
import ShareButton from './ShareButton.component'
import Styles from './styles'

/**
 * Component that indicates that article is loading
 * @return {React.PureComponent}
 */
export class LoadingArticleComponent extends React.PureComponent {

    static propTypes = {
        article: PropTypes.object,
    }

    static defaultProps = {
        article: {},
    }

    render() {
        const props = this.props

        return (
            <div id={ 'article-' + props.article.ucid } className={classnames(Styles.isLoading, Styles.article,props.className)} data-ucid={props.article.ucid}>
                <div className={Styles.articleContainer}>
                    <ProgressBar type="circular" mode="indeterminate" />
                </div>
            </div>
        )
    }
}

/**
 * Section containing call to actions for given Article
 * @return {React.PureComponent}
 */
class ArticleActions extends React.PureComponent {

    static propTypes = {
        article: PropTypes.object,
        showShareDialog: PropTypes.func,
        ucid: PropTypes.number
    }

    render() {
        const props = this.props

        return (
            <div className={Styles.articleActions}>
                <IconButton className={Styles.headlineTooltip} icon='warning' title='This title may not follow our content guidelines. Consider rewriting before sharing.' />
                <SaveToListButton ucid={props.ucid} isOnCard />
                <ShareButton article={props.article} onClick={props.showShareDialog} isOnCard />
            </div>
        )
    }
}

/**
 * Article Component
 * @prop int key is going to be used by React to manage a collection of this component
 * @prop Object data describes one article
 * @return React.Component
 */
export default class Article extends React.Component {

    static propTypes = {
        article: PropTypes.object,
        capPercentage: PropTypes.number,
        className: PropTypes.string,
        condensed: PropTypes.bool,
        creationDate: PropTypes.string,
        hasHeadlineIssue: PropTypes.bool,
        onClick: PropTypes.func,
        isPublisher: PropTypes.bool,
        isSelected: PropTypes.bool,
        isShared: PropTypes.bool,
        isTestShared: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        selectable: PropTypes.bool
    }

    static defaultProps = {
        selectable: true
    }

    render() {
        const props = this.props

        const articleClassNames = classnames(
            Styles.article,
            props.isSelected && Styles.selected,
            props.className,
            props.condensed && Styles.condensed,
            props.isShared && !props.isSelected && Styles.shared,
            props.isTestShared && !props.isSelected && Styles.sharedTest,
            props.hasHeadlineIssue && Styles.headlineIssue,
            !props.article.enabled && Styles.disabled
        )

        return (
            <div id={ 'article-' + props.article.ucid } className={articleClassNames} data-ucid={props.article.ucid} onClick={props.onClick}>
                <div className={Styles.articleContainer}>
                    <div className={Styles.thumbnail} style={{ backgroundImage: `url(${props.article.image})` }}>
                        {props.selectable && <SelectArticleButton checked={props.isSelected} />}
                    </div>
                    {props.capPercentage > 85 && (
                        <div
                            className={Styles.capPercentage}
                            style={{ width: props.capPercentage > 100 ? 100+'%' : (props.capPercentage+'%') }}>
                            <span className={Styles.label} >{props.capPercentage+'%'}</span>
                        </div>
                    )}
                    <div className={Styles.content}>
                        <div className={Styles.metadata}>
                            <span className={Styles.site}>{props.article.site_name}</span>
                            <time className={Styles.timeAgo} dateTime={moment(props.creationDate).format()}>{this.formatTimeAgo(props.creationDate)}</time>
                        </div>
                        <span className={Styles.headline}>
                            <header data-score={props.article.clickbaitScore}>
                                <a href={props.article.url} target="_blank" onClick={evt => evt.stopPropagation()} className="selectable">{props.article.title}</a>
                            </header>
                        </span>

                        <p className={Styles.description}>{typeof props.article.description === 'string' && props.article.description.substr(0,200)}...</p>
                        <div className={Styles.actions}>
                            <span className={this.getPerformanceClassNames(props.article.performanceIndicator)}>{this.getPerformanceText(props.article.performanceIndicator)}</span>
                            {!props.isPublisher
                                ? <ArticleActions ucid={props.article.ucid} article={props.article} showShareDialog={props.showShareDialog} />
                                : <PublisherActions article={props.article} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getPerformanceText(performance) {
        var label = ''

        if (performance < 6) {
            label = 'average'
        } else if (performance < 13) {
            label = 'good'
        } else if (performance >= 13) {
            label = 'very good'
        }

        return label
    }

    getPerformanceClassNames(performance) {
        var classNames = [Styles.articlePerf]

        if (performance < 6) {
            classNames.push(Styles.average)
        } else if (performance < 13) {
            classNames.push(Styles.good)
        } else if (performance >= 13) {
            classNames.push(Styles.veryGood)
        }

        return classNames.join(' ')
    }

    formatTimeAgo(date) {
        var differenceInDays = moment().diff(date, 'days')
        var timeAgo = moment(date).fromNow()

        if (7 < differenceInDays && differenceInDays < 365) {
            timeAgo = moment(date).format('MMM D')
        } else if (/years?/.test(timeAgo)) {
            timeAgo = moment(date).format('MMM D YYYY')
        }

        return timeAgo
    }

}

export const Buttons = {
    RELATED: 'Related',
    SHARE: 'Share',
    MORE: 'More'
}
