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

    // TODO add setting action to replace current article with editingArticle data via Source
    // TODO reset on cancel
    // onBlur={evt => console.log(/^\?([\w-]+(=[\w-]*)?(&[\w-]+(=[\w-]*)?)*)?$/.test(this.state.name)
    
    render() {
        return (
            <Dialog
                active={this.props.editingArticle}
                title="Edit Article"
                actions={[
                    { label: 'Cancel', primary: true, onClick: evt => this.clearEditingArticle() },
                    { label: 'Update', raised: true, primary: true, onClick: evt => {
                        // save whatever is the state of the utm
                        this.clearEditingArticle();
                    }}
                ]}
            >
                <Input label="Custom UTM" value={this.props.editingArticle ? this.props.editingArticle.utm : ''} onChange={val => ArticleActions.editUTM(val) } />
            </Dialog>
        );
    }

    clearEditingArticle() {
        ArticleActions.edit(null);
    }
}
