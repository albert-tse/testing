import React, { Component } from 'react';
import { Button, Dialog, Input, Layout, List, ListCheckbox, ListDivider, ListItem, ListSubHeader, NavDrawer, Panel, ProgressBar, Sidebar } from 'react-toolbox';
import AltContainer from 'alt-container';
import moment from 'moment'; 
import { defer, isEqual, pick, without } from 'lodash';
import classnames from 'classnames';

import History from '../../history';
import Loaders from './loaders'
import config from '../../config';
import { isMobilePhone } from '../../utils';

import FilterStore from '../../stores/Filter.store'
import FilterActions from '../../actions/Filter.action'
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'
import SearchActions from '../../actions/Search.action';
import UserStore from '../../stores/User.store';
import UserActions from '../../actions/User.action';

import { AppContent, ArticleView } from '../shared';
import { SelectableToolbar, Toolbars } from '../toolbar';
import CreateListForm from './CreateListForm.component';
import SearchBar from '../app/AppBar/Search.component';
import Style from './style';

/**
 * Explore View
 * This view showcases all the stories in our system
 * They can be organized into lists, and some are auto-categorized into auto-generated lists
 * This is where the user will spend most of their time
 */
export default class Explore extends Component {

    /**
     * Given the current route, determine which list should be loaded
     * @constructor
     * @param {object} props passed to this component by the Router containing the Route path
     * @return {Component} Explore
     */
    constructor(props) {
        super(props);
        var loader = Loaders[this.props.route.path];
        if(_.isFunction(loader)){
            loader = loader(this.props.params.listId);
        }
        this.state = {
            loader: loader
        }

        FilterActions.update({
            exploreDateRange: {
                date_range_type: 'allTime',
                date_start: moment(0).format(),
                date_end: moment().startOf('day').add(1, 'days').format()
            }
        });
    }

    /**
     * Display the component
     * @return {AltContainer} component that manages subscribing to specific store changes
     */
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

    /**
     * Digest the incoming properties and make any changes to it before
     * we determine whether we should update the component or not
     * @param {object} nextProps - contains the recently changed component properties
     */
    componentWillReceiveProps(nextProps){
        var newRoute = this.props.route.path !== nextProps.route.path;
        var oldListId = this.props.params && this.props.params.listId;
        var newListId = nextProps.params && nextProps.params.listId;

        if(newRoute || (oldListId != newListId)){
            var loader = Loaders[nextProps.route.path];
            if(_.isFunction(loader)){
                loader = loader(nextProps.params.listId);
            }
            this.setState({
                loader: loader
            });
        }
    }

    /**
     * Update the component only when one of the following changes are observed:
     *   - list id changed
     *   - a new list is selected
     * @param {object} nextProps - contains the component's properties that recently changed
     * @return {bool} true if one of the requirements are met
     */
    shouldComponentUpdate(nextProps) {
        var newRoute = this.props.route.path != nextProps.route.path;
        var oldListId = this.props.params && this.props.params.listId;
        var newListId = nextProps.params && nextProps.params.listId;

        return newRoute || (oldListId != newListId);
    }

}

/**
 * Semi-dumb component
 * Usually these components don't manage state, but this one needs to manage state
 * because we have to determine whether or not it should show the sidebar or pin it 
 * in response to the screen size
 */
class Contained extends Component {

    /**
     * Determine whether or not we should show sidebar depending on the screen size
     * @constructor
     * @param {object} props - refer to Contained.PropTypes for description of each props it accepts
     * @return {Component}
     */
    constructor(props) {
        super(props);
        // this.state = { steps: [] };
        ListActions.loadMyLists();
        this.Mobile = this.Mobile.bind(this);
        this.Web = this.Web.bind(this);
        this.List = this.List.bind(this);
        this.adjustNavDrawer = this.adjustNavDrawer.bind(this);
        this.state = {
            active: !this.isMobile(),
            pinned: !this.isMobile(),
            showCreateModal: false,
            newListName: ''
        };
    }

    /**
     * Before displaying the component, load all the lists so we have something to display
     * Also execute loader-specific's method that needs to be called before mounting
     */
    componentWillMount() {     
        this.props.loader.willMount.call(this);
    }

    /**
     * Display the sidebar, toolbar and the stories to show depending on selected list
     * @return {JSX}
     */
    render() {
        this.processTemplateData();
        return isMobilePhone() ? <this.Mobile /> : <this.Web />;
    }

    /**
     * This is the web view of the explore page
     * @return {JSX} the web view
     */
    Web() {
        return (
            <div>
                <Layout className={Style.mainContent}>
                    <NavDrawer 
                        active={this.state.active}
                        pinned={this.state.pinned}
                        width={'wide'}
                    >
                        <this.List />
                        <CreateListForm />
                    </NavDrawer>
                    <Panel>
                        <SelectableToolbar toolbar={this.props.loader.toolbar} selection={this.props.loader.selection}/>
                        <AppContent id="explore" onScroll={::this.handleScroll} withoutToolbar={this.isMobile()}>
                            <ArticleView articles={ this.props.loader.articles.call(this) } isSelecting={Array.isArray(this.props.filters.ucids)} />
                            { this.renderLoadMore( this.props.loader.getLoadState.call(this) ) }
                        </AppContent>
                    </Panel>
                </Layout>
            </div>
        );
    }

    /**
     * This is the mobile version of the explore page
     * Only show the list of list views
     * @return {JSX} the mobile view
     */
    Mobile() {
        return /explore/.test(this.props.loader.path) ? <this.List /> : (
            <Panel>
                <SelectableToolbar toolbar={this.props.loader.toolbar} selection={this.props.loader.selection}/>
                <AppContent id="explore" onScroll={::this.handleScroll} withoutToolbar={this.isMobile()}>
                    <ArticleView articles={ this.props.loader.articles.call(this) } isSelecting={Array.isArray(this.props.filters.ucids)} />
                    { this.renderLoadMore( this.props.loader.getLoadState.call(this) ) }
                </AppContent>
            </Panel>
        );
    }

    /**
     * Returns a list of categories for Explore view
     * Switch route of Explore tab depending on platform
     * @return {JSX}
     */
    List() {
        const exploreRoute = config.routes[isMobilePhone() ? 'all' : 'explore'];
        return (
            <div className={isMobilePhone() && Style.mobileList}>
                <SearchBar />
                <List selectable ripple >
                    <ListItem caption='All Topics' leftIcon='apps' className={this.isActive(config.routes.exploreRoute)} onClick={ () => this.redirect(exploreRoute) }/>
                    <ListItem caption='Curated' leftIcon='business_center' className={this.isActive(config.routes.curated)} onClick={ () => this.redirect(config.routes.curated) }/>
                    <ListItem caption='Recommended' leftIcon='stars' className={this.isActive(config.routes.recommended)} onClick={ () => this.redirect(config.routes.recommended) }/>
                    <ListItem caption='Trending' leftIcon='trending_up' className={this.isActive(config.routes.trending)} onClick={ () => this.redirect(config.routes.trending) }/>
                    <ListItem caption='Relevant' leftIcon='thumb_up' className={this.isActive(config.routes.relevant)} onClick={ () => this.redirect(config.routes.relevant) }/>
                    <ListDivider />
                    <ListSubHeader caption='Saved Stories' />
                    <ListItem caption='Saved' leftIcon='bookmark' className={this.isActive(config.routes.saved)} onClick={ () => this.redirect(config.routes.saved, true) }/>
                    { this.userLists }
                </List>
            </div>
        );
    }

    /**
     * The component is now on the DOM
     * Begin listening for screen size changes so we can adjust sidebar accordingly
     */
    componentDidMount() {
        try {
            window.addEventListener('resize', this.adjustNavDrawer);
        } catch(e) {
            console.warn('Currently not in DOM');
        }
    }

    /**
     * Update the component if any of the user-generated lists changed (ie. new story is added or new list is created)
     * Also update if sidebar properties changed
     * @param {object} nextProps - contains properties that changed
     * @param {object} nextState - contains changes to sidebar
     * @return {bool} true if anything we're tracking changes
     */
    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.lists.userLists != nextProps.lists.userLists || this.props.lists.userLists.length != nextProps.lists.userLists.length){
            return true;
        }else if(this.state !== nextState) {
            return true;
        }else if(this.props.filters.ucids !== nextProps.filters.ucids){
            return true;
        }else if(nextProps.loader.name == this.props.loader.name){
            return this.props.loader.shouldComponentUpdate.call(this, nextProps, nextState);
        }else{
            return true;
        }
    }

    /**
     * Final passes before the component is re-rendered
     * @param {object} nextProps - will usually contain changes when a list is updated
     * @param {object} nextState - will usually contain changes when screen is resized
     */
    componentWillUpdate(nextProps, nextState){
        if(this.props.loader.name !== nextProps.loader.name){
            nextProps.loader.willMount.call(this);
        }
    }

    /**
     * Before removing this component from DOM
     * Stop listening to screen sizes because it's safe to assume the sidebar will not be shown any longer
     */
    componentWillUnmount() {
        try {
            window.removeEventListener('resize', this.adjustNavDrawer);
        } catch (e) {
            console.warn('Currently not in DOM');
        }
    }

    /**
     * Digest the props/states here before rendering the component
     * so we keep the render() method as fast as possible
     */
    processTemplateData() {
        this.userLists = Array.isArray(this.props.lists.userLists) ? this.getUserLists() : [];
        
        const role = UserStore.getState().user.role;
        if(/role|internal_influencer/.test(role) || /role|admin/.test(role)) {
            const internalList = <ListItem caption='Internal Testing' leftIcon='business_center' className={this.isActive(config.routes.internalCurated)} onClick={ () => this.redirect(config.routes.internalCurated, true) }/>;
            this.userLists.unshift(internalList);
        }

    }

    /**
     * Convert the user lists from a JSON array to a set of react elements
     * @return {JSX}
     */
    getUserLists() {
        return this.props.lists.userLists
            .filter(list => list.list_type_id === 2)
            .map((el, i) => (
                <ListItem 
                    caption={el.list_name} 
                    className={this.isActive(config.routes.list.replace(':listId', el.list_id))}
                    key={i}
                    leftIcon={ <div>{el.articles}</div> } 
                    onClick={ () => this.redirect(config.routes.list.replace(':listId', el.list_id), true) } />
            )
        );
    }

    /**
     * Check if screen size is for mobile
     * TODO do not hardcode the screen size
     * @return {bool} true if less than 1024px
     */
    isMobile() {
        try {
            return document.body.getBoundingClientRect().width < 1024;
        } catch (e) {
            return false;
        }
    }

    /**
    * Determine if we should show or hide the sidebar depending on screen size
    * @return {bool}
    */
    adjustNavDrawer() {
        this.setState({
            active: !this.isMobile(),
            pinned: !this.isMobile()
        });
    }

    /**
     * This is called when a user clicks on a list item on the sidebar menu
     * Redirect the user to the correct list
     * @param {string} url to the list page
     * @param {bool} allTime pass true if you want the date range filter to show all the stories since the list creation instead of the latest stories only (default: false)
     */
    redirect(url, allTime = false) {
        FilterActions.clearSelection();
        FilterActions.reset();
        if(allTime){
            FilterActions.update({
                exploreDateRange: {
                    date_range_type: 'allTime',
                    date_start: moment(0).format(),
                    date_end: moment().startOf('day').add(1, 'days').format()
                }
            });
        }
        History.push(url);
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
            this.props.loader.loadMore.call(this);
        }
    }

    /**
     * Determines whether more stories should be loaded
     * @param {object} untitled because we don't use the object
     * @param {bool} isLoadingMore is true if this has already been called recently; this prevents multiple calls in a short timeframe
     * @param {bool} hasMore is true if the current view still has more stories that haven't been loaded to the DOM yet
     * @return {JSX} either a loading indicator or a button that says Load More
     */
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

    /**
     * Check if the nav item that is currently being rendered matches
     * the current page the user is on
     * @param {string} pathToChecek is the path that this current nav item would redirect the user to
     * @return {string} the classname of isActive if the user is on the page this nav item redirects to
     */
    isActive(pathToCheck) {
        const { name, path } = this.props.loader;

        if (/explore|curated|recommended|trending|relevant|saved|curated-internal/.test(path)) {
            return pathToCheck == path && Style.isActive;
        } else if (/list/.test(path)) {
            const listId = parseInt(name.replace(/[a-zA-Z-]/g,''));
            return pathToCheck == path.replace(':listId', listId) && Style.isActive;
        } else {
            return '';
        }
    }
}
