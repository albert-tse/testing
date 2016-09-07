import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Toolbars } from '../toolbar';
import FilterStore from '../../stores/Filter.store';
import ListStore from '../../stores/List.store';

export default class SavedToolbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                store={FilterStore}
                shouldComponentUpdate={ (prevProps, container, nextProps) => {
                    var changeToSelectionMode = prevProps.ucids.length === 0 && nextProps.ucids.length === 1;
                    var changeToFilterMode = prevProps.ucids.length > 0 && nextProps.ucids.length === 0;
                    return changeToSelectionMode || changeToFilterMode;
                }}
                component={ props => {
                    const List = ListStore.getState();
                    const savedListId = List.specialLists.saved;
                    const savedList = List.lists[savedListId];

                    if (savedList && savedList.articles.length > 0) {
                        return props.ucids && props.ucids.length > 0 ? <Toolbars.Selection /> : <Toolbars.Saved />;
                    } else {
                        return <div />
                    }
                }}
            />
        );
    }
}
