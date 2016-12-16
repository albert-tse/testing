import React, { Component, PropTypes } from 'react';
import AltContainer from 'alt-container';
import { Button, Panel } from 'react-toolbox';

import Config from '../../config';
import History from '../../history';
import FilterStore from '../../stores/Filter.store';
import SearchStore from '../../stores/Search.store';
import SearchActions from '../../actions/Search.action';

import AppContent from '../shared/AppContent/AppContent.component';
import ArticleView from '../shared/article/ArticleView.component';
import ExplorerBar from '../app/AppBar';
import { Toolbars } from '../toolbar';

export default class Container extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={Search}
                actions={props => ({
                    loadMore: SearchActions.loadMore
                })}
                stores={{
                    articles: props => ({
                        store: SearchStore,
                        value: SearchStore.getState().results
                    }),
                    ucids: props => ({
                        store: FilterStore,
                        value: FilterStore.getState().ucids
                    })
                }}
                inject={{
                    location: this.props.location
                }}
            />
        );
    }
}

class Search extends Component {

    constructor(props) {
        super(props);
        this.loadMore = this.props.loadMore;
        this.handleScroll = this.handleScroll.bind(this);
    }

    render() {
        return (
            <Panel>
                {!! this.props.ucids ? 
                    <Toolbars.Selection /> :
                    <ExplorerBar location={this.props.location} />
                }
                <AppContent id="explore" onScroll={this.handleScroll} withoutToolbar={true}>
                    <ArticleView 
                        articles={this.props.articles} 
                        emptyState={this.EmptyView}
                        isSelecting={Array.isArray(this.props.ucids)}
                    />
                </AppContent>
            </Panel>
        );
    }

    EmptyView() {
        return (
            <div style={{ textAlign: 'center' }}>
                <strong>Oops, we haven't found any stories for this topic yet. Try a different set of keywords.</strong>
                <Button
                    style={{ marginTop: '2rem' }}
                    label="Search New Topic"
                    raised
                    primary
                    onClick={evt => History.push(Config.routes.explore)}
                />
            </div>
        );
    }

    /**
     * Load more stories whenever the user reaches the bottom of the page
     * @param {Event} event containing the location of the page
     */
    handleScroll(event) {
        var target = $(event.target);
        var scrollTopMax = target.prop('scrollHeight') - target.innerHeight();
        var scrollTop = target.scrollTop();
 
        if (scrollTop / scrollTopMax > .75) {
            this.props.loadMore();
        }
    }
}
