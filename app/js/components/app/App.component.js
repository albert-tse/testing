import React, { Component } from 'react';
import { NavDrawer, Freshdesk } from '../shared';
import { Layout, Panel } from 'react-toolbox';
import Notifications from './Notifications'
import UserStore from '../../stores/User.store'
import UserAction from '../../actions/User.action'
import Analytics from '../shared/Analytics.component';
import AppBar from './AppBar.component';
import Styles from '../common';

var userRefreshInterval = 3600000;

export default class App extends Component {

    constructor(props) {
        super(props);
        console.log(props);
    }

    componentDidMount() {
        UserAction.lazyReloadUserInfo();
        setInterval(UserAction.lazyReloadUserInfo, userRefreshInterval);
    }

    render() {
        return (
            <div className={Styles.padded}>
                <AppBar />
                <Panel>
                    {this.props.children}
                    <Notifications />
                    <Analytics />
                </Panel>
                <Freshdesk />
            </div>
        );
    }

}
