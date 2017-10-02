import React from 'react'
import connect from 'alt-utils/lib/connect'
import AltContainer from 'alt-container'
import defer from 'lodash/defer'
import find from 'lodash/find'
import pick from 'lodash/pick'
import branch from 'recompose/branch'
import compose from 'recompose/compose'
import lifecycle from 'recompose/lifecycle'
import pure from 'recompose/pure'
import withHandlers from 'recompose/withHandlers'
import renderComponent from 'recompose/renderComponent'
import setDisplayName from 'recompose/setDisplayName'

import Component, { LoadingArticleComponent } from './Article.component'
import { Buttons } from './Article.component'
import ArticleStore from 'stores/Article.store'
import FilterStore from 'stores/Filter.store'
import UserStore from 'stores/User.store'
import ArticleActions from 'actions/Article.action'
import ShareDialogStore from 'stores/ShareDialog.store'
import ShareDialogActions from 'actions/ShareDialog.action'
import LinkActions from 'actions/Link.action'
import AnalyticsActions from 'actions/Analytics.action'

export default compose(

    setDisplayName('ArticleContainer'),

    connect({
        listenTo() {
            return [ArticleStore, FilterStore, UserStore]
        },

        reduceProps(props) {
            const article = ArticleStore.getArticle(props.article.ucid)
            const influencer = FilterStore.getState().selectedInfluencer
            const isShared = find(article.links, el => el.influencer_id == influencer.id)

            return {
                article,
                creationDate: article.creation_date + '+00:00',
                capPercentage: article.capPercentage > 0 ? article.capPercentage * 100 : 0,
                hadHeadlineIssue: article.clickbaitScore >= 3,
                influencer,
                isPublisher: UserStore.getState().user.role.toLowerCase() === 'publisher',
                isSelected: Array.isArray(FilterStore.getState().ucids) && FilterStore.getState().ucids.indexOf(parseInt(props.article.ucid)) >= 0,
                isShared,
                isTestShared: !isShared ? find(article.links, el => el.test_network) : false,
                ...pick(props,'className', 'condensed', 'selectable')
            }
        }
    }),

    lifecycle({

        componentDidMount() {
            const props = this.props
            if (props.article.isLoading) {
                console.log('I need to fetch article whose ucid is', props.article.ucid)
            }
        }

    }),

    withHandlers({

        onClickSelection: props => evt => {
            props.isSelected ?
                ArticleActions.deselected(props.article.ucid) :
                ArticleActions.selected(props.article.ucid)
            return evt.stopPropagation()
        }

    }),

    withHandlers({
        showShareDialog: props => article => {
            AnalyticsActions.openShareDialog('Scheduler', article)
            defer(ShareDialogActions.open, { article })
        },

        onClick: props => evt => {
            if (document.getSelection().toString().length < 1) {
                isSelecting(evt) ? props.onClickSelection(evt) : props.showInfo({ data: props.article })
            }
            return evt.stopPropagation()
        }

    }),

    branch(props => props.article.isLoading, renderComponent(LoadingArticleComponent)),

    pure
)(Component)

function isSelecting(evt) {
    return Array.isArray(FilterStore.getState().ucids) || /selectArticleButton/.test(evt.target.className)
}
