import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dialog, Button } from 'react-toolbox';
import moment from 'moment';
import { find } from 'lodash';
import classnames from 'classnames';
import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';
import ArticleStore from '../../../stores/Article.store';
import { primaryColor } from '../../common';
import { actionButton, addScheduling, composeFacebookPost, copyLink, dialog, postMessage, shareDialog, shortLink, influencers, influencerSelector, postPreview } from './styles';
import shareDialogStyles from './styles.share-dialog';

import MultiInfluencerSelector from '../../multi-influencer-selector';
import MessageField from '../../message-field';
import PreviewStory from '../../preview-story';

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
        this.updateSelectedPlatforms = this.updateSelectedPlatforms.bind(this);
        this.updateStoryMetadata = this.updateStoryMetadata.bind(this);
        this.state = { 
            copyLinkLabel,
            platforms: [],
            messages: [],
            storyMetadata: {}
        };
        this.Legacy = this.Legacy.bind(this);
    }

    /**
     * Define the component
     * @return {JSX}
     */
    render() {
        const Legacy = this.Legacy;
        let article = null;

        if ('article' in this.props.link) { // TODO: when it is not legacy, this will have to change because link will be null
            article = ArticleStore.getState().articles[this.props.link.article.ucid];
        }

        return (
            <Dialog
                theme={shareDialogStyles}
                active={this.props.isActive}
                onOverlayClick={evt => ShareDialogActions.close()}
            >
                {false ? <Legacy /> : (
                    <div className={shareDialog}>
                        <section className={influencerSelector}>
                            <h2>Share on</h2>
                            <MultiInfluencerSelector onChange={this.updateSelectedPlatforms} />
                        </section>
                        <section className={postMessage}>
                            <MessageField platform="Twitter" onChange={this.updateMessages} />
                            <div className={composeFacebookPost}>
                                <MessageField platform="Facebook" onChange={this.updateMessages} />
                                {!!article && 
                                <PreviewStory 
                                    image={article.image}
                                    title={article.title}
                                    description={article.description}
                                    siteName={article.site_name}
                                    onChange={this.updateStoryMetadata}
                                />}
                            </div>
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

        this.setState({
            messages: [ ...messagesExcludingUpdatedPlatform, message ]
        });
    }

    /**
     * Update the story's title and/or description when sharing to Facebook
     * @param {Object} storyMetadata containing image, title, description, and site name
     */
    updateStoryMetadata(metadata) {
        this.setState({ storyMetadata: metadata }, _ => console.log(this.state));
    }

    /**
     * Update selected platforms
     * @param {Array} platforms that were selected
     */
    updateSelectedPlatforms(platforms) {
        this.setState({ platforms });
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
