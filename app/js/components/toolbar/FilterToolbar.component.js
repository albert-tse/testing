import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../stores/Filter.store';
import { IconButton, Navigation } from 'react-toolbox';
import Toolbar from './Toolbar.component';

/**
 * Use this toolbar for pages that display a collection of articles
 * ie. Tom's List or Saved List
 */
export default class FilterToolbar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                render={ props => (
                    <Toolbar>
                        <strong className="title">Explore</strong>
                        <Navigation type="horizontal">
                            <IconButton icon="search" />
                            <IconButton icon="sort_by_alpha" />
                            <IconButton icon="event" />
                            <IconButton icon="more_vert" />
                        </Navigation>
                    </Toolbar>
                )}
            />
        );
    }
}

FilterToolbar.defaultProps = {
    title: 'Explore'
};
