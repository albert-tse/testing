import React from 'react'
import AltContainer from 'alt-container'
import { defer } from 'lodash';

import Component from './ArticleModal.component'
import ArticleStore from '../../../stores/Article.store'
import UserStore from '../../../stores/User.store';

import AnalyticsActions from '../../../actions/Analytics.action';
import ArticleActions from '../../../actions/Article.action'
import LinkActions from '../../../actions/Link.action';
import ShareDialogActions from '../../../actions/ShareDialog.action';

class ArticleModal extends React.Component {

    constructor(props) {
        super(props);
        this.showShareDialog = this.showShareDialog.bind(this);
    }
    
    render() {

        if (this.props.article == null) {
            return null;
        }

        return (
            <AltContainer
                stores={{
                    article: props => ({
                        store: ArticleStore,
                        value: ArticleStore.getArticle(this.props.article.data.ucid)
                    })
                }}
                actions={ ArticleActions }
                component={ Component }
                inject={{
                    hide: () => this.props.hide,
                    visible: this.props.visible,
                    dom: this.props.article.dom,
                    onClick: () => this.showShareDialog
                }}
            />
        );
    }
    
    /**
     * Call this when user clicks on share button
     * Determines whether it should show legacy sharing or scheduler dialog
     * @param {Object} article contains information about the story the user wants to share/schedule
     */
    showShareDialog(article) {
        const { hasConnectedProfiles } = UserStore.getState();
        if (hasConnectedProfiles) {
            AnalyticsActions.openShareDialog('Scheduler', article);
            defer(ShareDialogActions.open, { article });
        } else {
            AnalyticsActions.openShareDialog('Legacy Share Dialog', article);
            defer(LinkActions.generateLink, { ucid: article.ucid });
        }
    }

}

export default ArticleModal;
