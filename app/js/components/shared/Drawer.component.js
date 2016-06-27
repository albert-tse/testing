import React, { Component } from 'react'
import AltContainer from 'alt-container';
import AuthActions from '../../actions/Auth.action'
import Config from '../../config'
import InfluencerSwitcher from '../toolbar/toolbar_components/InfluencerSwitcher.component';
import { NavDrawer as ReactNavDrawer, List, ListItem, ListDivider, ListSubHeader, IconButton } from 'react-toolbox';
import History from '../../history.js'
import DrawerStore from '../../stores/Drawer.store';
import DrawerActions from '../../actions/Drawer.action';
import Styles from './styles.drawer';

class Drawer extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactNavDrawer permanentAt={this.props.permanentAt} active={this.props.isActive} onOverlayClick={::this.toggleDrawer}>
                <div>
                    <h1 className={Styles.logo}>Contempo</h1>
                    <InfluencerSwitcher />
                    <List selectable ripple>
                        <ListItem caption="Explore" leftIcon="explore" onClick={ () => this.redirect(Config.routes.explore) } />
                        <ListItem caption="Saved" leftIcon="bookmark" onClick={ () => this.redirect(Config.routes.saved) } />
                        <ListItem caption="Shared" leftIcon="share" onClick={ () => this.redirect(Config.routes.shared) } />
                        <ListItem caption="Links" leftIcon="link" onClick={ () => this.redirect(Config.routes.links) } />
                    </List>
                </div>
                <List selectable ripple>
                    <ListItem caption="Settings" leftIcon="settings" onClick={ () => this.redirect(Config.routes.settings) } />
                    <ListItem caption="Log out" leftIcon="exit_to_app" onClick={::this.logout}/>
                </List>
             </ReactNavDrawer>
        );
    }

    toggleDrawer(evt) {
        // Don't hide the drawer when selecting an influencer from the dropdown menu
        if (evt.target.dataset.reactToolbox !== 'dropdown') {
            this.props.toggle();
        }
    }

    redirect(route) {
        History.push(route);
    }

    logout() {
        AuthActions.deauthenticate();
        this.redirect(Config.routes.login);
    }
}

export default class NavDrawer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={Drawer}
                shouldComponentUpdate={(prevProps, container, nextProps) => prevProps.isActive !== nextProps.isActive}
                actions={DrawerActions}
                store={DrawerStore}
                inject={{
                    permanentAt: 'lg'
                }}
            />
        );
    }

}
