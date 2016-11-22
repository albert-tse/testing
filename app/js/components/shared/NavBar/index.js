import React, { Component, PropTypes } from 'react';
import { Navigation } from 'react-toolbox';
import classnames from 'classnames';

import History from '../../../history';
import Config from '../../../config';

import Styles from './styles';

export default class NavBar extends Component {

    constructor(props) {
        super(props);
        this.markActive = this.markActive.bind(this);
    }

    render() {
        if (!this.isMobile()) {
            return null;
        }

        return <Navigation className={classnames(Styles.fixed, Styles.bottomNav)} type="horizontal" actions={this.getActions()} />;
    }

    isMobile() {
        return true;
    }

    getActions() {
        const { routes } = Config;

        return [
            {
                icon: 'home',
                label: 'Home',
                onClick: History.push.bind(this, routes.home),
            },
            {
                icon: 'explore',
                label: 'Explore',
                onClick: History.push.bind(this, routes.explore),
            },
            {
                icon: 'trending_up',
                label: 'Analytics',
                onClick: History.push.bind(this, routes.analytics),
            },
            {
                icon: 'link',
                label: 'Links',
                onClick: History.push.bind(this, routes.links),
            },
            {
                icon: 'help',
                label: 'Support',
            }
        ].map(this.markActive);
    }

    markActive(action) {
        const matchesPath = new RegExp(action.label.toLowerCase()).test(this.props.location.pathname);
        if (matchesPath) {
            action = { ...action, className: Styles.isActive };
        }
        return action;
    }

}
