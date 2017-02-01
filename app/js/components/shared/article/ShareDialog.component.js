import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dialog, Button } from 'react-toolbox';
import moment from 'moment';
import { find, map, orderBy, uniqBy } from 'lodash';
import classnames from 'classnames';

import Config from '../../../config';
import UserStore from '../../../stores/User.store';
import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';
import ArticleStore from '../../../stores/Article.store';
import ProfileStore from '../../../stores/Profile.store';
import ProfileActions from '../../../actions/Profile.action';

import Legacy from './LegacyShareDialog.component';
import MultiInfluencerSelector from '../../multi-influencer-selector';
import MessageField from '../../message-field';
import PreviewStory from '../../preview-story';
import DatePicker from '../../date-picker';

import { primaryColor } from '../../common';
import { actions, composeFacebookPost, composeTwitterPost, postMessage, shareDialog, influencerSelector, warning } from './styles.share-dialog';
import shareDialogStyles from './styles.share-dialog';

/**
 * Used to share stories to any of the current user's connected profiles
 * Degrades to legacy share dialog if user hasn't connected any profiles yet
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
        return (
            <AltContainer
                component={CustomDialog}
                stores={[ShareDialogStore, ProfileStore]}
                transform={props => {
                    let { influencers, enableScheduling } = UserStore.getState().user;
                    let { profiles } = ProfileStore.getState(); 

                    influencers = influencers.map((inf, index) => {
                        let influencerProfiles = profiles.filter(p => p.influencer_id === inf.id); // only get profiles assigned to current influencer
                        influencerProfiles = influencerProfiles.map(p => ({ ...p, platform: Config.platforms[p.platform_id.toString()].name })); // add platform name
                        influencerProfiles = orderBy(influencerProfiles, 'id'); // sort by id

                        return {
                            ...inf,
                            isFirst: index === 0,
                            profiles: influencerProfiles
                        };
                    });

                    return {
                        ...ShareDialogStore.getState(),
                        profiles,
                        influencers,
                        enableScheduling: UserStore.getState().enableScheduling,
                        schedule: ShareDialogActions.schedule,
                        updateProfiles: ProfileActions.update
                    };
                }}
            />
        );
    }
}

/**
 * Component that switches between legacy and current share dialogs
 * depending on how many profiles are connected to the user
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
        this.updateSelectedProfiles = this.updateSelectedProfiles.bind(this);
        this.updateStoryMetadata = this.updateStoryMetadata.bind(this);
        this.updateSelectedDate = this.updateSelectedDate.bind(this);
        this.toggleScheduling = this.toggleScheduling.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.schedule = this.props.schedule;
        this.updateProfiles = this.props.updateProfiles;
        this.state = {
            scheduling: false,
            profiles: [],
            messages: [],
            storyMetadata: {},
            selectedDate: new Date()
        };
    }

    /**
     * Load user's connected profiles
     */
    componentWillMount() {
        ProfileActions.loadProfiles();
    }

    /**
     * This gets called when parent element changes one of the properties
     * @param {Object} prevProps contains the props it once had, which has been replaced with new values at this.props
     */
    componentDidUpdate(prevProps) {
        if (prevProps.isActive && !this.props.isActive) {
            this.resetState();
        }
    }

    /**
     * Define the component
     * @return {JSX}
     */
    render() {
        this.processProps();
        const { selectedPlatformTypes, platformMessages, allowNext } = this;
        const { article, enableScheduling } = this.props;

        return (
            <Dialog
                theme={shareDialogStyles}
                className={classnames(this.state.scheduling && shareDialogStyles.scheduling)}
                active={this.props.isActive}
                onOverlayClick={evt => ShareDialogActions.close()}
            >
                {!enableScheduling ? <Legacy shortlink={this.props.shortlink} /> : (
                    <div className={shareDialog}>
                        <section className={influencerSelector}>
                            <h2>Share on</h2>
                            <MultiInfluencerSelector influencers={this.props.influencers} onChange={this.updateSelectedProfiles} />
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
                                <h2 className={warning}><i className="material-icons">arrow_back</i> Choose a profile to share on</h2>
                            )}

                            {selectedPlatformTypes.length > 0 && !this.state.scheduling  && (
                                <footer className={actions}>
                                    <Button accent raised label="Schedule" disabled={!allowNext} onClick={this.toggleScheduling} />
                                    <Button label="Post Now" disabled={!allowNext} onClick={this.updateSelectedDate.bind(this, new Date())} />
                                </footer>
                            )}
                        </section>
                        {this.state.scheduling && <DatePicker onChange={this.updateSelectedDate} />}
                    </div>
                )}
            </Dialog>
        );
    }

    /**
     * Process some of the fields passed down to props before rendering the component
     */
    processProps() {
        const selectedPlatformTypes = uniqBy(this.state.profiles.map(p => p.platform.toLowerCase()));

        const platformMessages = selectedPlatformTypes.filter(type =>
            find(this.state.messages, message =>
                message.platform.toLowerCase() === type && message.message.length > 0
            )
        );

        const allowNext = selectedPlatformTypes.length > 0 && platformMessages.length === selectedPlatformTypes.length;
        Object.assign(this, { selectedPlatformTypes, platformMessages, allowNext });
    }

    /**
     * Reset back to initial state
     */
    resetState() {
        this.setState({
            scheduling: false,
            messages: [],
            storyMetadata: {},
            selectedDate: new Date()
        });
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
        }, () => {
            if (message.message.length < 1) {
                this.setState({ scheduling: false });
            }
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
     * Update selected profiles
     * @param {Array} selected selected profiles
     * @param {Array} changeedProfiles profiles from an influencer whose profile was toggled
     */
    updateSelectedProfiles(selected, changedProfiles) {
        if (!!changedProfiles) {
            const updatedProfiles = [
                ...this.props.profiles.filter(p => map(changedProfiles, 'id').indexOf(p.id) < 0), // profiles that are not in changedProfiles
                ...changedProfiles
            ];

            this.updateProfiles(updatedProfiles);
        }

        this.setState({ profiles: selected }, () => {
            if (selected.length < 1) {
                this.setState({ scheduling: false });
            }
        });
    }

    /**
     * Update the selected date received from date picker
     * This is called once schedule is confirmed
     * @param {Date} selectedDate that user chose and confirmed from the date picker component
     */
    updateSelectedDate(selectedDate) {
        if (selectedDate === null) {
            this.toggleScheduling();
        } else {
            const attachment = this.state.storyMetadata;

            this.setState({ selectedDate }, then => {
                const requests = this.state.profiles.map(profile => {
                    const { message } = find(this.state.messages, { platform: profile.platform });
                    return {
                        ucid: this.props.article.ucid,
                        influencerId: profile.influencer_id,
                        platformId: profile.platform_id,
                        profileId: profile.id,
                        scheduledTime: moment(this.state.selectedDate).utc().format('YYYY-MM-DD HH:mm:ss'),
                        message: message,
                        attachmentTitle: attachment.title,
                        attachmentDescription: attachment.description,
                        attachmentImage: attachment.image,
                        attachmentCaption: attachment.siteName
                    };
                });

                this.schedule(requests);
            });
        }
    }

    /**
     * Show the scheduler once user enters a valid platform and message
     */
    toggleScheduling() {
        this.setState({ scheduling: !this.state.scheduling });
    }

    /**
     * Closes the share dialog
     */
    closeDialog(closeImmediately) {
        setTimeout(() => {
            ShareDialogActions.close();
        }, closeImmediately ? 0 : 1000);
    }
}

CustomDialog.propTypes = {
    isActive: React.PropTypes.bool.isRequired,
    shortlink: React.PropTypes.string,
    article: React.PropTypes.object.isRequired
};

CustomDialog.defaultProps = {
    article: {},
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
