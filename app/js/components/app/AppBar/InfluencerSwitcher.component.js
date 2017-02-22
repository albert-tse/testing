import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { Avatar, Dropdown, IconButton, Chip, IconMenu, List, ListItem, MenuDivider, MenuItem } from 'react-toolbox';
import classnames from 'classnames';

import { isMobilePhone } from '../../../utils';
import Store from '../../../stores/User.store';
import Actions from '../../../actions/User.action';

import Styles from '../styles';

/** Represents the influencer selector either as a dropdown menu or an entirely new page (on mobile phones) */
export default class InfluencerSwitcher extends Component {

    /**
     * Instantiate the component
     * @param {object} props contains the path of the current page
     * @return {Component} the influencer selector
     */
    constructor(props) {
        super(props);
    }

    /**
     * Wrap the component with a container that will keep track of any store changes
     * @return {AltContainer} the container
     */
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

/** The actual menu that will pop out of the button */
class Menu extends Component {

    /**
     * Instantiates the menu
     * @return {Component} the component
     */
    constructor(props) {
        super(props);
        this.MobileSwitcher = this.MobileSwitcher.bind(this);
        this.toggleMobileSwitcher = this.toggleMobileSwitcher.bind(this);
        this.WebSwitcher = this.WebSwitcher.bind(this);
        this.selectedInfluencerOnMobile = this.selectedInfluencerOnMobile.bind(this);
        this.navigate = this.navigate.bind(this);
        this.state = {
            showMobileSwitcher: false
        };
    }

    /**
     * Display the dropdown menu or full page
     * @return {JSX} the component
     */
    render() {
        return isMobilePhone() ? <this.MobileSwitcher {...this.props} /> : <this.WebSwitcher { ...this.props } />;
    }

    /**
     * Show a full-screen dialog that lists all selectable influencers
     * @param {object} props from this component
     * @return {JSX} full screen dialog of influencer list
     */
    MobileSwitcher(props) {
        return (
            <div>
                <Avatar title={props.selectedInfluencer.name} image={props.selectedInfluencer.fb_profile_image} onClick={this.toggleMobileSwitcher} />
                <div className={classnames(Styles.overlay, this.state.showMobileSwitcher && Styles.visible)} onClick={this.state.showMobileSwitcher && this.toggleMobileSwitcher}>
                    <div className={Styles.mobileSwitcher} onClick={evt => evt.stopPropagation()}>
                        <header className={Styles.mobileSwitcher__selectedInfluencer}>
                            {props.icon}
                            <h1 className={Styles.selectedInfluencer__name}>{props.selectedInfluencer.name}</h1>
                        </header>
                        <List className={Styles.mobileSwitcher__influencers} selectable ripple>
                            {props.influencers.map(inf => (
                                <ListItem 
                                    avatar={inf.fb_profile_image || <Avatar icon="person" />} 
                                    caption={inf.name} 
                                    className={Styles.mobileSwitcher__influencer} 
                                    key={inf.id} 
                                    onClick={evt => this.selectedInfluencerOnMobile(inf.id)} />
                            ))}
                        </List>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Show a chip with influencer name and have a dropdown menu of influencers
     * @param {object} props from this component
     * @return {JSX} the menu
     */
    WebSwitcher(props) {
        const name = props.selectedInfluencer.name;
        const influencers = props.influencers
            .filter(influencer => influencer.enabled)
            .map(influencer => ({ ...influencer, value: influencer.id }));

        return influencers && (
            <div className={Styles.webSwitcher}>
                <Dropdown
                    auto={false}
                    className={Styles.influencerDropdown}
                    onChange={this.navigate}
                    ref={c => this.dropdown = c}
                    source={influencers}
                    template={this.Option}
                    value={props.selectedInfluencer.id}
                />
            </div>
        ) || <div />;
    }

    /**
     * A template for the options in the dropdown menu
     * @param {Object} props contains the influencer attributes
     * @return {JSX}
     */
    Option(props) {
        return (
            <div className={Styles.option}>
                <Avatar title={props.name} image={props.fb_profile_image} />
                <span className={Styles.influencerName}>{props.name}</span>
            </div>
        );
    }

    /**
     * Callback method for the mobile influencer switcher
     * This will be called when a new influencer is chosen
     * Update the current influencer and hide the switcher
     * @param {int} influencerId the influencer's id
     */
    selectedInfluencerOnMobile(influencerId) {
        this.navigate(influencerId);
        this.toggleMobileSwitcher();
    }

    /**
     * Update the current active influencer
     * @param {String} value is the name of the influencer
     */ 
    navigate(value) {
        Actions.changeSelectedInfluencer(value);
    }

    /**
     * Toggle the mobile influencer switcher
     * @param {Event} evt that triggered
     */
    toggleMobileSwitcher(evt) {
        this.setState({ showMobileSwitcher: !this.state.showMobileSwitcher });
    }

}

/**
 * Get the currently chosen influencer's thumbnail
 * @param {object} influencer contains the profile details of currently active influencer
 * @return {JSX} component representing an Avatar
 */
const getInfluencerIcon = influencer => {
    return influencer.fb_profile_image ?
        <Avatar><img src={influencer.fb_profile_image} /></Avatar> :
        <Avatar icon='account_circle' />;
};
