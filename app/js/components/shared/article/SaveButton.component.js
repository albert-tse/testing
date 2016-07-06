import React, { Component } from 'react';
import { IconButton, Tooltip } from 'react-toolbox';
import AltContainer from 'alt-container';
import ListStore from '../../../stores/List.store';
import ListActions from '../../../actions/List.action';

class Button extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { isSaved } = this.props;

        const TooltipIconButton = Tooltip(IconButton);
        return (
            <TooltipIconButton
                icon={isSaved ? 'bookmark' : 'bookmark_border'}
                accent={isSaved}
                primary={!isSaved}
                ripple={false}
                onClick={::this.toggleSaved}
                tooltip={isSaved ? 'Unsave Article' : 'Save Article'}
            />
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
                    })
                }}
            >
                <Button { ...this.props } />
            </AltContainer>
        );
    }
}
