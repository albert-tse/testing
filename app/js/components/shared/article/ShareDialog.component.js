import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button, IconMenu, MenuItem } from 'react-toolbox';
import moment from 'moment-timezone';
import { chain, debounce, delay, difference, find, map, orderBy, pick, uniqBy, uniq } from 'lodash';
import classnames from 'classnames';

import Config from '../../../config';
import UserStore from '../../../stores/User.store';
import ShareDialogStore from '../../../stores/ShareDialog.store';
import ShareDialogActions from '../../../actions/ShareDialog.action';
import ArticleStore from '../../../stores/Article.store';
import ProfileSelectorStore from '../../../stores/ProfileSelector.store';

import LinkActions from '../../../actions/Link.action';
import ProfileActions from '../../../actions/Profile.action';

import { Dialog } from '../../Dialog.component';
import DatePicker from '../../date-picker';
import Legacy from './LegacyShareDialog.component';
import MultiInfluencerSelector from '../../multi-influencer-selector';
import MessageField from '../../message-field';
import PreviewStory from '../../preview-story';
import SchedulePostButton from '../../../components/SchedulePostButton';

import { primaryColor } from '../../common';
import { actions, composeFacebookPost, composeTwitterPost, flashIt, postMessage, shareDialog, influencerSelector, legacy, noOverflow, warning } from './styles.share-dialog';
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
    static stores = {
        user: UserStore,
        component: ShareDialogStore,
        profileSelector: ProfileSelectorStore
    };

    /**
     * Define the component
     * @return {JSX}
     */
    render() {
        return (
            <AltContainer
                component={ShareDialogComponent}
                stores={ShareDialog.stores}
                actions={{
                    ...pick(ShareDialogActions, 'close', 'deschedule', 'deselectProfile', 'schedule', 'selectProfile', 'updateMessage', 'updateScheduledDate', 'updateStoryMetadata'),
                    ...pick(ProfileActions, 'update'),
                    ...pick(LinkActions, 'generateLink')
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
    updateComponent = (props) => {
        const { user, component, profileSelector } = props;
        const { hasConnectedProfiles } = user;
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
            fullscreen: this.props.fullscreen,
            selectedPlatforms,
            isReadyToPost,
            selectedProfile: selectedProfile || {}
        };
    }

}

class ShareDialogComponent extends React.Component {

    render() {
        const {
            article,
            close,
            deselectProfile,
            deschedule,
            generateLink,
            influencers,
            isActive,
            isEditing,
            isReadyToPost,
            isScheduling,
            messages,
            scheduledDate,
            selectProfile,
            selectedProfile,
            selectedPlatforms,
            schedule,
            shortlink,
            showChange,
            showCTAToAddProfiles,
            updateMessage,
            updateScheduledDate,
            updateStoryMetadata,
            link
        } = this.props;

        var deleteHandler = function(){
            deschedule(link);
            close();
        };

        const postedTime = this.props.postedTime ? moment.tz(this.props.postedTime, selectedProfile.timezone).format('ddd, MMM D, YYYY h:mm a z') : null;

        return (
            <Dialog
                theme={shareDialogStyles}
                active={isActive}
                onOverlayClick={close}
            >
                <div className={shareDialog}>
                    <section className={influencerSelector}>
                        <div className={noOverflow}>
                            <MultiInfluencerSelector locked={isEditing} />
                        </div>
                    </section>
                    {selectedProfile.platformName && (
                        <section className={classnames(postMessage, showChange && flashIt)}>
                            {selectedProfile.platformName === 'Twitter' && (
                                <div className={composeTwitterPost}>
                                    {<MessageField disabled={postedTime} value={messages['twitter'] ? messages['twitter'].message : ''} platform="twitter" onChange={updateMessage} />}
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

                            {selectedProfile.platformName === 'Facebook' && (
                                <div className={composeFacebookPost}>
                                    {<MessageField disabled={postedTime} value={messages['facebook'] ? messages['facebook'].message : ''} platform="facebook" onChange={updateMessage} />}
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
                                {!postedTime ? (
                                    <SchedulePostButton
                                        isEditing={isEditing}
                                        view={(isEditing || !!scheduledDate) && 'schedule'}
                                        disabled={!isReadyToPost}
                                        selectedDate={scheduledDate}
                                        timezone={selectedProfile.timezone}
                                        onSelectedDateUpdated={updateScheduledDate}
                                        onRemoveSchedule={deleteHandler}
                                        onSubmit={schedule}
                                    />
                                ) : (
                                    <p>Posted on {postedTime}</p>
                                )}
                            </footer>
                        </section>
                    )}
                    {/^inf/.test(selectedProfile.id) && selectedProfile.influencer_id >= 0 && (
                        <Legacy
                            ucid={article && article.ucid}
                            generateLink={generateLink}
                            shortlink={shortlink}
                            showCTAToAddProfiles
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
}
