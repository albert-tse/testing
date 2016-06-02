import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../stores/Filter.store';
import { FontIcon, IconButton, Navigation } from 'react-toolbox';
import Toolbar from './Toolbar.component';
import Keywords from './toolbar_components/Keywords.component';
import ArticleSorter from './toolbar_components/ArticleSorter.component';
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
        return ( < AltContainer render = {
                props => (
                    <Toolbar>
                        <strong className="title">{ this.props.title ? this.props.title : ''}</strong>
                        <div className={Styles.actionsContainer}>
                            <Keywords />
                            <FontIcon value="sort" />
                            <ArticleSorter />
                            <IconButton icon="event" />
                        </div>
                    </Toolbar>
                )
            }
            />
        );
    }
}

FilterToolbar.defaultProps = {
    title: 'Explore'
};
