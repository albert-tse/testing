import React, { Component } from 'react';
import Article from './Article.container';
import InfoBar from '../infobar';
import FilterActions from '../../../actions/Filter.action';
import Styles from './styles';


export default class ArticleView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            infoArticle: null,
            showInfoBar: false
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
    shouldComponentUpdate(nextProps) {
        return !this.props.preventUpdate || this.props.articles !== nextProps.articles;
    }

    render() {
        return (
            <div>
                <div className={Styles.container}>
                    { this.hasArticles() && this.renderArticles() }
                </div>
                <InfoBar article={this.state.infoArticle} visible={this.state.showInfoBar} hide={::this.hideInfoBar}/>
            </div>
        );
    }

    hasArticles() {
        return this.props.articles.length > 0;
    }

    renderArticles() {
        return this.props.articles.map((article, index) => (
            <Article key={index} article={article} showInfo={::this.showInfoBar}/>
        ));
    }

    hideInfoBar() {
        this.setState({
            showInfoBar: false,
            infoArticle: null
        });
    }

    showInfoBar(article) {
        this.setState({
            showInfoBar: true,
            infoArticle: article
        });
    }
}

ArticleView.defaultProps = {
    articles: []
};
