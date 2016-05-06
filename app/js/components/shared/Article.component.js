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
                    {::this.renderActions()}
                </div>
            );
        }

        return (
            <div />
        );
    }

    /**
     * Render any call to actions here
     * Actions are passed via children elements
     * The reason we do this is so that we can loosely-couple the logic of specifying which actions to show
     * @return React.DOM
     */
    renderActions() {
        var actions = this.getActionElements();

        // If actions are specified, render
        if (actions.length > 0) {
            return (
                <div className="actions">
                    {actions.map(function (action, index) {
                        return <Action key={index} {...action.props}>{action.props.children}</Action>;
                    })}
                </div>
            );
        }
    }

   /**
    * Get the action elements nested inside the Article component
    * @return Array of action elements
    */
    getActionElements() {
        var actions = [];
        if (Array.isArray(this.props.children)) { // Article has more than just <actions />
            for (var i = this.props.children.length; i > 0; i--) {
                if (this.props.children[i].type === 'actions') {
                    var actionsElement = this.props.children[i];
                    actions = actions.concat(actionsElement.props.children);
                    break;
                }
            }
        } else if ('type' in this.props.children && this.props.children.type === 'actions') { // only one element is nested; it could be <actions />
            var actionElements = this.props.children.props.children;
            actions = actions.concat(Array.isArray(actionElements) ? actionElements : [actionElements]);
        }

        return actions;
    }
    
}

class Action extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var className = [
            'action',
            'position' in this.props && this.props.position
        ].filter(Boolean).join(' ');

        return <div className={ className }>{this.props.children}</div>;
    }
}


export default Article;
