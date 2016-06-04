import { Toolbars } from '../toolbar';
import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../stores/Filter.store';

export default class ExploreToolbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var { Selection, Filter } = Toolbars;
        return (
            <AltContainer
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
