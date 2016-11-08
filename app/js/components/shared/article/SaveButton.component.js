import React, { Component } from 'react';
import { Button as ReactButton, IconButton, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import ListStore from '../../../stores/List.store';
import ListActions from '../../../actions/List.action';
import shallowCompare from 'react-addons-shallow-compare';
import classnames from 'classnames';

class Button extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    render() {
        var { raised, compact, isSaved, isRecentlySaved } = this.props;

        const TooltipButton = Tooltip(compact ? IconButton : ReactButton);
        return (
            <div>
                <TooltipButton
                    icon={isSaved ? 'bookmark' : 'bookmark_border'}
                    label="Save"
                    primary={!raised && !isSaved}
                    accent={!raised && isSaved}
                    className={classnames(
                        isSaved ? 'saved' : 'not_saved',
                        !this.props.raised && isRecentlySaved && 'recent_save'
                    )}
                    raised={raised}
                    ripple={false}
                    onClick={::this.toggleSaved}
                    tooltip={isSaved ? 'Unsave Article' : 'Save Article'}
                />
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
