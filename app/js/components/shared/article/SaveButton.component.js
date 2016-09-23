import React, { Component } from 'react';
import { Button as ReactButton, IconButton, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import ListStore from '../../../stores/List.store';
import ListActions from '../../../actions/List.action';
import shallowCompare from 'react-addons-shallow-compare';

class Button extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        var { raised, isSaved, isRecentlySaved } = this.props;

        const TooltipButton = Tooltip(raised ? ReactButton : IconButton);
        return (
            <div>
                <TooltipButton
                    icon={isSaved ? 'bookmark' : 'bookmark_border'}
                    primary={!raised && !isSaved}
                    accent={!raised && isSaved}
                    className={isSaved ? 'saved' : 'not_saved'}
                    raised={raised}
                    ripple={false}
                    onClick={::this.toggleSaved}
                    tooltip={isSaved ? 'Unsave Article' : 'Save Article'}
                />
                {!this.props.raised && 
                    <span 
                        className={isRecentlySaved ? 'recent_save' : 'not_recent_save'}>
                        Saved to My Posts
                    </span>
                }
            </div>
        );
    }

    toggleSaved(evt) {
        var { ucid, isSaved, removeFromSavedList, addToSavedList } = this.props;
        isSaved ? removeFromSavedList([ucid]) : addToSavedList([ucid]);
        return evt.stopPropagation();
    }
}

export default class SaveButton extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                actions={ ListActions }
                stores={{
                    isSaved: props => ({
                        store: ListStore,
                        value: ListStore.isSaved(this.props.ucid)
                    }),
                    isRecentlySaved: props => ({
                        store: ListStore,
                        value: ListStore.isRecentlySaved(this.props.ucid)
                    })
                }}
            >
                <Button { ...this.props } />
            </AltContainer>
        );
    }
}
