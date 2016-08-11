import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Avatar, IconMenu, MenuDivider, MenuItem } from 'react-toolbox';
import Store from '../../stores/User.store';
import Actions from '../../actions/User.action';
import AuthActions from '../../actions/Auth.action';
import Styles from './styles';
import Config from '../../config';
import History from '../../history';

export default class InfluencerSwitcher extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer
                component={Menu}
                stores={{
                    influencers: props => ({
                        store: Store,
                        value: Store.getState().user.influencers
                    }),
                    selectedInfluencer: props => ({
                        store: Store,
                        value: Store.getState().selectedInfluencer
                    })
                }}
                transform={ props => ({
                    icon: getInfluencerIcon(props.selectedInfluencer),
                    ...props
                })}
            />
        );
    }
}

class Menu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IconMenu
                className={Styles.menu}
                icon={this.props.icon}
                position="auto"
                onSelect={::this.navigate}
            >
                {this.props.influencers.filter(influencer => influencer.enabled > 0).map((influencer, key) => (
                    <MenuItem value={influencer.id} icon='account_circle' caption={influencer.name} key={key} />
                ))}
                <MenuDivider />
                <MenuItem value="settings" caption="Settings" />
                <MenuItem value="logout" caption="Log out" />
            </IconMenu>
        );
    }

    navigate(value) {
        if (! (value in handlers)) {
            Actions.changeSelectedInfluencer(value);
        } else {
            handlers[value]();
        }
    }

}

const getInfluencerIcon = influencer => {
    return influencer.fb_profile_image ?
        <Avatar className={Styles.avatar} image={influencer.fb_profile_image} /> :
        <Avatar className={Styles.avatar} icon='account_circle' />;
};

const handlers = {
    settings: () => History.push(Config.routes.settings),
    logout: () => {
        AuthActions.deauthenticate();
        History.push(Config.routes.login);
    }
};
