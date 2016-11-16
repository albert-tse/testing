import React, { Component } from 'react';
import History from '../../history';
import Config from '../../config';
import { Avatar, AppBar as ReactAppBar, Navigation, Link, Dropdown } from 'react-toolbox';
import InfluencerSwitcher from './InfluencerSwitcher.component';
import Styles from './styles';
import { responsive, hideOnPhonePortrait, hideOnPhoneLandscape } from '../common';
import {appBar} from './styles.appBar';

import AuthActions from '../../actions/Auth.action';

import classnames from 'classnames';

const navItems = [
    {   
        value: 0,
        label: "HOME",
        pathRegex: /^(?![\s\S])|home/,
        route: Config.routes.home
    },
    {   
        value: 1,
        label: "EXPLORE",
        pathRegex: /explore/,
        route: Config.routes.explore
    },
    /*
    {   
        value: 2,
        label: "MY POSTS",
        pathRegex: /saved/,
        route: Config.routes.saved
    },
    */
    {   
        value: 2,
        label: "ANALYTICS",
        pathRegex: /analytics/,
        route: Config.routes.analytics
    },
    {   
        value: 3,
        label: "LINKS",
        pathRegex: /links/,
        route: Config.routes.links
    }

];

export default class AppBar extends Component {

    constructor(props) {
        super(props);

        let currentNavItem = this.getCurrentActiveNavItem();

        this.state = {
            selected: currentNavItem ? currentNavItem.value : 0
          };
    }

    getCurrentActiveNavItem() {
        return _.find(navItems, (item) => {
            return item.pathRegex.test(this.props.path);
        });
    }

    customItem(item) {
        return (
              <span>{item.label}</span>
            );
    }

    handleChange(value) {
        this.setState({
            selected: value
        });

        History.push(navItems[value].route);
    }

    render() {
        return (
            <ReactAppBar className={appBar}>
                <h1 className={Styles.brand} onClick={History.push.bind(this, Config.routes.home)}>Contempo</h1>
                <Navigation type="horizontal" className={Styles.mainNav}>
                    <Link label="HOME" active={/home|^$/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.home)} />
                    <Link label="EXPLORE" active={/explore/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.explore)} />
                    <Link label="ANALYTICS" className={classnames(responsive, hideOnPhonePortrait, hideOnPhoneLandscape)} active={/analytics/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.analytics)} />
                    <Link label="LINKS" className={classnames(responsive, hideOnPhonePortrait)} active={/links/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.links)} />
                    <InfluencerSwitcher />
                </Navigation>
            </ReactAppBar>
        );
    }
}
