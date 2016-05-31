import React, { Component } from 'react';
import { IconButton } from 'react-toolbox';
import AltContainer from 'alt-container';
import ListStore from '../../../stores/List.store';

export default class SaveButton extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={IconButton}
                stores={{
                    primary: props => ({
                        store: ListStore,
                        value: !ListStore.isSaved(this.props.ucid)
                    }),
                    accent: props => ({
                        store: ListStore,
                        value: ListStore.isSaved(this.props.ucid)
                    })
                }}
                inject={{
                    icon: 'bookmark'
                }}
            />
        );
    }
}
