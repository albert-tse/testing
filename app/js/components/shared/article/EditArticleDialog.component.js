import React, { Component } from 'react';
import Container from 'alt-container';
import { Button, Dialog, Input } from 'react-toolbox';

import ArticleStore from '../../../stores/Article.store';
import ArticleActions from '../../../actions/Article.action';

export default class EditArticleDialog extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container
                component={Contained}
                store={ArticleStore}
            />
        );
    }
}

class Contained extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.editingArticle !== nextProps.editingArticle || this.state !== nextState;
    }

    render() {
        return (
            <Dialog
                active={this.props.editingArticle}
                actions={[
                    { label: 'Update', disabled: this.props.editingArticle && this.props.editingArticle.error, raised: true, primary: true, onClick: ArticleActions.update },
                    { label: 'Cancel', primary: true, onClick: ::this.clearEditingArticle }
                ]}
                onOverlayClick={::this.clearEditingArticle}
                onEscKeyDown={::this.clearEditingArticle}
                title="Edit Article"
            >
                <Input 
                    error={this.props.editingArticle && this.props.editingArticle.error}
                    label="Custom UTM" 
                    onChange={val => ArticleActions.editUTM(val)}
                    onBlur={::this.checkForErrors}
                    value={this.props.editingArticle ? this.props.editingArticle.utm : ''} 
                />
            </Dialog>
        );
    }

    clearEditingArticle() {
        ArticleActions.edit(null);
    }

    checkForErrors() {
        const { error, utm } = this.props.editingArticle;
        const isValidUTM = /^\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/.test(utm);

        if (error && isValidUTM) {
            ArticleActions.edit({ ...this.props.editingArticle, error: null });
        } else if (!error && !isValidUTM) {
            ArticleActions.edit({ ...this.props.editingArticle, error: 'That is not a valid UTM code' });
        }
    }
}
