import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dialog, Button } from 'react-toolbox';
import moment from 'moment';
import { debounce, find, map, orderBy, uniqBy, uniq } from 'lodash';
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
import { actions, composeFacebookPost, composeTwitterPost, postMessage, shareDialog, influencerSelector, noOverflow, warning } from './styles.share-dialog';
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
                stores={[UserStore, ShareDialogStore, ProfileStore]}
                transform={props => {
                    let { influencers, isSchedulingEnabled } = UserStore.getState().user;
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
                        profiles: profiles,
                        influencers,
                        isSchedulingEnabled: UserStore.getState().isSchedulingEnabled,
                        hasConnectedProfiles: UserStore.getState().hasConnectedProfiles,
                        schedule: ShareDialogActions.schedule,
                        deschedule: ShareDialogActions.deschedule,
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
        this.removeSchedule = this.removeSchedule.bind(this);
        this.schedule = this.props.schedule;
        this.deschedule = this.props.deschedule;
        this.updateProfiles = this.props.updateProfiles;
        this.delayedSetState = debounce(this.setState.bind(this), 500, { leading: true });
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
     * @param {Object} nextProps contain the new properties of the component
     */
    componentWillReceiveProps(nextProps) {
        if ( (this.props.isActive && !nextProps.isActive) ||
            (this.props.profiles.length > 0 && nextProps.profiles.length < 1) ||
            (this.props.profiles.length < 1 && nextProps.profiles.length > 0) ||
            (this.props.isActive && !nextProps.isActive)
        ) {
            this.resetState();
        } else {
            const selectedProfiles = nextProps.profiles.filter(p => p.selected);
            this.setState({
                profiles: nextProps.profiles.filter(p => p.selected)
            });
        }
    }

    componentDidUpdate(previousProps) {
        // Toggle listening to focus
        if (window && !previousProps.isActive && this.props.isActive && this.props.isSchedulingEnabled) {
            window.addEventListener('focus', ProfileActions.loadProfiles);
        } else if (window && previousProps.isActive && !this.props.isActive) {
            window.removeEventListener('focus', ProfileActions.loadProfiles);
        }
    }

    /**
     * Define the component
     * @return {JSX}
     */
    render() {
        this.processProps();
        const { selectedPlatformTypes, platformMessages, allowNext } = this;
        const { article, hasConnectedProfiles, isSchedulingEnabled, isEditing, link, profiles } = this.props;
        const showLegacyDialog = !isSchedulingEnabled || (isSchedulingEnabled && !hasConnectedProfiles);

        let previewData = article;
        let messageValue = '';
        let selectedProfile = null;
        
        // If we're editing a scheduled post, use the scheduled post data for the preview, otherwise we will default to the article data
        if (isEditing) {
            previewData.image = link.attachmentImage || previewData.image;
            previewData.title = link.attachmentTitle || previewData.title;
            previewData.description = link.attachmentDescription || previewData.description;

            // Get the user-entered message for this scheduled post
            messageValue = link.postMessage;

            selectedProfile = link.profileId;

            this.state.selectedDate = moment.utc(link.scheduledTime).toDate();
        }

        return (
            <Dialog
                theme={shareDialogStyles}
                className={classnames(this.state.scheduling && shareDialogStyles.scheduling)}
                active={this.props.isActive}
                onOverlayClick={evt => ShareDialogActions.close()}
            >
                {showLegacyDialog ? <Legacy showCTAToAddProfiles={isSchedulingEnabled} shortlink={this.props.shortlink} /> : (
                    <div ref={c => this.dialog = c} className={shareDialog}>
                        <section className={influencerSelector}>
                            <div className={noOverflow}>
                                <h2>Share on</h2>
                                <MultiInfluencerSelector
                                    influencers={this.props.influencers}
                                    selectedProfile={selectedProfile}
                                    onChange={this.updateSelectedProfiles}
                                />
                            </div>
                        </section>
                        <section className={postMessage}>
                            {selectedPlatformTypes.indexOf('twitter') >= 0 && (
                                <div className={composeTwitterPost}>
                                    <MessageField value={messageValue} platform="Twitter" onChange={this.updateMessages} />
                                </div>
                            )}

                            {selectedPlatformTypes.indexOf('facebook') >= 0 && (
                                <div className={composeFacebookPost}>
                                    <MessageField value={messageValue} platform="Facebook" onChange={this.updateMessages} />
                                    {!!previewData &&
                                    <PreviewStory
                                        image={previewData.image}
                                        title={previewData.title}
                                        description={previewData.description}
                                        siteName={previewData.site_name}
                                        onChange={this.updateStoryMetadata}
                                    />}
                                </div>
                            )}

                            {selectedPlatformTypes.length < 1 && (
                                <h2 className={warning}><i className="material-icons">arrow_back</i> Choose a profile to share on</h2>
                            )}

                            {selectedPlatformTypes.length > 0 && !this.state.scheduling  && (
                                <footer className={actions}>
                                    <Button accent raised label={`${isEditing ? 'Re-' : ''}Schedule`} disabled={!allowNext && !isEditing} onClick={this.toggleScheduling} />
                                    <Button label="Post Now" disabled={!allowNext && !isEditing} onClick={this.updateSelectedDate.bind(this, new Date())} />
                                    {isEditing && <Button label="Remove Schedule" onClick={this.removeSchedule} /> }
                                </footer>
                            )}
                        </section>
                        {this.state.scheduling && <DatePicker selectedDate={this.state.selectedDate} onChange={this.updateSelectedDate} />}
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

        Object.assign(this, { allowNext, platformMessages, selectedPlatformTypes });
    }

    /**
     * Reset back to initial state
     * @param {Object} overrides if you want to override any of the properties here, pass it to this object
     */
    resetState(overrides) {
        this.setState({
            scheduling: false,
            messages: [],
            storyMetadata: {},
            profiles: [],
            ...overrides
        });
    }

    /**
     * This is called by one of the message fields on the share dialog
     * passing the platform it's intended to be shared on and the message
     * @param {Object} message to share on a given platform
     */
    updateMessages(message) {
        const messagesExcludingUpdatedPlatform = this.state.messages.filter(m => m.platform !== message.platform);

        this.delayedSetState({
            messages: [ ...messagesExcludingUpdatedPlatform, message ],
        }, () => {
            if (message.message.length < 1) {
                this.delayedSetState({ scheduling: false });
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

        const currentlyActivatedPlatforms = uniq(this.state.profiles.map(profile => profile.platform));
        const platformsToActivate = uniq(selected.map(profile => profile.platform));

        this.setState({ profiles: selected }, () => {
            if (selected.length < 1 || currentlyActivatedPlatforms.length < platformsToActivate.length) {
                this.setState({ scheduling: false });
            }
        });
    }

    /**
     * Update the selected date received from date picker
     * This is called once schedule is confirmed
     * @param {Object} payload contains the selected date and whether or not it should schedule or just update
     */
    updateSelectedDate(payload) {
        if (payload && payload.selectedDate === null || !payload) {
            this.toggleScheduling();
        } else {
            const attachment = this.state.storyMetadata;

            this.setState({ selectedDate: payload.selectedDate }, then => {
                if (payload.schedule) {
                    const requests = this.state.profiles.map(profile => {
                        const { message } = find(this.state.messages, { platform: profile.platform });
                        return {
                            ucid: this.props.article.ucid,
                            influencerId: profile.influencer_id,
                            platformId: profile.platform_id,
                            profileId: profile.id,
                            scheduledTime: moment(payload.selectedDate).utc().format('YYYY-MM-DD HH:mm:ss'),
                            message: message,
                            attachmentTitle: attachment.title,
                            attachmentDescription: attachment.description,
                            attachmentImage: attachment.image,
                            attachmentCaption: attachment.siteName,
                            editPostId: this.props.link ? this.props.link.scheduledPostId : null
                        };
                    });

                    this.schedule(requests);
                }
            });
        }
    }

    removeSchedule() {
        if (this.props.link) {
            this.deschedule({
                editPostId: this.props.link.scheduledPostId
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
