import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dropdown } from 'react-toolbox';
import Store from '../../../stores/User.store';
import Actions from '../../../actions/User.action';
import Styles from './styles.influencer-switcher';

export default class InfluencerSwitcher extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AltContainer 
                component={Dropdown}
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
                    auto: true,
                    source:  props.influencers.map(inf => ({
                        label: inf.name,
                        value: inf.id
                    })),
                    value: props.selectedInfluencer.id,
                    onChange: Actions.changeSelectedInfluencer,
                    className: Styles.drawerSwitcher
                })} />
        );
    }
}
