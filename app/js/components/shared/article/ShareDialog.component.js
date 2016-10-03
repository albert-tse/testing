import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dialog, Button } from 'react-toolbox';
import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';
import ArticleStore from '../../../stores/Article.store';
import moment from 'moment';
import Styles from './styles';

export default class ShareDialog extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <AltContainer component={CustomDialog} store={ShareDialogStore} />;
    }
}

class CustomDialog extends Component {

    constructor(props) {
        super(props);
        this.state = { copyLinkLabel };
    }

    render() {
        
        // Placeholder object for when we haven't loaded a link yet
        let article = {
            url: '',
            title: '',
            image: '',
            site_name: '',
            description: '',
            publish_date: ''
        }

        // If we have a link, look up the article by UCID
        if (this.props.link.article) {
            article = ArticleStore.getArticle(this.props.link.ucid);
        }

        // Format the article's publish date
        const publishedDate = article.publish_date ? moment(article.publish_date).fromNow(true) : '';

        return (
            <Dialog
                active={this.props.isActive}
                actions={this.generateActions(this.props.shortlink)}
                className={Styles.shareDialog}
                onOverlayClick={evt => ShareDialogActions.close()}
            >
                <h1>Share this Article</h1>
                <div className={Styles.articleDetail}>
                    <img className={Styles.articleImage} src={article.image} />
                    <p className={Styles.articleDescription}>
                        <em>{article.site_name.toUpperCase()}</em> <span className={Styles.articlePublishDate}>{publishedDate}</span> 
                        <a className={Styles.articleTitle} href={article.url} target="_blank">{article.title}</a>
                        <a className={Styles.shortLink} href={this.props.shortlink} target="_blank">{this.props.shortlink}</a>
                    </p>
                    <br style={{clear:'both'}} />
                </div>
            </Dialog>
        );
    }

    generateActions(shortlink) {
        return [
            {
                icon: "link",
                label: this.state.copyLinkLabel,
                style: { backgroundColor: 'rgb(191,191,191)', color: 'white' },
                onClick: this.copyLink.bind(this, shortlink)
            }, {
                icon: <i className="fa fa-facebook" />,
                label: 'Facebook',
                style: { backgroundColor: 'rgb(59,89,152)', color: 'white' },
                onClick: this.openPlatformDialogTab.bind(this, 'facebook', shortlink)
            }, {
                icon: <i className="fa fa-twitter" />,
                label: 'Twitter',
                style: { backgroundColor: 'rgb(85,172,238)', color: 'white' },
                onClick: this.openPlatformDialogTab.bind(this, 'twitter', shortlink)
            }, {
                icon: 'playlist_add',
                label: 'Buffer',
                style: { backgroundColor: 'black', color: 'white' },
                onClick: this.openPlatformDialogTab.bind(this, 'buffer', shortlink)
            }
        ];
    }

    copyLink(shortlink) {
        let textField = document.createElement('input');
        document.body.appendChild(textField);
        textField.value = shortlink;
        textField.select();
        document.execCommand('copy');
        document.body.removeChild(textField);
        this.setState({ copyLinkLabel: 'Copied!' });
        this.closeDialog();
    }

    openPlatformDialogTab(platform, shortlink) {
        let element = document.createElement('a');
        element.target = '_blank';
        element.href = intentUrls[platform] + shortlink;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        this.closeDialog();
    }

    closeDialog() {
        setTimeout(() => {
            ShareDialogActions.close();
            this.setState({ copyLinkLabel });
        }, 1000);
    }
}

CustomDialog.propTypes = {
    isActive: React.PropTypes.bool.isRequired,
    shortlink: React.PropTypes.string.isRequired,
    link: React.PropTypes.object.isRequired
};

const copyLinkLabel = 'Copy Link';
const intentUrls = {
    twitter: 'https://twitter.com/intent/tweet?url=',
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
    buffer: 'https://buffer.com/add?url='
};
