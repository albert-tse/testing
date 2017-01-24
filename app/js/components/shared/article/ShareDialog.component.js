import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dialog, Button } from 'react-toolbox';
import moment from 'moment';
import classnames from 'classnames';
import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';
import ArticleStore from '../../../stores/Article.store';
import { primaryColor } from '../../common';
import { actionButton, addScheduling, copyLink, postMessage, shareDialog, shortLink, influencers, influencerSelector, postPreview } from './styles';

import MultiInfluencerSelector from '../../MultiInfluencerSelector';
import MessageField from '../../message-field';

/**
 * Used to share stories to any of the current user's connected platforms
 * Degrades to legacy share dialog if user hasn't connected any platforms yet
 */
export default class ShareDialog extends Component {

    /**
     * Create a container-component that binds to a store which keeps track of what's
     * currently being shared
     * @param {Object} props
     * @return {ShareDialog}
     */
    constructor(props) {
        super(props);
    }

    /**
     * Define the component
     * @return {JSX}
     */
    render() {
        return <AltContainer component={CustomDialog} store={ShareDialogStore} />;
    }
}

/**
 * Component that switches between legacy and current share dialogs
 * depending on how many platforms are connected to the user
 */
class CustomDialog extends Component {

    /**
     * Create a share dialog that will be toggled [in]active 
     * @param {Object} props refer to the prop types definition at the bottom
     * @return {CustomDialog}
     */
    constructor(props) {
        super(props);
        this.updateMessages = this.updateMessages.bind(this);
        this.state = { 
            copyLinkLabel,
            messages: [
            ]
        };
        this.Legacy = this.Legacy.bind(this);
    }

    /**
     * Define the component
     * @return {JSX}
     */
    render() {
        const Legacy = this.Legacy;

        return (
            <Dialog
                active={this.props.isActive}
                onOverlayClick={evt => ShareDialogActions.close()}
            >
                {false ? <Legacy /> : (
                    <div className={shareDialog}>
                        <section className={influencerSelector}>
                            <h2>Share on</h2>
                            <MultiInfluencerSelector onChange={selectedPlatforms => console.log(selectedPlatforms)} />
                        </section>
                        <section className={postMessage}>
                            <MessageField platform="Twitter" onChange={this.updateMessages} />
                            <MessageField platform="Facebook" onChange={this.updateMessages} />
                        </section>
                    </div>
                )}
            </Dialog>
        );
    }

    /**
     * Legacy share dialog that lets user
     * share on Facebook, Twitter, or copy the shortlink
     * @return {JSX}
     */
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

    /**
     * This is called by one of the message fields on the share dialog 
     * passing the platform it's intended to be shared on and the message
     * @param {Object} message to share on a given platform
     */
    updateMessages(message) {
        const messagesExcludingUpdatedPlatform = this.state.messages.filter(m => m.platform !== message.platform);
        const newState = {
            ...this.state,
            messages: [ ...messagesExcludingUpdatedPlatform, message ]
        };

        console.log('updateMessages', newState);
        this.setState(newState);
    }

    /**
     * This is used in legacy share dialog
     * Lists out options for sharing: Facebook, Twitter, or copy shortlink
     * @param {String} shortlink that was generated
     * @return {Array}
     */
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

    /**
     * Called when user clicks on "Copy Link"
     * copies the currently generated shortlink to the User's clipboard
     * @param {String} shortlink that was recently generated
     */
    copyLink(shortlink) {
        let textField = document.createElement('input');
        this.shortlink.focus();
        this.shortlink.setSelectionRange(0,999);
        document.execCommand('copy');
        this.shortlink.blur();
        this.setState({ copyLinkLabel: 'Copied!' });
        this.closeDialog();
    }

    /**
     * Opens a new tab leading user to the platform they chose to share on
     * @param {String} platform they chose to share on
     * @param {String} shortlink leading to the full story
     */
    openPlatformDialogTab(platform, shortlink) {
        let element = document.createElement('a');
        element.target = '_blank';
        element.href = intentUrls[platform] + shortlink;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        this.closeDialog();
    }

    /**
     * Closes the share dialog
     */
    closeDialog() {
        setTimeout(() => {
            ShareDialogActions.close();
            this.setState({ copyLinkLabel });
        }, 1000);
    }
}

CustomDialog.propTypes = {
    isActive: React.PropTypes.bool.isRequired,
    shortlink: React.PropTypes.string,
    link: React.PropTypes.object
};

CustomDialog.defaultProps = {
    link: {},
    shortlink: ''
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
