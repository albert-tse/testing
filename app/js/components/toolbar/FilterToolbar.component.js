import React, { Component } from 'react';
import AltContainer from 'alt-container';
import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';
import { IconButton, Navigation } from 'react-toolbox';
import Toolbar from './Toolbar.component';
import InfluencerDropdown from './toolbar_components/InfluencerSwitcher.component';

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
                        <h1 className="title">Explore</h1>
                        <Navigation type="horizontal">
                            <IconButton icon="search" />
                            <IconButton icon="filter_list" />
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
