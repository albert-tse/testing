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

/** hourly interval (milliseconds) */
var userRefreshInterval = 3600000;

/**
 * This is the Core Layout component that should be mostly responsible for
 * the backbone of the current view
 */
export default class App extends Component {

    /**
     * Instantiate the component with the props passed down by its parent
     * @param {Object} props that are passed down by the parent Component
     * @return {App} component
     */
    constructor(props) {
        super(props);
    }

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
                {!isMobilePhone() && <Freshdesk /> /* TODO: only hide not unmount on mobile */}
            </div>
        );
    }
}

App.propTypes = {

    /** Contains the current path name which is on the location bar */
    location: PropTypes.object.isRequired
};
