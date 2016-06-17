import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Dropdown, FontIcon } from 'react-toolbox';
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
                        value: inf.id,
                        image: inf.fb_profile_image
                    })),
                    value: props.selectedInfluencer.id,
                    onChange: Actions.changeSelectedInfluencer,
                    className: Styles.drawerSwitcher,
                    template: this.template
                })} />
        );
    }

    template(influencer) {
        return (
            <span>
                {influencer.image ? 
                    <img className={Styles.avatar} src={influencer.image} /> :
                    <FontIcon className={Styles.avatar} value='person' />
                }
                {influencer.label}
            </span>
        );
    }
}
