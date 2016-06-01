import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../stores/Filter.store';
import { IconButton, Navigation } from 'react-toolbox';
import Toolbar from './Toolbar.component';
import Keywords from './toolbar_components/Keywords.component';
import Styles from './styles.toolbar';

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
                        <div className={Styles.actionsContainer}>
                            <Keywords />
                            <IconButton icon="sort_by_alpha" />
                            <IconButton icon="event" />
                        </div>
                    </Toolbar>
                )}
            />
        );
    }
}

FilterToolbar.defaultProps = {
    title: 'Explore'
};
