import React from 'react';
import AltContainer from 'alt-container';
import Component from '../shared/List.component';
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'

import { AppBar, IconButton, Navigation } from 'react-toolbox';

class Saved extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        ListActions.getSavedList();
    }

    render() {
        return (
            <AltContainer   listName="saved"
                            actions = { ListActions }
                            stores = {{
                                list: (props) => ({
                                    store: ListStore,
                                    value: ListStore.getSavedList()
                                })
                            }}>
                <AppBar className="space-out">
                    <Navigation type="horizontal">
                        <h1 className="title">Saved</h1>
                    </Navigation>
                    <Navigation type="horizontal">
                        <IconButton icon="bookmark_border" inverse />
                        <IconButton icon="share" inverse />
                    </Navigation>
                </AppBar>
                <Component />
            </AltContainer>
        );
    }
}

export default Saved;
