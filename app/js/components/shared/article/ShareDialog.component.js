import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dialog, Button, IconButton } from 'react-toolbox';
import moment from 'moment';
import { find, uniqBy } from 'lodash';
import classnames from 'classnames';

import calendarFactory from 'react-toolbox/lib/date_picker/Calendar';
import calendarTheme from 'react-toolbox/lib/date_picker/theme';

import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';
import ArticleStore from '../../../stores/Article.store';

import Legacy from './LegacyShareDialog.component';
import MultiInfluencerSelector from '../../multi-influencer-selector';
import MessageField from '../../message-field';
import PreviewStory from '../../preview-story';

import { primaryColor } from '../../common';
import { actions, composeFacebookPost, composeTwitterPost, postMessage, scheduler, shareDialog, influencerSelector, warning } from './styles.share-dialog';
import shareDialogStyles from './styles.share-dialog';

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
        this.closeDialog = this.closeDialog.bind(this);
        this.state = { 
            scheduling: true,
            platforms: [],
            messages: [],
            storyMetadata: {},

            selectedDate: new Date()
        };
    }

    /**
     * Define the component
     * @return {JSX}
     */
    render() {
        let article = null;
        const selectedPlatformTypes = uniqBy(this.state.platforms.map(p => p.type.toLowerCase()));
        const platformMessages = selectedPlatformTypes.filter(type => 
            find(this.state.messages, message => 
                message.platform.toLowerCase() === type && message.message.length > 0
            )
        );
        const allowNext = selectedPlatformTypes.length > 0 && platformMessages.length === selectedPlatformTypes.length;

        if ('article' in this.props.link) { // TODO: when it is not legacy, this will have to change because link will be null
            article = ArticleStore.getState().articles[this.props.link.article.ucid];
        }

        return (
            <Dialog
                theme={shareDialogStyles}
                className={classnames(this.state.scheduling && shareDialogStyles.scheduling)}
                active={this.props.isActive}
                onOverlayClick={evt => ShareDialogActions.close()}
            >
                {false ? <Legacy shortlink={this.props.shortlink} /> : (
                    <div className={shareDialog}>
                        <section className={influencerSelector}>
                            <h2>Share on</h2>
                            <MultiInfluencerSelector influencers={availableInfluencers} onChange={this.updateSelectedPlatforms} />
                        </section>
                        <section className={postMessage}>
                            {selectedPlatformTypes.indexOf('twitter') >= 0 && (
                                <div className={composeTwitterPost}>
                                    <MessageField platform="Twitter" onChange={this.updateMessages} />
                                </div>
                            )}

                            {selectedPlatformTypes.indexOf('facebook') >= 0 && (
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
                            )}

                            {selectedPlatformTypes.length < 1 && (
                                <h2 className={warning}><i className="material-icons">arrow_back</i> Choose a platform to share on</h2>
                            )}

                            {selectedPlatformTypes.length > 0 && (
                                <footer className={actions}>
                                    <Button accent raised label="Next" disabled={!allowNext} />
                                    <Button label="Close" onClick={this.closeDialog.bind(this, true)} />
                                </footer>
                            )}
                        </section>
                        <section className={scheduler}>
                            <h2>Place a date picker and timepicker here</h2>
                            <Calendar selectedDate={this.state.selectedDate} theme={calendarTheme} onChange={value => this.setState({ selectedDate: value })} />
                        </section>
                    </div>
                )}
            </Dialog>
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
        this.setState({ storyMetadata: metadata });
    }

    /**
     * Update selected platforms
     * @param {Array} platforms that were selected
     */
    updateSelectedPlatforms(platforms) {
        this.setState({ 
            platforms,
        }, () => {
        });
    }

    /**
     * Closes the share dialog
     */
    closeDialog(closeImmediately) {
        setTimeout(() => {
            ShareDialogActions.close();
            this.setState({ copyLinkLabel });
        }, closeImmediately ? 0 : 1000);
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

// TODO: This should eventually be in a store when connected to backend
const availableInfluencers = [
    {
        id: 3,
        name: 'TSE Influencers',
        platforms: [
            {
                id: 1,
                avatar: 'https://graph.facebook.com/georgehtakei/picture?height=180&width=180',
                name: 'George Takei',
                type: 'Facebook',
                selected: true
            }, {
                id: 2,
                avatar: 'https://graph.facebook.com/Ashton/picture?height=180&width=180',
                name: '@georgehtakei',
                type: 'Twitter'
            }
        ]
    }, {
        id: 4,
        name: 'Brad Takei',
        platforms: [
            {
                id: 10,
                avatar: 'https://graph.facebook.com/bradandgeorge/picture?height=180&width=180',
                name: 'Brad Takei',
                type: 'Facebook'
            }
        ]
    }
]

const Calendar = calendarFactory(IconButton);

