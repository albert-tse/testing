import React from 'react';
import { compose, pure, setPropTypes, withHandlers, withState } from 'recompose';
import PropTypes from 'prop-types';
import defer from 'lodash/defer';

import ShareDialogActions from '../../actions/ShareDialog.action';

import QueueItem from './QueueItem.component';
import History from '../../history';
import Config from '../../config';

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
        navigateToContent
    }),
    pure
)(QueueItem);

function getInitialState(props) {
    return {
        fadeIn: false,
        fadeOut: false,
        showTooltip: props.showTooltip
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
    return function showTooltipCall() {
        if(state.showTooltip){
            //Make sure there aren't any pending fadeOut animations
            clearTimeout(state.fadeOutTimeout);

            //Fade in after 300 miliseconds. This way, the window doesn't pop up if the mouse is just passing over the object
            setState({
                ...state,
                fadeInTimeout: setTimeout(function(){
                    setState({
                        ...state,
                        fadeIn: true,
                        fadeOut: false
                    });
                }, 300)
            });
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
                setState({
                    ...state,
                    fadeIn: false,
                    fadeOut: true,
                    //At the end of the animation clear all animation classes. This makes sure the object is set to display:none;
                    fadeOutTimeout: setTimeout(function(){
                        setState({
                            ...state,
                            fadeIn: false,
                            fadeOut: false
                        });
                    }, 500)
                });
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
