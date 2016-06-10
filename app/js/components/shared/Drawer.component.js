import React from 'react'
import AuthActions from '../../actions/Auth.action'
import Config from '../../config'
import InfluencerSwitcher from '../toolbar/toolbar_components/InfluencerSwitcher.component';
import { NavDrawer as ReactNavDrawer, List, ListItem, ListDivider, ListSubHeader, IconButton } from 'react-toolbox';
import History from '../../history.js'

export default class NavDrawer extends React.Component {

    constructor(props) {
        super(props);
    }

    redirect(route) {
        History.push(route);
    }

    logout() {
        AuthActions.deauthenticate();
        this.redirect(Config.routes.login);
    }

    render() {
        return (
            <ReactNavDrawer permanentAt="lg">
                <div>
                    <List selectable ripple>
                        <InfluencerSwitcher />
                        <ListItem caption="Explore" leftIcon="explore" onClick={ () => this.redirect(Config.routes.explore) } />
                        <ListItem caption="Saved" leftIcon="bookmark" onClick={ () => this.redirect(Config.routes.saved) } />
                        <ListItem caption="Shared" leftIcon="share" onClick={ () => this.redirect(Config.routes.shared) } />
                        <ListItem caption="Links" leftIcon="link" onClick={ () => this.redirect(Config.routes.links) } />
                        {/*<ListSubHeader caption="Browse" />*/}
                        {/*<ListItem caption="Scheduled" leftIcon="access_time" />*/}
                        {/*<ListDivider />
                           <ListSubHeader caption="Collections" />*/}
                        {/*<ListItem caption="Tom's List" leftIcon="view_list" />
                           <ListItem caption="Craig's List" leftIcon="view_list" />*/}
                    </List>
                </div>
                <List selectable ripple>
                    <ListItem caption="Settings" leftIcon="settings" onClick={ () => this.redirect(Config.routes.settings) } />
                    <ListItem caption="Log out" leftIcon="exit_to_app" onClick={::this.logout}/>
                </List>
             </ReactNavDrawer>

        );
    }

}
