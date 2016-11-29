import React, { Component, PropTypes } from 'react';
import { IconMenu, MenuItem } from 'react-toolbox';

import AuthActions from '../../../actions/Auth.action';
import FilterActions from '../../../actions/Filter.action';
import History from '../../../history';
import Config from '../../../config';

import Styles from './styles';

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
        const options = this.props.options || Object.keys(handlers);

        return (
            <IconMenu className={Styles.secondaryMenu} icon="more_vert" onSelect={value => handlers[value].onSelect()}>
                {options.map(item => (
                    <MenuItem key={item} icon={handlers[item].icon} value={item} caption={handlers[item].caption} />
                ))}
            </IconMenu>
        );
    }

}

SecondaryMenu.propTypes = {
    /** To omit any of the default options, specify the keys you want to show as an array */
    options: PropTypes.array
};

/** Available menu item options */
const handlers = {
    select: {
        caption: 'Select...',
        icon: 'check_circle',
        onSelect: () => FilterActions.toggleSelectionMode()
    },
    settings: {
        caption: 'Settings',
        icon: 'settings',
        onSelect: () => History.push(Config.routes.settings)
    },
    logout: {
        caption: 'Log out',
        icon: 'exit_to_app',
        onSelect: () => {
            AuthActions.deauthenticate();
            History.push(Config.routes.login);
        }
    }
};

/** This lists out all the keys of all available menu options */
export const options = Object.keys(handlers);
