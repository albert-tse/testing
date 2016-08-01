import React, { Component } from 'react';
import { NavDrawer, Freshdesk } from '../shared';
import { Layout, Panel } from 'react-toolbox';
import Loading from './Loading.component';
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
        this.state = {
            isLoading: false
        };
    }

    componentDidMount() {
        UserAction.lazyReloadUserInfo();
        setInterval(UserAction.lazyReloadUserInfo, userRefreshInterval);

        // Only to test the loading ICON
        setTimeout(() => {
            this.setState({ isLoading: true });
            setTimeout(() => {
                this.setState({ isLoading: false });
            }, 10000);
        }, 5000);
    }

    render() {
        return (
            <div>
                <AppBar path={ this.props.location.pathname.replace(/^\//, '') } />
                <Panel>
                    {this.props.children}
                    <Notifications />
                    <Analytics />
                    <Loading show={this.state.isLoading} />
                </Panel>
                <Freshdesk />
            </div>
        );
    }

}
