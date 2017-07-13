import React from 'react';
import ArticleModal from '../articleModal';
import EditArticleDialog from './EditArticleDialog.component';
import ShareDialog from './ShareDialog.component';

const FULLSCREEN_CLASSNAME = 'fullscreen';

export default class ArticleDialogs extends React.PureComponent {

    componentDidMount() {
        if (document) {
            this.props.fullscreen && document.body.classList.add(FULLSCREEN_CLASSNAME);
        }
    }

    componentWillUnmount() {
        if (document) {
            document.body.classList.remove(FULLSCREEN_CLASSNAME);
        }
    }

    render() {
        return (
            <div>
                <ShareDialog />
                <ArticleModal
                    article={this.props.previewArticle}
                    visible={!!this.props.previewArticle}
                    hide={this.props.resetPreviewArticle}
                />
                <EditArticleDialog />
            </div>
        );
    }
}
