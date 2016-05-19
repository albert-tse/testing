import React from 'react';
import { Drawer, AppBar, Main, Freshdesk } from '../shared';
import Notifications from './Notifications'
import Config from '../../config';
import { refreshMDL } from '../../utils';
import AppBarActions from '../../actions/AppBar.action';

import { Layout, Panel } from 'react-toolbox';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // TODO: remove soon after MDL is removed
        // refreshMDL();
    }

    // XXX Turns out material design lite is mainly for static sites
    // This kludge should be removed when we replace MDL components 
    // with something more react-ful
    componentDidUpdate() {
        this.pageChanged();
    }

    render() {
        var pageName = this.getPageName();

        return (
            <Layout className={pageName}>
                <Drawer />
                <Panel>
                    {this.props.main}
                </Panel>
                <Notifications />
                <Freshdesk />
            </Layout>
        );
    }

    pageChanged() {
        var pageName = this.getPageName();
        AppBarActions.pageChanged(pageName);
    }

    getPageName() {
        return _.invert(Config.routes)[this.props.location.pathname];
    }
}

export default App;
