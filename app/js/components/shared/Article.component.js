import React from 'react'

/**
 * Article Component
 * @prop int key is going to be used by React to manage a collection of this component
 * @prop Object data describes one article
 * @return React.Component
 */
class Article extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.data);
    }

    render() {
        var article = this.props.data;

        if ('data' in this.props) {
            return (
                <div id={ 'article-' + article.ucid } className="grid-item article articlex" data-ucid={article.ucid}>
                    <img className="th" src={article.image} />
                    <div className="metadata">
                        <a className="info" ucid={article.ucid}><i className="fa fa-info-circle fa-lg"></i></a>
                        <time datetime={article.createdAt.format()}>{article.createdAt.fromNow()}</time>
                        <span className="site"> by {article.siteId} rated {'M'}</span>
                    </div>
                    <h1 className="headline">{article.title}</h1>
                    <p className="description">{article.description}</p>
                    <div className="actions">
                        <div className="action">
                            <a href="#related">Related</a>
                        </div>
                        <div className="share action highlight-on-hover">
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
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div />
        );
    }
    
}

export default Article;
