import React, { Component } from 'react';
import AltContainer from 'alt-container';
import FilterStore from '../../stores/Filter.store';
import Toolbar from './Toolbar.component';
import Keywords from './toolbar_components/Keywords.component';
import ArticleSorter from './toolbar_components/ArticleSorter.component';
import DateRangeFilter from './toolbar_components/DateRangeFilter.component';
import TopicFilter from './toolbar_components/TopicFilter.component';
import Styles from './styles';

/**
 * Use this toolbar for pages that display a collection of articles
 * ie. Tom's List or Saved List
 */
export default class FilterToolbar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // Reminder to self: The reason why we're wrapping this in an AltContainer is because
        // we will eventually be listening to a Store that keeps track of selected articles.
        // When articles are selected, we switch over to a different Toolbar component instead of Filter
        return (
            <AltContainer render = {
                props => (
                    <Toolbar>
                        <TopicFilter />
                        <div className={Styles.actionsContainer}>
                            <Keywords />
                            <ArticleSorter />
                            <DateRangeFilter />
                        </div>
                    </Toolbar>
                )
            } />
        );
    }
}
