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
                    {this.isLoading() ? <Loading /> :
                        this.hasArticles() ? Articles({ articles: Array.isArray(this.props.articles) ? this.props.articles : [], previewArticle: this.previewArticle}) :
                            <Empty customComponent={'emptyState' in this.props && !!this.props.emptyState ? this.props.emptyState : null} reset={this.reset} />
                    }
                </div>
                <ArticleDialogs
                    previewArticle={this.state.previewArticle}
                    resetPreviewArticle={this.resetPreviewArticle}
                />
            </div>
        );
    }



    resetPreviewArticle() {
        if (document.getSelection().toString().length < 1) {
            this.setState({ previewArticle: null });
        }
    }

    isLoading() {
        return this.props.articles === -1;
    }

    hasArticles() {
        return this.props.articles.length > 0;
    }

    previewArticle = article => {
        this.setState({ previewArticle: article });
        AnalyticsActions.openArticleView(article);
    }

    reset() {
        FilterActions.reset();
        SearchActions.getResults();
    }
}

function Articles({ articles, previewArticle }) {
    return articles.map((article, index) => (
        <Article key={index} article={article} showInfo={previewArticle}/>
    ));
}

function Loading() {
    return (
        <div style={{ textAlign: 'center' }}>
            <strong>Loading...</strong>
        </div>
    );
}

function Empty({ customComponent, reset }) {
    return !!customComponent ? customComponent : (
        <div style={{ textAlign: 'center' }}>
            <strong>Sorry, we could not find any stories matching your filters.</strong>
            <Button
                style={{ marginTop: '2rem' }}
                label="Reset"
                raised
                accent
                onClick={reset} />
        </div>
    );
}

ArticleView.defaultProps = {
    articles: []
};
