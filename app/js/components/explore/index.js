import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button, ProgressBar } from 'react-toolbox';
import Joyride from 'react-joyride';
import Style from './style';

import { AppContent, ArticleView } from '../shared';
import { ExploreToolbar } from '../toolbar';

import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import UserStore from '../../stores/User.store';

import SearchActions from '../../actions/Search.action';
import UserActions from '../../actions/User.action';

import { defer, isEqual, pick, without } from 'lodash';
import Loaders from './loaders'


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
        this.state = { steps: [] };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state !== nextState) {
            return true;
        }else if(nextProps.loader.name == this.props.loader.name){
            return this.props.loader.shouldComponentUpdate.call(this, nextProps, nextState);
        }else{
            return true;
        }
    }

    componentDidMount() {
        if (!UserStore.getState().completedOnboardingAt.explore) {
            setTimeout(() => {
                this.addSteps({
                    title: 'Share this story',
                    text: 'This will give you options for sharing this article on your social profile',
                    selector: "div[id^='article']:first-of-type .share-button"
                });
                this.joyride.start();
            }, 1000);
        }
    }

    render() {
        return (
            <div>
                <Joyride ref={c => this.joyride = c} steps={this.state.steps} callback={::this.nextStep} />
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
            </div>
        );
    }

    addSteps(steps) {
        let joyride = this.joyride;

        if (!Array.isArray(steps)) {
            steps = [steps];
        }

        if (!steps.length) {
            return false;
        }

        this.setState({ steps: [...this.state.steps, ...joyride.parseSteps(steps)] });
    }

    nextStep({ action, type }) {
        console.log(action, type);
        if (action === 'close' && type == 'finished') {
            UserActions.completedOnboarding({ explore: true });
        }
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
