import React from 'react';
import { Header } from '../shared';
import Article from '../shared/Article.component';


class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div id="saved-tab" className="tab-content">
            <Header />
            <div id="articles-container" className="container-fluid row">
                {this.props.articles.map(::this.renderArticle)}
            </div>
        </div>
        );
    }

    renderArticle(article, index) {
        return (
            <Article key={index} data={article}>
                <actions>
                    <action position="left"><a className="highlight-on-hover" href={ '/?relatedto=' + article.ucid}>Related</a></action>
                    <action position="left">
                        <div className="btn-group">
                            <a type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="highlight-on-hover" href="#share">Share</a>
                            <ul className="dropdown-menu">
                                <li><a className="social-btn" data-platform="Facebook" data-url={article.url} data-ucid={article.ucid} data-platform-url><i className="fa fa-facebook"></i> Facebook</a></li>
                                <li><a className="social-btn" data-platform="Twitter" data-url={article.url} data-ucid={article.ucid} data-platform-url><i className="fa fa-twitter"></i> Twitter</a></li>
                                <li><a className="social-btn" data-platform="Tumblr" data-url={article.url} data-description={article.description} data-title={article.title} data-ucid={article.ucid} data-platform-url><i className="fa fa-tumblr"></i> Tumblr</a></li>
                                <li><a className="social-btn" data-platform="Pinterest" data-url={article.url} data-image={article.image} data-description={article.description} data-ucid={article.ucid} data-platform-url><i className="fa fa-pinterest"></i> Pinterest</a></li>
                                <li><a className="social-btn" data-platform="Google +" data-url={article.url} data-ucid={article.ucid} data-platform-url><i className="fa fa-google-plus"></i> Google+</a></li>
                            </ul>
                        </div>
                    </action>
                </actions>
            </Article>
        );
    }
}

export default Saved;
