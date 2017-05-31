import React from 'react'
import AltContainer from 'alt-container'
import { defer } from 'lodash';

import Component from './Article.component'
import { Buttons } from './Article.component'
import ArticleStore from '../../../stores/Article.store'
import FilterStore from '../../../stores/Filter.store'
import UserStore from '../../../stores/User.store'
import ArticleActions from '../../../actions/Article.action'
import ShareDialogActions from '../../../actions/ShareDialog.action';
import LinkActions from '../../../actions/Link.action';
import AnalyticsActions from '../../../actions/Analytics.action';

import { pick } from 'lodash';

class Article extends React.Component {

    constructor(props) {
        super(props);
        this.showShareDialog = this.showShareDialog.bind(this);
    }

    // React currently shuffles around the data of currently mounted Article components instead of
    // mounting/unmounting them
    shouldComponentUpdate(nextProps) {
        var articleChanged = this.props.article.ucid !== nextProps.article.ucid;
        return articleChanged;
    }

    render() {
        return (
            <AltContainer
                component={ Component }
                shouldComponentUpdate={ (prevProps, container, nextProps) => {
                    return prevProps.data !== nextProps.data ||
                        prevProps.isSelected !== nextProps.isSelected ||
                        prevProps.influencer !== nextProps.influencer;
                }}
                actions={ ArticleActions }
                stores={{
                    data: props => ({
                        store: ArticleStore,
                        value: ArticleStore.getArticle(this.props.article.ucid)
                    }),
                    isSelected: props => ({
                        store: FilterStore,
                        value: Array.isArray(FilterStore.getState().ucids) && FilterStore.getState().ucids.indexOf(parseInt(this.props.article.ucid)) >= 0
                    }),
                    influencer: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().selectedInfluencer
                    })
                }}
                inject={{
                    showInfo: () => this.props.showInfo,
                    role: () => UserStore.getState().user.role,
                    showShareDialog: () => this.showShareDialog,
                    ...pick(this.props, 'className', 'condensed', 'selectable') // TODO: Find a way to trigger select article button to show at all times on mobile when Select is pressed
                }}
            />
        );
    }

    /**
     * Call this when user clicks on share button
     * @param {Object} article contains information about the story the user wants to share/schedule
     */
    showShareDialog(article) {
        AnalyticsActions.openShareDialog('Scheduler', article);
        defer(ShareDialogActions.open, { article });
    }

}

export default Article;
