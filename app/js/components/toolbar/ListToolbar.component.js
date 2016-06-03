import React, { Component } from 'react';
import AltContainer from 'alt-container';
import ListStore from '../../stores/List.store';
import ListActions from '../../actions/List.action';
import { IconButton, Navigation } from 'react-toolbox';
import Toolbar from './Toolbar.component';

/**
 * Use this toolbar for pages that display a collection of articles
 * ie. Tom's List or Saved List
 */
export default class ListToolbar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                render={ props => (
                    <Toolbar>
                        <h1 className="title">{this.props.title}</h1>
                        <Navigation type="horizontal">
                            <IconButton icon="bookmark_border" />
                            <IconButton icon="share" />
                        </Navigation>
                    </Toolbar>
                )}
            />
        );
    }
}

ListToolbar.defaultProps = {
    title: 'Articles'
};
