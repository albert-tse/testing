import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavDrawer, Freshdesk } from '../shared';
import { Layout, Panel } from 'react-toolbox';
import Loading from './Loading.component';
import Notifications from './Notifications'
import UserStore from '../../stores/User.store'
import UserAction from '../../actions/User.action'
import GoogleAnalytics from '../shared/GoogleAnalytics.component';
import AppBar from './AppBar';
import NavBar from '../shared/NavBar';
import FacebookPixel from '../shared/FacebookPixel.component';
import Styles from '../common';
import { isMobilePhone } from '../../utils';

import UserActions from '../../actions/User.action'
import Intercom from '../intercom';

import Config from '../../config';

/** hourly interval (milliseconds) */
var userRefreshInterval = 3600000;

/**
 * This is the Core Layout component that should be mostly responsible for
 * the backbone of the current view
 */
export default class App extends Component {

    /**
     * Perform any tasks that must be called once the component
     * is preset on the DOM
     */
    componentDidMount() {
        UserAction.lazyReloadUserInfo();
        setInterval(UserAction.lazyReloadUserInfo, userRefreshInterval);
    }

    /**
     * Determines how to display the component
     * @return {JSX} the component
     */
    render() {
        let CustomerSupportComponent = () => <span />

        if (!isMobilePhone()) {
            CustomerSupportComponent = Config.intercom.show ? Intercom : Freshdesk
        }

        return (
            <div>
                <FacebookPixel />
                <AppBar location={this.props.location} />
                <Panel>
                    {this.props.children}
                    <Notifications />
                    <GoogleAnalytics />
                    <Loading />
                </Panel>
                <NavBar location={this.props.location} />
                <CustomerSupportComponent />
            </div>
        );
    }
}

App.propTypes = {

    /** Contains the current path name which is on the location bar */
    location: PropTypes.object.isRequired
};
