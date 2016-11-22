import React, { Component } from 'react';
import { NavDrawer, Freshdesk } from '../shared';
import { Layout, Panel } from 'react-toolbox';
import Loading from './Loading.component';
import Notifications from './Notifications'
import UserStore from '../../stores/User.store'
import UserAction from '../../actions/User.action'
import Analytics from '../shared/Analytics.component';
import AppBar from './AppBar.component';
import NavBar from '../shared/NavBar';
import FacebookPixel from '../shared/FacebookPixel.component';
import Styles from '../common';
import { isMobilePhone } from '../../utils';

var userRefreshInterval = 3600000;

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentDidMount() {
        UserAction.lazyReloadUserInfo();
        setInterval(UserAction.lazyReloadUserInfo, userRefreshInterval);
    }

    render() {
        return (
            <div>
                <FacebookPixel />
                <AppBar path={ this.props.location.pathname.replace(/^\//, '') } />
                <Panel>
                    {this.props.children}
                    <Notifications />
                    <Analytics />
                    <Loading />
                </Panel>
                <NavBar location={this.props.location} />
                {!isMobilePhone() && <Freshdesk /> /* TODO: only hide not unmount on mobile */}
            </div>
        );
    }

}
