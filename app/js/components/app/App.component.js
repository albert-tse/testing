import React from 'react';
import { NavDrawer, Freshdesk } from '../shared';
import { Layout, Panel } from 'react-toolbox';
import Notifications from './Notifications'
import UserStore from '../../stores/User.store'
import UserAction from '../../actions/User.action'

var userRefreshInterval = 3600000;

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        UserAction.lazyReloadUserInfo();
        setInterval(UserAction.lazyReloadUserInfo, userRefreshInterval);
    }

    render() {
        return (
            <Layout>
                <NavDrawer />
                <Panel>
                    {this.props.children}
                    <Notifications />
                </Panel>
            </Layout>
        );
    }

}
