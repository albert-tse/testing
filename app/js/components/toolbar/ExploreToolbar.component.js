import { Toolbars } from '../toolbar';
import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../stores/Filter.store';
import _ from 'lodash';

export default class ExploreToolbar extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        var { Selection, Filter } = Toolbars;
        return (
            <AltContainer
                shouldComponentUpdate={ (prevProps, containerProps, nextProps) => {
                    var changeToSelectionMode = prevProps.selectedArticles.length === 0 && nextProps.selectedArticles.length === 1;
                    var changeToFilterMode = prevProps.selectedArticles.length > 0 && nextProps.selectedArticles.length === 0;
                    var shouldUpdate = changeToSelectionMode || changeToFilterMode;
                    return shouldUpdate;
                }}
                stores={{
                    selectedArticles: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().ucids
                    })
                }}
                component={ props => props.selectedArticles.length > 0 ? <Selection /> : <Filter /> }
            />
        );
    }
}
