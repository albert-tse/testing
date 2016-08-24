import React, { Component } from 'react';
import { Button } from 'react-toolbox';
import Article from './Article.container';
import ArticleModal from '../articleModal';
import ShareDialog from './ShareDialog.component';
import SearchActions from '../../../actions/Search.action';
import FilterActions from '../../../actions/Filter.action';
import Styles from './styles';
import classnames from 'classnames';

export default class ArticleView extends Component {

    constructor(props) {
        super(props);
        this.reset = this.reset.bind(this);
        this.state = {
            infoArticle: null,
            showArticleModal: false
        };
    }

    componentWillUnmount() {
        FilterActions.clearSelection();
    }

    /**
     * Allow this component to not remove elements from the DOM
     * @param Object nextProps contains the articles that will may be loaded
     * @return Boolean false if it's going to try to remove articles from the view 
     */
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.articles !== nextProps.articles || this.state !== nextState;
    }

    render() {
        return (
            <div>
                <div className={classnames(Styles.container, !this.hasArticles() && Styles.isEmpty)}>
                    { this.isLoading() ? this.renderLoading() :
                        this.hasArticles() ? this.renderArticles() :
                        this.renderEmpty() }
                </div>
                <ShareDialog />
                <ArticleModal article={this.state.infoArticle} visible={this.state.showArticleModal} hide={::this.hideArticleModal}/>
            </div>
        );
    }

    isLoading() {
        return this.props.articles === -1;
    }

    hasArticles() {
        return this.props.articles.length > 0;
    }

    renderEmpty() {
        return 'emptyState' in this.props ? this.props.emptyState() : (
            <div style={{ textAlign: 'center' }}>
                <strong>Sorry, we could not find any stories matching your filters.</strong>
                <Button
                    style={{ marginTop: '2rem' }} 
                    label="Reset" 
                    raised 
                    primary 
                    onClick={this.reset} />
            </div>
        );
    }

    renderArticles() {
        return this.props.articles.map((article, index) => (
            <Article key={index} article={article} showInfo={::this.showArticleModal}/>
        ));
    }

    renderLoading() {
        return (
            <div style={{ textAlign: 'center' }}>
                <strong>Loading...</strong>
            </div>
        );
    }

    hideArticleModal() {
        this.setState({
            showArticleModal: false,
            infoArticle: null
        });
    }

    showArticleModal(article) {
        if (this.state.showArticleModal) {
            this.hideArticleModal();
        }
        else {
            this.setState({
                showArticleModal: true,
                infoArticle: article
            });
        }
    }
    
    reset() {
        FilterActions.reset();
        SearchActions.getResults();
    }
}

ArticleView.defaultProps = {
    articles: []
};
