import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button, Dialog, IconMenu, MenuItem } from 'react-toolbox';
import moment from 'moment';
import { chain, debounce, difference, find, map, orderBy, pick, uniqBy, uniq } from 'lodash';
import classnames from 'classnames';

import Config from '../../../config';
import UserStore from '../../../stores/User.store';
import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';
import ArticleStore from '../../../stores/Article.store';
import ProfileSelectorStore from '../../../stores/ProfileSelector.store';

import LinkActions from '../../../actions/Link.action';
import ProfileActions from '../../../actions/Profile.action';

import DatePicker from '../../date-picker';
import Legacy from './LegacyShareDialog.component';
import MultiInfluencerSelector from '../../multi-influencer-selector';
import MessageField from '../../message-field';
import PreviewStory from '../../preview-story';
import SchedulePostButton from '../../../components/SchedulePostButton';

import { primaryColor } from '../../common';
import { actions, composeFacebookPost, composeTwitterPost, postMessage, shareDialog, influencerSelector, legacy, noOverflow, warning } from './styles.share-dialog';
import shareDialogStyles from './styles.share-dialog';

/**
 * Used to share stories to any of the current user's connected profiles
 * Degrades to legacy share dialog if user hasn't connected any profiles yet
 * TODO: we need to add a way to reload profiles when user adds/remove profile on another tab
 */
export default class ShareDialog extends Component {

    /**
     * @property {Object} stores defines which stores to listen to for changes
     */
    stores = {
        user: UserStore,
        component: ShareDialogStore,
        profileSelector: ProfileSelectorStore
    };

    /**
     * Create a container-component that binds to a store which keeps track of what's
     * currently being shared
     * @param {Object} props
     * @return {ShareDialog}
     */
    constructor(props) {
        super(props);
        this.updateComponent = this.updateComponent.bind(this);
    }

    /**
     * Define the component
     * @return {JSX}
     */
    render() {
        return ( <AltContainer component={ShareDialogComponent}
                stores={this.stores}
                actions={{
                    ...pick(ShareDialogActions, 'close', 'deschedule', 'deselectProfile', 'schedule', 'selectProfile', 'updateMessage', 'updateScheduledDate', 'updateStoryMetadata'),
                    ...pick(ProfileActions, 'update')
                }}
                transform={this.updateComponent}
            />
        );
    }

    /**
     * This is called whenever one of the stores this Component is listening to changes
     * @param {Object} props contains the stores the component is listening to for changes
     * @param {Object} props.user User store
     * @param {Object} props.component state of the Share dialog
     */
    updateComponent({ user, component, profileSelector, ...props }) {
        const { hasConnectedProfiles, isSchedulingEnabled } = user;
        const { isEditing, scheduledPost, messages } = component;
        const { selectedProfile } = profileSelector;

        const numMessages = Object.keys(messages).length;
        const selectedPlatforms = (isEditing ? scheduledPost.selectedPlatforms : component.selectedPlatforms) || [];
        const isReadyToPost = (
            numMessages > 0 &&
            selectedPlatforms.length === selectedPlatforms.filter(function (platform) { return platform in messages; }).length
        );

        return {
            ...props,
            ...component,
            ...(isEditing ? scheduledPost : {}), // if we are editing scheduled post, override with scheduled post data from link
            selectedPlatforms,
            isReadyToPost,
            showCTAToAddProfiles: isSchedulingEnabled,
            selectedProfile: selectedProfile || {}
        };
    }

}

function ShareDialogComponent({
    article,
    close,
    deselectProfile,
    deschedule,
    influencers,
    isActive,
    isEditing,
    isReadyToPost,
    isScheduling,
    isSchedulingEnabled,
    messages,
    scheduledDate,
    selectProfile,
    selectedProfile,
    selectedPlatforms,
    schedule,
    shortlink,
    showCTAToAddProfiles,
    updateMessage,
    updateScheduledDate,
    updateStoryMetadata
}) {

    return (
        <Dialog
            theme={shareDialogStyles}
            active={isActive}
            onOverlayClick={close}
        >
            <div className={shareDialog}>
                <section className={influencerSelector}>
                    <div className={noOverflow}>
                        <MultiInfluencerSelector />
                    </div>
                </section>
                {selectedProfile.platformName && (
                    <section className={postMessage}>
                        {selectedProfile.platformName === 'Twitter' && (
                            <div className={composeTwitterPost}>
                                {<MessageField value={messages['twitter'] ? messages['twitter'].message : ''} platform="twitter" onChange={updateMessage} />}
                            </div>
                        )}

                        {selectedProfile.platformName === 'Facebook' && (
                            <div className={composeFacebookPost}>
                                {<MessageField value={messages['facebook'] ? messages['facebook'].message : ''} platform="facebook" onChange={updateMessage} />}
                                {!!article &&
                                <PreviewStory
                                    image={article.image}
                                    title={article.title}
                                    description={article.description}
                                    siteUrl={article.site_url}
                                    onChange={updateStoryMetadata}
                                />}
                            </div>
                        )}

                        <footer className={actions}>
                            <SchedulePostButton
                                isEditing={isEditing}
                                view={(isEditing || !!scheduledDate) && 'schedule'}
                                disabled={!isReadyToPost}
                                selectedDate={scheduledDate}
                                onSelectedDateUpdated={updateScheduledDate}
                                onRemoveSchedule={deschedule}
                                onSubmit={schedule}
                            />
                        </footer>
                    </section>
                )}
                {!selectedProfile.id && selectedProfile.influencer_id >= 0 && (
                    <Legacy
                        ucid={article && article.ucid}
                        generateLink={LinkActions.generateLink}
                        shortlink={shortlink}
                        showCTAToAddProfiles={showCTAToAddProfiles}
                    />
                )}
                {!selectedProfile && (
                    <section className={postMessage}>
                        <h2 className={warning}><i className="material-icons">arrow_back</i> Choose a profile to share on</h2>
                    </section>
                )}
            </div>
        </Dialog>
    );
}
