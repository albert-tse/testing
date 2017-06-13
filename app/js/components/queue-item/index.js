import React from 'react';
import { compose, pure, setPropTypes, withHandlers, withState } from 'recompose';
import PropTypes from 'prop-types';
import defer from 'lodash/defer';

import ShareDialogActions from '../../actions/ShareDialog.action';

import QueueItem from './QueueItem.component';
import History from '../../history';
import Config from '../../config';

import Styles from './styles';

/**
 * This is where business logic for Queue Item should go
 * @return {React.Component}
 */
export default compose(
    setPropTypes({
        // define what type of properties this component should have
    }),
    withState('state', 'setState', getInitialState),
    withHandlers({
        deleteScheduledLink, // original function is curried with component props passed as first argument
        editScheduledLink,
        showTooltip,
        hideTooltip,
        shareNowScheduledLink,
        navigateToContent,
        updateScheduledDate: updateScheduledDateHandler
    }),
    pure
)(QueueItem);

function getInitialState(props) {
    return {
        fadeIn: false,
        fadeOut: false,
        showTooltip: props.showTooltip || props.mini
    }
}

// TODO
function deleteScheduledLink(componentProps) {
    return function deleteScheduledLinkCall(link, evt) {
        evt.stopPropagation();
    }
}

// TODO
function editScheduledLink(props) {
    return function editScheduledLink(link, evt) {
        evt.stopPropagation();

        let article = {
            ucid: link.ucid,
            image: link.articleImage,
            title: link.articleTitle,
            description: link.articleDescription,
            site_name: link.siteName
        };

        defer(ShareDialogActions.edit, { article, link });
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
            var top = queueTop - tooltipHeight - 15;
            var left = queueLeft + queueWidth/2 - tooltipWidth/2;

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
                top = queueTop + queueHeight + 15;
            }

            //Make sure there aren't any pending fadeOut animations
            clearTimeout(state.fadeOutTimeout);

            //Fade in after 300 miliseconds. This way, the window doesn't pop up if the mouse is just passing over the object
            state.tooltipLeft = left;
            state.tooltipTop = top;





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
                //Trigger the fade out animation
                state.fadeIn = false;
                state.fadeOut = true;
                state.fadeOutTimeout = setTimeout(function(){
                    setState({
                        ...state,
                        fadeIn: false,
                        fadeOut: false
                    });
                }, 500);

                setState(state);
            }
        }
    }
}

// TODO
function shareNowScheduledLink(props) {
    return function shareNowScheduledLinkCall(link, evt) {
        evt.stopPropagation();
    }
}

function navigateToContent() {
    return function navigateToContentCall() {
        History.push(Config.routes.explore);
    }
}

function updateScheduledDateHandler(props) {
    return function updateScheduledDateAtTimeslot(timeslotObject) {
        return function updateScheduledDate(evt) {
            ShareDialogActions.updateScheduledDate({ selectedDate: timeslotObject.toDate() });
        }
    }
}
