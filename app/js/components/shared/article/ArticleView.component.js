import React, { Component } from 'react';
import Container from 'alt-container';
import { Button } from 'react-toolbox';
import Article from './Article.container';
import ArticleDialogs from './ArticleDialogs.component';

import ShareDialogStore from '../../../stores/ShareDialog.store';

import AnalyticsActions from '../../../actions/Analytics.action';
import SearchActions from '../../../actions/Search.action';
import FilterActions from '../../../actions/Filter.action';

import Styles from './styles';
import classnames from 'classnames';

export default class ArticleView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container
                component={Contained}
                store={ShareDialogStore}
                inject={this.props}
            />
        );
    }
}

class Contained extends Component {

    constructor(props) {
        super(props);
        this.reset = this.reset.bind(this);
        this.previewArticle = this.previewArticle.bind(this);
        this.resetPreviewArticle = this.resetPreviewArticle.bind(this);
        this.state = {
            previewArticle: null
        };
    }

    componentWillUnmount() {
        FilterActions.clearSelection();
    }

    componentDidUpdate(prevProps, prevState) {
        // Close article modal when article is scheduled/shared
        if (prevProps.isScheduling && !this.props.isScheduling && this.state.previewArticle !== null) {
            this.setState({ previewArticle: null });
        }
    }

    /**
     * Allow this component to not remove elements from the DOM
     * @param Object nextProps contains the articles that will may be loaded
     * @return Boolean false if it's going to try to remove articles from the view
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.articles !== nextProps.articles ||
            this.state !== nextState ||
            this.props.isSelecting !== nextProps.isSelecting ||
            this.props.isScheduling !== nextProps.isScheduling
        );
    }

    render() {
        return (
            <div>
                <div className={classnames(Styles.container, !this.hasArticles() && Styles.isEmpty, this.props.isSelecting && Styles.isSelecting)}>
                    { this.isLoading() ? this.renderLoading() :
                        this.hasArticles() ? this.renderArticles() :
                        this.renderEmpty() }
                </div>
                <ArticleDialogs
                    previewArticle={this.state.previewArticle}
                    resetPreviewArticle={this.resetPreviewArticle}
                />
            </div>
        );
    }

    renderArticles() {
        return this.props.articles.map((article, index) => (
            <Article key={index} article={article} showInfo={this.previewArticle}/>
        ));
    }

    renderLoading() {
        return (
            <div style={{ textAlign: 'center' }}>
                <strong>Loading...</strong>
            </div>
        );
    }

    renderEmpty() {
        return 'emptyState' in this.props && !!this.props.emptyState ? this.props.emptyState() : (
            <div style={{ textAlign: 'center' }}>
                <strong>Sorry, we could not find any stories matching your filters.</strong>
                <Button
                    style={{ marginTop: '2rem' }}
                    label="Reset"
                    raised
                    accent
                    onClick={this.reset} />
            </div>
        );
    }

    resetPreviewArticle() {
        this.setState({ previewArticle: null });
    }

    isLoading() {
        return this.props.articles === -1;
    }

    hasArticles() {
        return this.props.articles.length > 0;
    }

    previewArticle(article) {
        this.setState({ previewArticle: article });
        AnalyticsActions.openArticleView(article);
    }

    reset() {
        FilterActions.reset();
        SearchActions.getResults();
    }
}

ArticleView.defaultProps = {
    articles: []
};
