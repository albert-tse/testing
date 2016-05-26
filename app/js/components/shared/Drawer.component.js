import React from 'react'
import AuthActions from '../../actions/Auth.action'
import Config from '../../config'
import InfluencerSwitcher from '../toolbar/toolbar_components/InfluencerSwitcher.component';
import { NavDrawer as ReactNavDrawer, List, ListItem, ListDivider, ListSubHeader, IconButton } from 'react-toolbox';

export default class NavDrawer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactNavDrawer permanentAt="lg">
                <div>
                    <List selectable ripple>
                        <InfluencerSwitcher />
                        <ListSubHeader caption="Browse" />
                        <ListItem caption="Explore" leftIcon="explore" to={`/#${Config.routes.explore}`} />
                        <ListItem caption="Scheduled" leftIcon="access_time" />
                        <ListItem caption="Shared" leftIcon="share" to={`/#${Config.routes.shared}`} />
                        <ListDivider />
                        <ListSubHeader caption="Collections" />
                        <ListItem caption="Saved" leftIcon="bookmark" to={`/#${Config.routes.saved}`} />
                        <ListItem caption="Tom's List" leftIcon="view_list" />
                        <ListItem caption="Craig's List" leftIcon="view_list" />
                    </List>
                </div>
                <List selectable ripple>
                    <ListItem caption="Settings" leftIcon="settings" to={`/#${Config.routes.settings}`} />
                    <ListItem caption="Log out" leftIcon="exit_to_app" onClick={AuthActions.deauthenticate}/>
                </List>
             </ReactNavDrawer>

        );
    }

}
