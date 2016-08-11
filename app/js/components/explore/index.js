import React, { Component } from 'react';
import AltContainer from 'alt-container';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { Button } from 'react-toolbox/lib/button';
import { AppContent, ArticleView } from '../shared';
import { ExploreToolbar } from '../toolbar';
import SearchStore from '../../stores/Search.store';
import SearchActions from '../../actions/Search.action';
import FilterStore from '../../stores/Filter.store'
import Style from './style';
import { defer, isEqual } from 'lodash';

export default class Explore extends Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillMount() {
        SearchActions.getResults();
    }

    render() {
        return (
            <AltContainer
                component={Contained}
                stores={{
                    search: SearchStore, 
                    filters: FilterStore
                }}
            />
        );
    }
}

class Contained extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate({ search, filters }) {
        if (this.props.search.results !== search.results) {
            return true;
        } else {
            if(!isEqual(this.props.filters, filters) && this.props.filters.ucids.length === filters.ucids.length) {
                defer(SearchActions.getResults);
            }
            return false;
        }
    }

    render() {
        return (
            <div>
                <ExploreToolbar />
                <AppContent id="explore" onScroll={this.handleScroll}>
                    <ArticleView articles={this.props.search.results} />
                    { this.renderLoadMore(this.props.search) }
                </AppContent>
            </div>
        );
    }

    handleScroll(event) {
        var target = $(event.target);
        var scrollTopMax = target.prop('scrollHeight') - target.innerHeight();
        var scrollTop = target.scrollTop();
 
        if (scrollTop / scrollTopMax > .75) {
            SearchActions.loadMore();
        }
    }

    renderLoadMore({ isLoadingMore, total_found, start }) {
        if (isLoadingMore) {
            return (
                <div className={ Style.footer }>
                    <ProgressBar type="circular" mode="indeterminate" />
                </div>
            );
        } else if (total_found === start) {
            return false; // XXX No more results to show?
        } else {
            return (
                <div className={ Style.footer }>
                    <Button icon='cached' label='Load More' raised primary onClick={ SearchActions.loadMore }/>
                </div>
            );
        }
    }
}
