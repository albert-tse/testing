import React from 'react';
import { compose, pure, setPropTypes, withHandlers, withState } from 'recompose';
import PropTypes from 'prop-types';

import QueueItem from './QueueItem.component';

/**
 * This is where business logic for Queue Item should go
 * @return {React.Component}
 */
export default compose(
    setPropTypes({
    }),
    withState('state', 'setState', getInitialState()),
    withHandlers({
        deleteScheduledLink // original function is curried with component props passed as first argument
    }),
    pure
)(QueueItem);

function getInitialState() {
    return {
        fadeIn: false,
        fadeOut: false,
        showTooltip: false
    }
}

// TODO
function deleteScheduledLink(componentProps) {
    return function deleteScheduledLinkCall(link, evt) {
        evt.stopPropagation();
    }
}

// TODO
function editScheduledLink(link, evt) {

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

function showTooltip(){
    if(this.state.showTooltip){
        const comp = this;

        //Make sure there aren't any pending fadeOut animations
        clearTimeout(this.state.fadeOutTimeout);

        //Fade in after 300 miliseconds. This way, the window doesn't pop up if the mouse is just passing over the object
        this.setState({
            fadeInTimeout: setTimeout(function(){
                comp.setState({
                    fadeIn: true,
                    fadeOut: false
                });
            }, 300)
        });
    }
}

function hideTooltip(){
    if(this.state.showTooltip){
        const comp = this;

        //Clear any fade in animations. This makes sure we don't fade in after the mouse has left.
        clearTimeout(this.state.fadeInTimeout);

        //Only fade out, if we are currently faded in
        if(this.state.fadeIn){
            //Trigger the fade out animation
            this.setState({
             fadeIn: false,
                fadeOut: true
            });

            //At the end of the animation clear all animation classes. This makes sure the object is set to display:none;
            this.setState({
                fadeOutTimeout: setTimeout(function(){
                    comp.setState({
                        fadeIn: false,
                        fadeOut: false
                    });
                }, 500)
            });
        }
    }
}

// TODO
function shareNowScheduledLink(link, evt) {
    evt.stopPropagation();
}

function navigateToContent() {
    History.push(Config.routes.explore);
}
