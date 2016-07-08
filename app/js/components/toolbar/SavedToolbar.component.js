import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Toolbars } from '../toolbar';
import FilterStore from '../../stores/Filter.store';

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
                component={ props => props.ucids.length > 0 ? <Toolbars.Selection /> : false }
            />
        );
    }
}
