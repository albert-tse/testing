import React from 'react'

/**
 * Article Component
 * @prop int key is going to be used by React to manage a collection of this component
 * @prop Object data describes one article
 * @return React.Component
 */
class Article extends React.Component {

    static defaultProps = {
        actions: []
    };

    constructor(props) {
        super(props);
    }

    render() {
        var article = this.props.data;

        if ('data' in this.props) {
            return (
                <div id={ 'article-' + article.ucid } className="grid-item article articlex highlight-on-hover" data-ucid={article.ucid}>
                    <img className="th" src={article.image} />
                    <div className="metadata">
                        <a className="info highlight-on-hover" ucid={article.ucid}><i className="fa fa-info-circle fa-lg"></i></a>
                        <time datetime={article.createdAt.format()}>{article.createdAt.fromNow()}</time>
                        <span className="site"> by {article.siteId} rated {'M'}</span>
                    </div>
                    <h1 className="headline highlight-on-hover">{article.title}</h1>
                    <p className="description">{article.description}</p>
                    <div className="actions">
                        {this.props.actions.map((action, index) => this['render' + action](article, index))}
                    </div>
                </div>
            );
        }

        return <div />
    }

   /**
    * ~Actions
    * -------------------------------------------------- */
    renderRelated(article, index) {
        return (
            <div key={index} className="left action">
                <a className="highlight-on-hover" href={ '/?relatedto=' + article.ucid}>Related</a>
            </div>
        );
    }

    renderShare(article, index) {
        return (
            <div key={index} className="left action btn-group">
                <a type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="highlight-on-hover" href="#share">Share</a>
                <ul className="dropdown-menu">
                    <li><a className="social-btn" data-platform="Facebook" data-url={article.url} data-ucid={article.ucid} data-platform-url><i className="fa fa-facebook"></i> Facebook</a></li>
                    <li><a className="social-btn" data-platform="Twitter" data-url={article.url} data-ucid={article.ucid} data-platform-url><i className="fa fa-twitter"></i> Twitter</a></li>
                    <li><a className="social-btn" data-platform="Tumblr" data-url={article.url} data-description={article.description} data-title={article.title} data-ucid={article.ucid} data-platform-url><i className="fa fa-tumblr"></i> Tumblr</a></li>
                    <li><a className="social-btn" data-platform="Pinterest" data-url={article.url} data-image={article.image} data-description={article.description} data-ucid={article.ucid} data-platform-url><i className="fa fa-pinterest"></i> Pinterest</a></li>
                    <li><a className="social-btn" data-platform="Google +" data-url={article.url} data-ucid={article.ucid} data-platform-url><i className="fa fa-google-plus"></i> Google+</a></li>
                </ul>
            </div>
        );
    }
    
}

const Buttons = {
    RELATED: 'Related',
    SHARE: 'Share'
};

export {
    Article,
    Buttons
};
