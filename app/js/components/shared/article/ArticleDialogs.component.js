import React, { Component, PropTypes } from 'react';
import ArticleModal from '../articleModal';
import EditArticleDialog from './EditArticleDialog.component';
import ShareDialog from './ShareDialog.component';
import Overlay from '../Overlay.component';

export default class ArticleDialogs extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Overlay>
                <ShareDialog />
                <ArticleModal
                    article={this.props.previewArticle}
                    visible={!!this.props.previewArticle}
                    hide={this.props.resetPreviewArticle}
                />
                <EditArticleDialog />
            </Overlay>
        );
    }
}
