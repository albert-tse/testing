import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import ListPreview from './ListPreview';
import ArticleDialogs from '../shared/article/ArticleDialogs.component';
import AppContent from '../shared/AppContent/AppContent.component';

import Config from '../../config';
import ListAction from '../../actions/List.action';

import _ from 'lodash';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.previewArticle = this.previewArticle.bind(this);
        this.renderListPreview = this.renderListPreview.bind(this);;
        this.resetPreviewArticle = this.resetPreviewArticle.bind(this);
        this.state = {
            previewArticle: null
        };
    }

    componentWillMount() {
        ListAction.loadMyLists();
    }

    render() {
        return (
            <AppContent withoutToolbar>
                {Config.listsOnHome.map(this.renderListPreview)}
                <ArticleDialogs
                    previewArticle={this.state.previewArticle}
                    resetPreviewArticle={this.resetPreviewArticle}
                />
            </AppContent>
        );
    }

    renderListPreview(list, index) {
        return React.createElement(ListPreview, {
            key: index,
            overrides: list.overrides,
            listId: list.type === 'static' && list.id,
            specialList: list.type === 'special' && list.name,
            listObj: list.type === 'object' && list.object,
            previewArticle: () => this.previewArticle
        });
    }

    previewArticle(article) {
        this.setState({ previewArticle: article });
    }

    resetPreviewArticle() {
        this.setState({ previewArticle: null });
    }
}
