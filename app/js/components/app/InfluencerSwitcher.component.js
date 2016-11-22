import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Avatar, Chip, IconMenu, MenuDivider, MenuItem } from 'react-toolbox';
import Store from '../../stores/User.store';
import Actions from '../../actions/User.action';
import Styles from './styles';

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
        const name = this.props.selectedInfluencer.name;

        return (
            <IconMenu
                className={Styles.menu}
                icon={
                    <Chip>
                        {this.props.icon}
                        <span>{name.length > 13 ? name.substring(0,11).replace(/\s$/, '') + '...' : name}</span>
                    </Chip>
                }
                position="auto"
                onSelect={::this.navigate}
            >
                {this.props.influencers.filter(influencer => influencer.enabled).map((influencer, key) => (
                    <MenuItem value={influencer.id} icon='account_circle' caption={influencer.name} key={key} />
                ))}
            </IconMenu>
        );
    }

    navigate(value) {
        Actions.changeSelectedInfluencer(value);
    }

}

const getInfluencerIcon = influencer => {
    return influencer.fb_profile_image ?
        <Avatar className={Styles.avatar} image={influencer.fb_profile_image} /> :
        <Avatar className={Styles.avatar} icon='account_circle' />;
};

