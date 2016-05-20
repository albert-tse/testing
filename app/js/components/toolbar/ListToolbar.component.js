import React, { Component } from 'react';
import AltContainer from 'alt-container';
import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';
import { AppBar, IconButton, Navigation } from 'react-toolbox';

export default class ListToolbar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                render={ props => (
                    <AppBar className="space-out">
                        <h1 className="title">Saved</h1>
                        <Navigation type="horizontal">
                            <IconButton icon="bookmark_border" inverse />
                            <IconButton icon="share" inverse />
                        </Navigation>
                    </AppBar>
                )}
            />
        );
    }
}
