import React, { Component } from 'react';
import { Button, Dialog, Input, Layout, List, ListCheckbox, ListDivider, ListItem, ListSubHeader, NavDrawer, Panel, ProgressBar, Sidebar } from 'react-toolbox';
import AltContainer from 'alt-container';
import moment from 'moment'; 
import { defer, isEqual, pick, without } from 'lodash';

import History from '../../history';
import Loaders from './loaders'
import config from '../../config';

import FilterStore from '../../stores/Filter.store'
import FilterActions from '../../actions/Filter.action'
import ListStore from '../../stores/List.store'
import ListActions from '../../actions/List.action'
import SearchActions from '../../actions/Search.action';
import UserStore from '../../stores/User.store';
import UserActions from '../../actions/User.action';

import { AppContent, ArticleView } from '../shared';
import { SelectableToolbar, Toolbars } from '../toolbar';
import Style from './style';

/**
 * Explore View
 * This view showcases all the stories in our system
 * They can be organized into lists, and some are auto-categorized into auto-generated lists
 * This is where the user will spend most of their time
 */
export default class Explore extends Component {

    /**
     * Constructor
     * @desc Given the current route, determine which list should be loaded
     * @param Object props passed to this component by the Router containing the Route path
     * @return React.Component Explore
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
     * @return AltContainer container component that manages subscribing to specific store changes
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
     * @param Object nextProps contains the recently changed component properties
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
     * @param Object nextProps contains the component's properties that recently changed
     * @return bool true if one of the requirements are met
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
     * Constructor
     * @desc Determine whether or not we should show sidebar depending on the screen size
     * @param Object props refer to Contained.PropTypes for description of each props it accepts
     * @return React.Component
     */
    constructor(props) {
        super(props);
        // this.state = { steps: [] };
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
        ListActions.loadMyLists();
        this.props.loader.willMount.call(this);
    }

    /**
     * Display the sidebar, toolbar and the stories to show depending on selected list
     * @return JSX
     */
    render() {
        return (
            <div>
                <Layout className={Style.mainContent}>
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
                            <ListItem caption='Saved' leftIcon='bookmark' className={this.isActive(config.routes.saved)} onClick={ () => this.redirect(config.routes.saved, true) }/>
                            {
                                userLists
                            }
                        </List>
                        <Button icon='add' floating accent className={Style.addButton} onClick={::this.toggleCreateModal} />
                    </NavDrawer>
                    <Panel>
                        <SelectableToolbar toolbar={this.props.loader.toolbar} selection={this.props.loader.selection}/>
                        <AppContent id="explore" onScroll={::this.handleScroll} withoutToolbar={this.isMobile()}>
                            <ArticleView articles={ this.props.loader.articles.call(this) } />
                            { this.renderLoadMore( this.props.loader.getLoadState.call(this) ) }
                        </AppContent>
                    </Panel>
                </Layout>
                    <Dialog
                      actions={this.createModalActions()}
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
     * @param Object nextProps contains properties that changed
     * @param Object nextState contains changes to sidebar
     * @return bool true if anything we're tracking changes
     */
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

    /**
     * Final passes before the component is re-rendered
     * @param Object nextProps will usually contain changes when a list is updated
     * @param Object nextState will usually contain changes when screen is resized
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

    // ---
    
    /**
     * Digest the props/states here before rendering the component
     * so we keep the render() method as fast as possible
     */
    processTemplateData() {
        this.userLists = this.props.lists.userLists
            .filter(list => list.list_type_id === 2)
            .map((el, i) => (
                <ListItem 
                    caption={el.list_name} 
                    key={i}
                    leftIcon={ <div>{el.articles}</div> } 
                    onClick={ () => this.redirect(config.routes.list.replace(':listId', el.list_id), true) } />
            )
        );
            
        const role = UserStore.getState().user.role;
        if(/role|internal_influencer/.test(role)) {
            const internalList = <ListItem caption='TSE - Internal' leftIcon='business_center' className={this.isActive(config.routes.internalCurated)} onClick={ () => this.redirect(config.routes.internalCurated, true) }/>;
            this.userLists.unshift(internalList);
        }
    }

    /**
     * Check if screen size is for mobile
     * TODO do not hardcode the screen size
     * @return bool true if less than 1024px
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
    * @return bool
    */
    adjustNavDrawer() {
        this.setState({
            active: !this.isMobile(),
            pinned: !this.isMobile()
        });
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

    createModalActions () {
        return [
            { label: "Create", onClick: ::this.createList },
            { label: "Cancel", onClick: ::this.toggleCreateModal }
        ];
    }

    redirect(url, allTime) {
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
