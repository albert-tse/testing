import React, { Component } from 'react';
import History from '../../history';
import Config from '../../config';
import { Avatar, AppBar as ReactAppBar, Navigation, Link } from 'react-toolbox';
import InfluencerSwitcher from './InfluencerSwitcher.component';
import Styles from './styles';
import {appBar} from './styles.appBar';

import AuthActions from '../../actions/Auth.action';

export default class AppBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactAppBar className={appBar}>
                <h1 className={Styles.brand} onClick={History.push.bind(this, Config.routes.explore)}>Contempo</h1>
                <Navigation type="horizontal">
                    <Link label="EXPLORE" active={!/saved|analytics|links/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.explore)} />
                    <Link label="MY POSTS" active={/saved/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.saved)} />
                    <Link label="ANALYTICS" active={/analytics/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.analytics)} />
                    <Link label="LINKS" active={/links/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.links)} />
                    <InfluencerSwitcher />
                </Navigation>
            </ReactAppBar>
        );
    }
}
