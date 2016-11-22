import React, { Component, PropTypes } from 'react';
import { IconMenu, MenuItem } from 'react-toolbox';

import AuthActions from '../../actions/Auth.action';
import History from '../../history';
import Config from '../../config';

import Styles from './styles.appBar';

/** Represents a menu to be shown on the App Bar */
export default class SecondaryMenu extends Component {

    /**
     * Pass the props down from parent component
     * @param {object} props 
     * @return {Component}
     */
    constructor(props) {
        super(props);
    }

    /**
     * Display the secondary menu
     * @return {JSX} the component
     */
    render() {
        return (
            <IconMenu className={Styles.secondaryMenu} icon="more_vert" onSelect={value => handlers[value]()}>
                <MenuItem icon="check_circle" value="select" caption="Select..." />
                <MenuItem icon="settings" value="settings" caption="Settings" />
                <MenuItem icon="exit_to_app" value="logout" caption="Log out" />
            </IconMenu>
        );
    }
}

SecondaryMenu.propTypes = {
};

const handlers = {
    select: () => false,
    settings: () => History.push(Config.routes.settings),
    logout: () => {
        AuthActions.deauthenticate();
        History.push(Config.routes.login);
    }
};
