import React, { Component } from 'react';
import AltContainer from 'alt-container';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { Button } from 'react-toolbox/lib/button';
import { AppContent, ArticleView } from '../shared';
import { ExploreToolbar } from '../toolbar';
import SearchStore from '../../stores/Search.store';
import SearchActions from '../../actions/Search.action';
import Style from './style';

export default class Explore extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        SearchActions.getResults();
    }

    handleScroll(event) {
        var target = $(event.target);
        var scrollTopMax = target.prop('scrollHeight') - target.innerHeight();
        var scrollTop = target.scrollTop();

        if (scrollTop / scrollTopMax > .75) {
            SearchActions.loadMore();
        }
    }

    render() {
        var stores = {
            articles: props => ({
                store: SearchStore,
                value: SearchStore.getState().results
            })
        }

        var render = props => (
            <div>
                <ExploreToolbar />
                <AppContent id="explore" onScroll={ this.handleScroll }>
                    <ArticleView articles={props.articles} />
                    { this.renderLoadMore() }
                </AppContent>
            </div>
        );

        return (
            <AltContainer
                stores={stores}
                render={ render }
            />
        );
    }

    renderLoadMore() {
        var SearchState = SearchStore.getState();
        if (SearchState.isLoadingMore) {
            return (
                <div className={ Style.footer }>
                    <ProgressBar type="circular" mode="indeterminate" />
                </div>
            );
        } else if (SearchState.total_found == SearchState.start) {
            return false;
        } else {
            return (
                <div className={ Style.footer }>
                    <Button icon='cached' label='Load More' raised primary onClick={ SearchActions.loadMore }/>
                </div>
            );
        }
    }
}
