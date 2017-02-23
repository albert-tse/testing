import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';
import { Button, IconButton, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import { pick } from 'lodash';

import Styles from './styles.action-buttons';

import ArticleStore from '../../../stores/Article.store';
import ArticleActions from '../../../actions/Article.action';

class Contained extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
    	console.log(this.props);

        const props = {
            icon: this.props.article.enabled == 1 ? 'visibility_off' : 'visibility',
            onClick: ::this.toggleArticle,
            label: this.props.article.enabled == 1 ? 'disable' : 'enable'
        };

        return (
            <div>
                <Button className={Styles.normal} {...props} />
                <IconButton className={Styles.icon} {...props} />
            </div>
        );
    }

    toggleArticle(evt) {
    	console.log(this.props.article);
        this.props.toggle({
        	ucid: this.props.ucid,
        	markEnabled: this.props.article.enabled =! 1
        });
    }
}

export default class DisableButton extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={Contained}
                actions={ ArticleActions }
                stores={{
                    article: props => ({
                        store: ArticleStore,
                        value: ArticleStore.getArticle(this.props.ucid)
                    })
                }}
                inject={pick(this.props, 'ucid')}
            />
        );
    }
}
