import React, { Component } from 'react';
import { IconButton, Tooltip } from 'react-toolbox';
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
        var { isSaved, isRecentlySaved } = this.props;

        const TooltipIconButton = Tooltip(IconButton);
        return (
            <div>
                <TooltipIconButton
                    icon={isSaved ? 'bookmark' : 'bookmark_border'}
                    primary={!isSaved}
                    accent={isSaved}
                    className={isSaved ? 'saved' : 'not_saved'}
                    ripple={false}
                    onClick={::this.toggleSaved}
                    tooltip={isSaved ? 'Unsave Article' : 'Save Article'}
                />
                <span 
                    className={isRecentlySaved ? 'recent_save' : 'not_recent_save'}>
                    Saved to My Posts
                </span>
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
