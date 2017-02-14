import React, { Component, PropTypes } from 'react';
import Container from 'alt-container';
import { IconMenu, MenuItem } from 'react-toolbox';
import { find, pick, zipObject } from 'lodash';

import History from '../../../history';
import Config from '../../../config';

import UserStore from '../../../stores/User.store';

import AuthActions from '../../../actions/Auth.action';
import FilterActions from '../../../actions/Filter.action';

import Styles from './styles';

export default class SecondaryMenu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container
                component={Contained}
                store={UserStore}
                transform={props => ({
                    ...this.props,
                    user: props.user,
                    ...pick(props, 'isSchedulingEnabled')
                })}
            />
        );
    }
}


/** Represents a menu to be shown on the App Bar */
class Contained extends Component {

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
        const { user, isSchedulingEnabled } = this.props;
        let options = this.props.options || handlers.map(h => h.key);
        options = options.map(key => find(handlers, { key: key })).sort(option => option.order).reverse();

        const Avatar = () => <span className={Styles.avatar}>{user.name[0].toUpperCase()}</span>;

        if (!isSchedulingEnabled) {
            options = options.filter(o => o.key !== 'connectAccounts');
        }

        return (
            <IconMenu className={Styles.secondaryMenu} icon={<Avatar />} onSelect={value => find(handlers, { key: value }).onSelect()}>
                <header className={Styles.header}>
                    <Avatar />
                    <section className={Styles.userInfo}>
                        <p className={Styles.userName}>{user.name}</p>
                        <p className={Styles.userEmail}>{user.email}</p>
                    </section>
                </header>
            {options.map(option => (
                <MenuItem key={option.key} icon={option.icon} value={option.key} caption={option.caption} />
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
const handlers = [
    {
        key: 'select',
        order: 0,
        caption: 'Select...',
        // icon: 'check_circle',
        onSelect: () => FilterActions.toggleSelectionMode()
    },
    {
        key: 'connectAccounts',
        order: 1,
        caption: 'Manage Profiles',
        // icon: 'settings',
        onSelect: () => History.push(Config.routes.manageAccounts)
    },
    {
        key: 'settings',
        order: 2,
        caption: 'Settings',
        // icon: 'settings',
        onSelect: () => History.push(Config.routes.settings)
    },
    {
        key: 'support',
        order: 3,
        caption: 'Help',
        onSelect: () => window.open(Config.externalLinks.support, '_blank')
    },
    {
        key: 'logout',
        order: 4,
        caption: 'Sign out',
        // icon: 'exit_to_app',
        onSelect: () => {
            AuthActions.deauthenticate();
            History.push(Config.routes.login);
        }
    }
];

/** This lists out all the keys of all available menu options */
export const options = handlers.map(option => option.key);
