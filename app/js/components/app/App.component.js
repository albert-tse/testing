import React from 'react';
import {
    Layout,
    Panel
} from 'react-toolbox';
import PropTypes from 'prop-types';

import Config from '../../config';
import { isMobilePhone } from '../../utils';
import Notifications from './Notifications'

import ProfileStore from '../../stores/Profile.store'
import UserStore from '../../stores/User.store'

import ProfileActions from '../../actions/Profile.action'
import UserActions from '../../actions/User.action'

import {
    NavDrawer,
    Freshdesk
} from '../shared';
import AppBar from './AppBar';
import FacebookPixel from '../shared/FacebookPixel.component';
import GoogleAnalytics from '../shared/GoogleAnalytics.component';
import Intercom from '../intercom';
import Loading from './Loading.component';
import NavBar from '../shared/NavBar';

import Styles from '../common';

/** hourly interval (milliseconds) */
var userRefreshInterval = 3600000;

/**
 * This is the Core Layout component that should be mostly responsible for
 * the backbone of the current view
 */
export default class App extends React.Component {

    /**
     * Perform any tasks that must be called once the component
     * is preset on the DOM
     */
    componentDidMount() {
        UserActions.lazyReloadUserInfo();
        setInterval(UserActions.lazyReloadUserInfo, userRefreshInterval);
        ProfileActions.loadProfiles()
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
