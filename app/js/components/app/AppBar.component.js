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
                    <Link label="Explore" icon="explore" active={/explore/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.explore)} />
                    <Link label="My Posts" icon="bookmark" active={/saved/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.saved)} />
                    <Link label="Analytics" icon="share" active={/shared/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.analytics)} />
                    <Link label="Links" icon="link" active={/links/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.links)} />
                    <InfluencerSwitcher />
                </Navigation>
            </ReactAppBar>
        );
    }
}
