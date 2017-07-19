import React from 'react';
import { findIndex } from 'lodash';
import { compose, pure, withHandlers } from 'recompose';
import { Avatar, List, ListItem } from 'react-toolbox';
import classnames from 'classnames';

import { dimmed } from '../common';
import Styles from './styles';

/**
 * Influencer Selector
 * Allows user to select one influencer at a time
 * @param {object} props contain properties from given store, and available actions to dispatch
 * @parm {array} props.influencers to select from
 * @param {boolean} isPinned determines whether this should be on the sidebar or not
 * @param {function} selectInfluencer is called when a new influencer is selected
 * @param {object|null} selectedInfluencer determines whether an influencer should be marked selected or not
 * @return {React.Component}
 */
function InfluencerSelector({
    influencers,
    isPinned,
    selectInfluencer,
    selectedInfluencer
}) {
    if (Array.isArray(influencers) && influencers.length > 0) {
        return (
            <List selectable className={classnames(isPinned && Styles.pinned, Styles.scrollable)}>
                {influencers.map(function(influencer) {
                    return (
                        <ListItem
                            avatar={influencer.fb_profile_image || <DefaultAvatar title={influencer.name} selected={influencer.id === selectedInfluencer.id} /> }
                            key={influencer.id}
                            caption={influencer.name}
                            className={influencer.id !== selectedInfluencer.id ? dimmed : Styles.selected}
                            onClick={evt => selectInfluencer(influencer)}
                        />
                    );
                })}
            </List>
        );
    } else {
        return <div />
    }
}

/**
 * If influencer doesn't have profile image, show a default Avatar
 * @param {object} props is immediately destructured in arguments
 * @param {string} title is going to be the first character of influencer's name
 * @param {boolean} selected determines whether it should be dimmed or highlighted
 * @return {React.Component}
 */
function DefaultAvatar({
    title,
    selected
}) {
    return (
        <Avatar
            title={title}
            style={{
                backgroundColor: selected && '#f34b5c'
            }}
        />
    );
}

/**
 * Dispatches an action to FilterStore passing the newly selected influencer
 * @param {object} props contains actions to dispatch
 * @param {function} props.update is the one we want to dispatch with selected influencer
 * @return {function}
 */
function selectInfluencer({ update }) {

    /**
     * This is the callback function that is called from the component
     * @param {object} influencer that was selected
     * @return {function}
     */
    return function (influencer) {
        update({ selectedInfluencer: influencer });
    };
}

export default compose(
    withHandlers({
        selectInfluencer: selectInfluencer,
    }),
    pure
)(InfluencerSelector);
