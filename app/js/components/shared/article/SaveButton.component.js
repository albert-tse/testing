import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import AltContainer from 'alt-container';
import ListStore from '../../../stores/List.store';
import ListActions from '../../../actions/List.action';

export default class SaveButton extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                actions={ props => ({
                    toggleSaved: (ucid, isSaved) => {
                        isSaved ? ListActions.removeFromSavedList([ucid]) : ListActions.addToSavedList([ucid]);
                    }
                })}
                stores={{
                    isSaved: props => ({
                        store: ListStore,
                        value: ListStore.isSaved(this.props.ucid)
                    })
                }}
                render={ props => (
                    <IconButton 
                        icon={props.isSaved ? 'bookmark' : 'bookmark_border'}
                        onMouseUp={props.toggleSaved.bind(this, this.props.ucid, props.isSaved)} 
                        accent={props.isSaved} 
                        primary={!props.isSaved}
                    />
                )}
            />
        );
    }
}
