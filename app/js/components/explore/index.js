import React, { Component } from 'react';
import AltContainer from 'alt-container';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { Button } from 'react-toolbox/lib/button';
import { AppContent, ArticleView } from '../shared';
import { ExploreToolbar } from '../toolbar';
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';


import Style from './style';
import { defer, isEqual, pick, without } from 'lodash';
import Loaders from './loaders'

import SearchStore from '../../stores/Search.store';
import SearchActions from '../../actions/Search.action';
import FilterStore from '../../stores/Filter.store'

export default class Explore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: Loaders[this.props.route.path]
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillMount() {
        var loader = Loaders[this.props.route.path];
        this.setState({
            loader: loader
        });

        loader.willMount();
    }

    render() {
        return (
            <AltContainer
                component={Contained}
                stores={this.state.loader.stores}
                inject={{
                    isFromSignUp: this.props.route.isFromSignUp,
                    loader: this.state.loader
                }}
            />
        );
    }
}

class Contained extends Component {

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.loader.name == this.props.loader.name){
            return this.props.loader.shouldComponentUpdate.call(this, nextProps, nextState);
        }else{
            return true;
        }
    }

    render() {
        return (
            <Layout>
                <NavDrawer active={true}
                    pinned={true}
                    onOverlayClick={ function(){} }
                    width={'wide'}
                >
                    <List selectable ripple>
                        <ListItem caption='All Topics' leftIcon='apps' />
                        <ListItem caption='Relevant' leftIcon='thumb_up' />
                        <ListItem caption='Trending' leftIcon='trending_up' />
                        <ListItem caption='Recommended' leftIcon='stars' />
                        <ListItem caption='Curated' leftIcon='business_center' />
                        <ListItem caption='Saved' leftIcon='bookmark' />

                        <ListDivider />
                        <ListSubHeader caption='Saved Stories' />
                        <ListItem caption='My List 1' leftIcon={ <div>10</div> } />
                        <ListItem caption='My List 2' leftIcon={ <div>10</div> } />
                        <ListItem caption='My List 3' leftIcon={ <div>10</div> } />
                        <ListItem caption='My List 4' leftIcon={ <div>10</div> } />
                        <ListItem caption='My List 5' leftIcon={ <div>10</div> } />
                    </List>
                </NavDrawer>
                <Panel>
                    <ExploreToolbar />
                    <AppContent id="explore" onScroll={::this.handleScroll}>
                        <ArticleView articles={ this.props.loader.articles.call(this) } />
                        { this.renderLoadMore( this.props.loader.getLoadState.call(this) ) }
                    </AppContent>
                </Panel>
            </Layout>
        );
    }

    handleScroll(event) {
        var target = $(event.target);
        var scrollTopMax = target.prop('scrollHeight') - target.innerHeight();
        var scrollTop = target.scrollTop();
 
        if (scrollTop / scrollTopMax > .75) {
            this.props.loader.loadMore();
        }
    }

    renderLoadMore({ isLoadingMore, hasMore }) {
        if (isLoadingMore) {
            return (
                <div className={ Style.footer }>
                    <ProgressBar type="circular" mode="indeterminate" />
                </div>
            );
        } else if (!hasMore) {
            return false; // XXX No more results to show?
        } else {
            return (
                <div className={ Style.footer }>
                    <Button icon='cached' label='Load More' raised primary onClick={ this.props.loader.loadMore }/>
                </div>
            );
        }
    }
}
