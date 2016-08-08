import React, { Component } from 'react';
import AltContainer from 'alt-container';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { Button } from 'react-toolbox/lib/button';
import { AppContent, ArticleView } from '../shared';
import { ExploreToolbar } from '../toolbar';
import SearchStore from '../../stores/Search.store';
import SearchActions from '../../actions/Search.action';
import Style from './style';

// TODO: listen to the Filter state changes and update accordingly
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
                store={ SearchStore }
                shouldComponentUpdate={ (prevProps, container, nextProps) => prevProps.results !== nextProps.results }
                render={ ::this.renderComponent }
            />
        );
    }

    renderComponent(props) {
        return (
            <div>
                <ExploreToolbar />
                <AppContent id="explore" onScroll={ this.handleScroll }>
                    <ArticleView articles={props.results} />
                    { this.renderLoadMore(props) }
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
