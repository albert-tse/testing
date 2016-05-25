import React from 'react';
import { NavDrawer, Freshdesk } from '../shared';
import { Layout, Panel } from 'react-toolbox';
import Notifications from './Notifications'

export default class App extends React.Component {

    constructor(props) {
        super(props);
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
