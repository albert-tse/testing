import React, { Component } from 'react';
import History from '../../history';
import Config from '../../config';
import { AppBar as ReactAppBar, Navigation, Link, IconMenu, MenuItem, MenuDivider } from 'react-toolbox';
import Styles from './styles';

export default class AppBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactAppBar fixed>
                <h1 className={Styles.brand}>Contempo</h1>
                <Navigation type="horizontal">
                    <Link  label="Explore" icon="explore" onClick={History.push.bind(this, Config.routes.explore)} />
                    <Link label="Saved" icon="bookmark" onClick={History.push.bind(this, Config.routes.saved)} />
                    <Link label="Shared" icon="share" onClick={History.push.bind(this, Config.routes.shared)} />
                    <Link label="Links" icon="link" onClick={History.push.bind(this, Config.routes.links)} />
                    <IconMenu secondary icon="account_circle" position="auto">
                        <MenuItem value="settings" icon="settings" caption="Settings" />
                        <MenuItem value="logout" icon="exit_to_app" caption="Log out" />
                    </IconMenu>
                </Navigation>
            </ReactAppBar>
        );
    }
}
