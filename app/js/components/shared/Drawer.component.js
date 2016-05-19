import React from 'react'
import AuthActions from '../../actions/Auth.action'
import Config from '../../config'
import { NavDrawer, List, ListItem, ListDivider, ListSubHeader } from 'react-toolbox';

class Drawer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <NavDrawer permanentAt="lg">
                <div>
                    <div className="influencer-switcher mdl-color--blue-grey-600">
                        <div className="dropdown">
                            <select id="partner" className="navbar-text show-user" onChange={this.influencerChanged}></select>
                            <button className="mdl-button mdl-button--icon">
                                <i className="material-icons">arrow_drop_down</i>
                            </button>
                        </div>
                    </div>
                    <List selectable ripple>
                        <ListItem caption="Explore" leftIcon="explore" to={`/#${Config.routes.explore}`} />
                        <ListItem caption="Scheduled" leftIcon="access_time" />
                        <ListItem caption="Shared" leftIcon="share" to={`/#${Config.routes.shared}`} />
                        <ListItem caption="Dashboard (old)" leftIcon="dashboard" to="/#/legacydashboard" />
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
             </NavDrawer>

        );
    }

}

export default Drawer;
