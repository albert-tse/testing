import React from 'react';
import connect from 'alt-utils/lib/connect'
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import curry from 'lodash/curry';
import defer from 'lodash/defer';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import {
    compose,
    pure,
    setPropTypes,
    withHandlers,
    withProps,
    withState
} from 'recompose';

import History from '../../history';
import Config from '../../config';

import ArticleStore from '../../stores/Article.store';
import ShareDialogStore from '../../stores/ShareDialog.store';
import ShareDialogActions from '../../actions/ShareDialog.action';

import QueueItem from './QueueItem.component';

import Styles from './styles';

const DATE_TIME_FORMAT = 'YYYY/MM/DD h:mma'

function getInitialState(props) {
    return {
        fadeIn: false,
        fadeOut: false,
        showTooltip: props.showTooltip || props.mini
    }
}

function transform(props) {
    var item = props.item;
    const isScheduledPost = 'scheduledTime' in item;

    if(isScheduledPost){
        props.item.article = {
            image: item.attachmentImage,
            title: item.attachmentTitle,
            description: item.attachmentDescription,
            site_name: item.attachmentCaption,
            site_url: item.attachmentCaption,
            ucid: item.ucid
        };

        props.item.link = {
            id: item.id,
            attachmentTitle: item.attachmentTitle,
            attachmentDescription: item.attachmentDescription,
            attachmentImage: item.attachmentImage,
            influencerId: item.influencerId,
            platformName: Config.platforms[item.platformId].name,
            profileId: item.profileId,
            postMessage: item.message,
            scheduledTime: item.scheduledTime
        };
    }

    return props;
}

// TODO
function deleteScheduledLinkHandler(props) {
    const {article, link} = props.item;
    return function deleteScheduledLinkFactory() {
        return function deleteScheduledLink(evt) {
            evt.stopPropagation();
            defer(ShareDialogActions.deschedule, link);
            // props.onDeleteCall && defer(props.onDeleteCall);
        }
    }
}

function editScheduledLinkHandler(props) {
    const {article, link, postedTime} = props.item;
    return function editScheduledLinkFactory() {
        return function editScheduleLink(evt) {
            evt.stopPropagation();
            !props.isShareDialogOpen && !props.isArticleModalOpen && defer(ShareDialogActions.edit, { article, link, profileId: props.selectedProfile.id, postedTime: postedTime });
        }
    }
}

function showTooltip({
    setState,
    state
}){
    return function showTooltipCall(e) {
        if(state.showTooltip){
            const queueItem = e.currentTarget;
            const queueTop = e.currentTarget.getBoundingClientRect().top;
            const queueLeft = e.currentTarget.getBoundingClientRect().left;
            const queueWidth = e.currentTarget.getBoundingClientRect().width;
            const queueHeight = e.currentTarget.getBoundingClientRect().height;
            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;
            const tooltipWidth = 566;
            const tooltipHeight = 166;
            const arrowWidth = 20;
            var top = queueTop - tooltipHeight - 15;
            var left = queueLeft + queueWidth/2 - tooltipWidth/2;
            var arrowDown = true;

            if(left + tooltipWidth > windowWidth){
                left = windowWidth - tooltipWidth - 15;
            }

            if(left < 0){
                left = 15;
            }

            if(top + tooltipHeight > windowHeight){
                top = windowHeight - tooltipHeight - 15;
            }

            if(top < 0){
                arrowDown = false;
                top = queueTop + queueHeight + 15;
            }

            var arrowLeft = queueLeft - left - arrowWidth/2 + queueWidth/2;

            //Make sure there aren't any pending fadeOut animations
            clearTimeout(state.fadeOutTimeout);

            //Fade in after 300 miliseconds. This way, the window doesn't pop up if the mouse is just passing over the object
            state.tooltipLeft = left;
            state.tooltipTop = top;
            state.arrowDown = arrowDown;
            state.arrowLeft = arrowLeft;

            state.fadeInTimeout = setTimeout(function(){
                setState({
                    ...state,
                    fadeIn: true,
                    fadeOut: false
                });
            }, 300);

            setState(state);
        }
    }
}

function hideTooltip({
    setState,
    state
}){
    return function hideTooltipCall() {
        if(state.showTooltip){
            //Clear any fade in animations. This makes sure we don't fade in after the mouse has left.
            clearTimeout(state.fadeInTimeout);

            //Only fade out, if we are currently faded in
            if(state.fadeIn){
                var s = _.extend({}, state); //We need to remap the objects to trigger a render when we set state
                //Trigger the fade out animation
                var timeout = setTimeout(function(){
                    var s2 = _.extend({}, s);
                    s2.fadeOut = false;
                    setState(s2);
                }, 500);

                s.fadeIn = false;
                s.fadeOut = true;
                s.fadeOutTimeout = timeout;

                setState(s);
            }
        }
    }
}

function shareNowScheduledLinkHandler(props, noop, evt) {
    evt.stopPropagation();
    let payload = pick(props.item,
        'attachmentCaption', 'attachmentDescription', 'attachmentImage',
        'attachmentTitle', 'message', 'influencerId', 'platformId',
        'profileId', 'ucid', 'id');

    payload.partner_id = payload.item.influencerId;
    payload.editPostId = payload.item.id;
    payload.scheduledTime = moment().seconds(0).utc().format();
    ShareDialogActions.shareNow(payload);
}

function navigateToContent() {
    return function navigateToContentCall() {
        History.push(Config.routes.explore);
    }
}

function updateScheduledDateHandler(props, timeslotObject, evt) {
    ShareDialogActions.updateScheduledDate({ selectedDate: timeslotObject.toDate() });
}

function openShareDialogWithTimeslotHandler(props) {
    return function openShareDialogWithTimeslotFactory(timeslotObject) {
        return function openShareDialogWithTimeslot(evt) {
            ShareDialogActions.openShareDialogWithTimeslot(timeslotObject);
        }
    }
}

/**
 * This is where business logic for Queue Item should go
 * @return {React.Component}
 */
export default compose(
    setPropTypes({
        // define what type of properties this component should have
    }),
    connect({
        listenTo() {
            return [ArticleStore, ShareDialogStore]
        },

        reduceProps(props) {
            const { isActive, scheduledDate } = ShareDialogStore.getState()
            const timeslotFormatted = moment(props.item.time).format(DATE_TIME_FORMAT)
            const scheduledDateFormatted = moment.tz(scheduledDate, props.item.time.tz()).format(DATE_TIME_FORMAT)

            return {
                isShareDialogOpen: isActive,
                isArticleModalOpen: ArticleStore.getState().viewing,
                isSelected: timeslotFormatted === scheduledDateFormatted
            }
        }
    }),
    withState('state', 'setState', getInitialState),
    withProps(transform),
    withHandlers({
        deleteScheduledLink: deleteScheduledLinkHandler, // original function is curried with component props passed as first argument
        editScheduledLink: editScheduledLinkHandler,
        hideTooltip,
        openShareDialogWithTimeslot: openShareDialogWithTimeslotHandler,
        showTooltip,
        shareNowScheduledLink: curry(shareNowScheduledLinkHandler),
        navigateToContent,
        updateScheduledDate: curry(updateScheduledDateHandler)
    }),
    pure
)(QueueItem)
