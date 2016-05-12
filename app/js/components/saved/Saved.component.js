import React from 'react';
import Article from '../shared/article/Article.container';


class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.list.isLoading) {
            return (
                <div id="articles-container" className="container">
                    <div className="row">
                        Loading....
                    </div>
                </div>
            );
        } else {
            return (
                <div id="articles-container" className="container">
                    <div className="row">
                        { _.map(this.props.list.articles, ::this.renderArticle)}
                    </div>
                </div>
            );
        }
    }

    renderArticle(article, index) {
        return (<Article key = { index } article={ article } />);
    }
}

export default Saved;
