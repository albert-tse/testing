import React from 'react';
import { Container, Drawer, AppBar, Main, Freshdesk } from '../shared';
import Notifications from './Notifications'
import Config from '../../config';
import { refreshMDL } from '../../utils';
import AppBarActions from '../../actions/AppBar.action';

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
            <Container className={pageName}>
                {this.props.appBar}
                <Drawer />
                <Main>
                    {this.props.main}
                </Main>
                <Notifications />
                <Freshdesk />
            </Container>
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
