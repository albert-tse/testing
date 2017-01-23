import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dialog, Button } from 'react-toolbox';
import moment from 'moment';
import classnames from 'classnames';
import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';
import ArticleStore from '../../../stores/Article.store';
import { primaryColor } from '../../common';
import { actionButton, addScheduling, copyLink, shareDialog, shortLink, influencers, postPreview } from './styles';

import MultiInfluencerSelector from '../../MultiInfluencerSelector';

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
        this.Legacy = this.Legacy.bind(this);
    }

    render() {
        const Legacy = this.Legacy;

        return (
            <Dialog
                active={this.props.isActive}
                onOverlayClick={evt => ShareDialogActions.close()}
            >
                {false ? <Legacy /> : (
                    <div className={shareDialog}>
                        <h2>Share on</h2>
                        <MultiInfluencerSelector />
                    </div>
                )}
            </Dialog>
        );
    }

    Legacy() {
        return (
            <div className={shareDialog}>
                <div className={addScheduling}>
                    <h2>Want to schedule your post?</h2>
                    <Button accent raised label="Enable Scheduling" />
                </div>
                <footer className={copyLink}>
                    <input ref={shortlink => this.shortlink = shortlink} className={shortLink} value={this.props.shortlink} />
                    <div>
                        {this.generateActions(this.props.shortlink).map(props => <Button {...props} />)}
                    </div>
                </footer>
            </div>
        );
    }

    generateActions(shortlink) {
        return [
            {
                icon: <i className={classnames('fa', 'fa-facebook', actionButton)} style={{ backgroundColor: 'rgb(59,89,152)' }} />,
                label: 'Share on Facebook',
                onClick: this.openPlatformDialogTab.bind(this, 'facebook', shortlink)
            }, {
                icon: <i className={classnames('fa', 'fa-twitter', actionButton)} style={{ backgroundColor: 'rgb(85,172,238)' }} />,
                label: 'Share on Twitter',
                onClick: this.openPlatformDialogTab.bind(this, 'twitter', shortlink)
            }, {
                icon: 'link',
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

const intentUrls = {
    twitter: 'https://twitter.com/intent/tweet?url=',
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
};
