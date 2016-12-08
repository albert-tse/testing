import React, { Component, PropTypes } from 'react';
import { Navigation } from 'react-toolbox';
import classnames from 'classnames';
import { pick } from 'lodash';

import History from '../../../history';
import Config from '../../../config';

import Styles from './styles';

/** Represents the nav bar that only shows on mobile phones */
export default class NavBar extends Component {

    /**
     * Instantiate with the props passed down from the parent
     * @param {object} props contains current location's pathname
     * @return {Component} the nav bar instance
     */
    constructor(props) {
        super(props);
    }

    /**
     * Show the nav bar
     * @return {JSX} the component
     */
    render() {
        return (
            <Navigation
                actions={this.getActions()}
                className={classnames(Styles.fixed, Styles.bottomNav)}
                type="horizontal"
            />
        );
    }

    /**
     * Get the nav items from the config file
     * @return {array} of objects representing a menu item
     */
    getActions() {
        const { navItems, routes } = Config;
        return navItems.map(item => ({
            ...pick(item, 'label', 'icon'),
            className: new RegExp(item.pathRegex).test(this.props.location.pathname) ? Styles.isActive : '',
            onClick: History.push.bind(this, routes[item.route])
        }));
    }

}

NavBar.propTypes = {
    location: PropTypes.object.isRequired // contains pathname so we can use it to match it to correct nav item that needs to be marked active
};
