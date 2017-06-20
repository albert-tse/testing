import React from 'react';
import ArticleModal from '../articleModal';
import EditArticleDialog from './EditArticleDialog.component';
import ShareDialog from './ShareDialog.component';

export default function ArticleDialogs(props) {
    return (
        <div>
            <ShareDialog fullscreen={props.fullscreen} />
            <ArticleModal
                article={props.previewArticle}
                visible={!!props.previewArticle}
                hide={props.resetPreviewArticle}
            />
            <EditArticleDialog />
        </div>
    );
}
