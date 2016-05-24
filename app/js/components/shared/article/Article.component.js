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
    }

    render() {
        var article = this.props.data;

        if (article.isLoading) {
            return (<div id={ 'article-' + article.ucid } className="grid-item article articlex highlight-on-hover" data-ucid={article.ucid}>
                    loading....
                </div>);
        } else {
            return (
                <div id={ 'article-' + article.ucid } className="grid-item article articlex highlight-on-hover" data-ucid={article.ucid}>
                    <img className="th" src={article.image} />
                    <div className="metadata">
                        <a className="info highlight-on-hover" ucid={article.ucid}><i className="fa fa-info-circle fa-lg"></i></a>
                        <time datetime={article.createdAt.format()}>{article.createdAt.fromNow()}</time>
                        <span className="site"> by {article.siteName} rated {article.siteRating}</span>
                    </div>
                    <h1 className="headline highlight-on-hover">{article.title}</h1>
                    <p className="description">{article.description.substr(0,200)}...</p>
                    <div className="actions">
                        {this.props.buttons.map((button, index) => this['render' + button.type](button, article, index))}
                    </div>
                </div>
            );
        }
    }

    /**
     * ~Actions
     * -------------------------------------------------- */
    renderRelated(button, article, index) {
        return (
            <div key={index} className="left action">
                <a className="highlight-on-hover" href={ '/?relatedto=' + article.ucid}>Related</a>
            </div>
        );
    }

    renderShare(button, article, index) {
        var shareOn = (platform) => {
            return function (evt) {
                var linkPayload = _.pick(article, Object.keys(evt.currentTarget.dataset));
                button.action(platform, article, linkPayload);
            };
        };

        return (
            <div key={index} className="right action btn-group">
                { this.renderSaved() }
                <a type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" href="#share">
                    <i className="material-icons">share</i>
                </a>
                <ul className="dropdown-menu">
                    <li><a className="social-btn" onClick={shareOn('facebook')} data-url><i className="fa fa-facebook"></i> Facebook</a></li>
                    <li><a className="social-btn" onClick={shareOn('twitter')} data-url><i className="fa fa-twitter"></i> Twitter</a></li>
                    <li><a className="social-btn" onClick={shareOn('tumblr')} data-url data-description data-title><i className="fa fa-tumblr"></i> Tumblr</a></li>
                    <li><a className="social-btn" onClick={shareOn('pinterest')} data-url data-image data-description><i className="fa fa-pinterest"></i> Pinterest</a></li>
                    <li><a className="social-btn" onClick={shareOn('google')} data-url><i className="fa fa-google-plus"></i> Google+</a></li>
                </ul>
            </div>
        );
    }

    renderSaved(){
        var ucid = this.props.data.ucid;
        var savedState = _.assign({
            show: false
        },this.props.saveButton);
        var component = false;

        var classNames = 'mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon';
        if(savedState.isSaved){
            classNames += ' mdl-button--accent';
        }

        var clickHandler = function(){
            if(savedState.isSaved && savedState.onRemove){
                return function(){
                    savedState.onRemove(ucid);
                }
            }

            if(!savedState.isSaved && savedState.onSave){
                return function(){
                    savedState.onSave(ucid);
                }
            }

            return function(){};
        }

        if(savedState.show){
            component = (
                <a type="button" className={ classNames } onClick={ clickHandler() }>
                    <i className="material-icons">{ savedState.isSaved ? 'bookmark' : 'bookmark_border' }</i>
                </a>
            );
        }

        return component;
    }

    renderMore(button, article, index) {
        return (
            <div key={index} className="right action btn-group">
                <a type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" href="#more">
                    <i className="material-icons">more_vert</i>
                </a>
                <ul className="dropdown-menu">
                    <li class="related hide-publisher-role">
                        <a>Similar Articles</a>
                    </li>
                    <li class="edit-utm highlight-on-hover hide-internal_influencer-role hide-external_influencer-role">
                        <a>Edit</a>
                    </li>
                </ul>
            </div>
        );
    }

}

export const Buttons = {
    RELATED: 'Related',
    SHARE: 'Share',
    MORE: 'More'
};

export default Article;
