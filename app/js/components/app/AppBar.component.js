import React, { Component, PropTypes } from 'react';
import { AppBar as ReactAppBar, Navigation, Link } from 'react-toolbox';

import History from '../../history';
import Config from '../../config';

import InfluencerSwitcher from './InfluencerSwitcher.component';
import SecondaryMenu from './SecondaryMenu.component';
import Styles from './styles';
import {appBar, rightItems} from './styles.appBar';

/** Represents an App Bar */
export default class AppBar extends Component {

    /**
     * Initialize the component's props with the ones passed by the parent component
     * @param {object} props contains the current pathname
     * @return {Component} AppBar
     */
    constructor(props) {
        super(props);
    }

    /**
     * Display the app bar containing
     * @return {JSX} the component
     */
    render() {
        return (
            <ReactAppBar className={appBar}>
                <h1 className={Styles.brand} onClick={History.push.bind(this, Config.routes.home)}>{Config.appName}</h1>
                <div className={rightItems}>
                    <Navigation type="horizontal" className={Styles.mainNav}>
                        {Config.navItems.slice(0, Config.navItems.length-1).map(navItem => (
                            <Link
                                key={navItem.label}
                                label={navItem.label}
                                active={new RegExp(navItem.pathRegex).test(this.props.path)}
                                onClick={History.push.bind(this, Config.routes[navItem.route])}
                            />
                        ))}
                    </Navigation>
                    <InfluencerSwitcher />
                    <SecondaryMenu path={this.props.path} />
                </div>
            </ReactAppBar>
        );
    }
}

AppBar.propTypes = {
    path: PropTypes.string.isRequired // determines which page is currently loaded so we know which nav item to set as active
};
