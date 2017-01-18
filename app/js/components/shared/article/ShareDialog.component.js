import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dialog, Button } from 'react-toolbox';
import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';
import ArticleStore from '../../../stores/Article.store';
import moment from 'moment';
import { primaryColor } from '../../common';
import { copyLink, shareDialog, shortLink, influencers, postPreview } from './styles';

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
        return (
            <Dialog
                active={this.props.isActive}
                onOverlayClick={evt => ShareDialogActions.close()}
            >
                <div className={shareDialog}>
                    {false && (
                        <section className={influencers}>
                            <h2>Share on</h2>
                        </section>
                    )}
                    <section className={postPreview}>
                        <header>
                            <h2>Want to schedule your post?</h2>
                            <Button className={primaryColor} primary label="Enable Scheduling" />
                        </header>
                        <footer className={copyLink}>
                            <input ref={shortlink => this.shortlink = shortlink} className={shortLink} value={this.props.shortlink} />
                            <Button raised accent label="Copy Link" onClick={this.copyLink.bind(this, this.props.shortlink)} />        
                        </footer>
                    </section>
                </div>
            </Dialog>
        );
    }

    generateActions(shortlink) {
        return [
            {
                label: this.state.copyLinkLabel,
                onClick: this.copyLink.bind(this, shortlink)
            }
        ];
    }

    copyLink(shortlink) {
        let textField = document.createElement('input');
        this.shortlink.focus();
        this.shortlink.setSelectionRange(0,999);
        document.execCommand('copy');
        this.shortlink.blur();
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
const defaultArticle = {
    url: '',
    title: '',
    image: '',
    site_name: '',
    description: '',
    publish_date: ''
};

/**
 * TODO: Remove
 *
const intentUrls = {
    twitter: 'https://twitter.com/intent/tweet?url=',
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
    buffer: 'https://buffer.com/add?url='
};
 *
 */
