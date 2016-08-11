import React, { Component } from 'react';
import Article from './Article.container';
import ArticleModal from '../articleModal';
import ShareDialog from './ShareDialog.component';
import FilterActions from '../../../actions/Filter.action';
import Styles from './styles';


export default class ArticleView extends Component {

    constructor(props) {
        super(props);
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
                <div className={Styles.container}>
                    { this.hasArticles() && this.renderArticles() }
                </div>
                <ShareDialog />
                <ArticleModal article={this.state.infoArticle} visible={this.state.showArticleModal} hide={::this.hideArticleModal}/>
            </div>
        );
    }

    hasArticles() {
        return this.props.articles.length > 0;
    }

    renderArticles() {
        return this.props.articles.map((article, index) => (
            <Article key={index} article={article} showInfo={::this.showArticleModal}/>
        ));
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
}

ArticleView.defaultProps = {
    articles: []
};
