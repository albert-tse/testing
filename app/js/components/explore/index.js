import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Button, ProgressBar } from 'react-toolbox';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import Style from './style';

import History from '../../history';

import { AppContent, ArticleView } from '../shared';
import { SelectableToolbar, Toolbars } from '../toolbar';
import config from '../../config';

import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox';
import { List, ListItem, ListSubHeader, ListDivider, ListCheckbox } from 'react-toolbox/lib/list';
import UserStore from '../../stores/User.store';

import SearchActions from '../../actions/Search.action';
import UserActions from '../../actions/User.action';

import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'

import { defer, isEqual, pick, without } from 'lodash';
import Loaders from './loaders'


export default class Explore extends Component {

    constructor(props) {
        super(props);
        var loader = Loaders[this.props.route.path];
        if(_.isFunction(loader)){
            loader = loader(this.props.params.listId);
        }
        this.state = {
            loader: loader
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.route.path != nextProps.route.path;
    }

    componentWillReceiveProps(nextProps){
        if(this.props.route.path !== nextProps.route.path){
            var loader = Loaders[nextProps.route.path];
            if(_.isFunction(loader)){
                loader = loader(this.props.params.listId);
            }
            this.setState({
                loader: loader
            });
        }
    }

    render() {
        return (
            <AltContainer
                component={Contained}
                stores={ _.extend({}, {lists: ListStore}, this.state.loader.stores) }
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
        // this.state = { steps: [] };
        this.state = {
            active: true,
            pinned: true,
            showCreateModal: false,
            newListName: ''
        };
        ListActions.loadMyLists();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.lists.userLists != nextProps.lists.userLists || this.props.lists.userLists.length != nextProps.lists.userLists.length){
            return true;
        }else if(this.state !== nextState) {
            return true;
        }else if(nextProps.loader.name == this.props.loader.name){
            return this.props.loader.shouldComponentUpdate.call(this, nextProps, nextState);
        }else{
            return true;
        }
    }

    componentWillMount() {     
        this.props.loader.willMount.call(this);
    }

    componentWillUpdate(nextProps, nextState){
        if(this.props.loader.name !== nextProps.loader.name){
            nextProps.loader.willMount.call(this);
        }
    }

    componentDidMount() {
        /*
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
        */
    }

    toggleCreateModal() {
        this.setState({
            newListName: '',
            showCreateModal: !this.state.showCreateModal
        });
    }

    createList(){
        if(this.state.newListName){
            ListActions.createList(this.state.newListName);
            ::this.toggleCreateModal();
        }
    }

    createModalActions = [
        { label: "Create", onClick: ::this.createList },
        { label: "Cancel", onClick: ::this.toggleCreateModal }
    ];

    render() {
        return (
            <div>
                <Layout>
                    <NavDrawer 
                        active={this.state.active}
                        pinned={this.state.pinned}
                        width={'wide'}
                    >
                        <List selectable ripple >
                            <ListItem caption='All Topics' leftIcon='apps' className={this.isActive(config.routes.explore)} onClick={ () => this.redirect(config.routes.explore) }/>
                            <ListItem caption='Curated' leftIcon='business_center' className={this.isActive(config.routes.curated)} onClick={ () => this.redirect(config.routes.curated) }/>
                            <ListItem caption='Recommended' leftIcon='stars' className={this.isActive(config.routes.recommended)} onClick={ () => this.redirect(config.routes.recommended) }/>
                            <ListItem caption='Trending' leftIcon='trending_up' className={this.isActive(config.routes.trending)} onClick={ () => this.redirect(config.routes.trending) }/>
                            <ListItem caption='Relevant' leftIcon='thumb_up' className={this.isActive(config.routes.relevant)} onClick={ () => this.redirect(config.routes.relevant) }/>
                            <ListDivider />
                            <ListSubHeader caption='Saved Stories' />
                            <ListItem caption='Saved' leftIcon='bookmark' className={this.isActive(config.routes.saved)} onClick={ () => this.redirect(config.routes.saved) }/>
                            { _.map(this.props.lists.userLists, function(el, i){
                                return <ListItem caption={el.list_name} leftIcon={ <div>{el.articles}</div> } key={i}  onClick={ () => this.redirect(config.routes.list.replace(':listId', el.list_id)) }/>
                            }.bind(this))}
                        </List>
                        <Button icon='add' floating accent className={Style.addButton} onClick={::this.toggleCreateModal} />
                    </NavDrawer>
                    <Panel>
                        <SelectableToolbar toolbar={this.props.loader.toolbar} />
                        <AppContent id="explore" onScroll={::this.handleScroll}>
                            <ArticleView articles={ this.props.loader.articles.call(this) } />
                            { this.renderLoadMore( this.props.loader.getLoadState.call(this) ) }
                        </AppContent>
                    </Panel>
                </Layout>
                    <Dialog
                      actions={this.createModalActions}
                      active={this.state.showCreateModal}
                      onEscKeyDown={::this.toggleCreateModal}
                      onOverlayClick={::this.toggleCreateModal}
                      title='Create new story list'
                    >
                        <Input type='text' label='Name' name='name' value={this.state.newListName} onChange={function(i){this.setState({newListName: i});}.bind(this)} maxLength={50} />
                    </Dialog>
            </div>
        );
    }

    redirect(url) {
        History.push(url);
    }

    isActive(url) {
        return '';
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
        if (action === 'close' && type == 'finished') {
            UserActions.completedOnboarding({ explore: true });
        }
    }

    handleScroll(event) {
        var target = $(event.target);
        var scrollTopMax = target.prop('scrollHeight') - target.innerHeight();
        var scrollTop = target.scrollTop();
 
        if (scrollTop / scrollTopMax > .75) {
            this.props.loader.loadMore.call(this);
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
                    <Button icon='cached' label='Load More' raised primary onClick={ ::this.props.loader.loadMore }/>
                </div>
            );
        }
    }
}
