import React, { Component } from 'react';
import History from '../../history';
import Config from '../../config';
import { Avatar, AppBar as ReactAppBar, Navigation, Link, Dropdown } from 'react-toolbox';
import InfluencerSwitcher from './InfluencerSwitcher.component';
import Styles from './styles';
import {appBar} from './styles.appBar';

import AuthActions from '../../actions/Auth.action';

const navItems = [
    {   
        value: 0,
        label: "EXPLORE",
        pathRegex: /^(?![\s\S])|explore/,
        route: Config.routes.explore
    },
    {   
        value: 1,
        label: "MY POSTS",
        pathRegex: /saved/,
        route: Config.routes.saved
    },
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

        this.state = {
            selected: this.getCurrentActiveNavItem().value
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
                <h1 className={Styles.brand} onClick={History.push.bind(this, Config.routes.explore)}>Contempo</h1>
                <div className={Styles.navMenuDesktop}>
                    <Navigation type="horizontal">
                        <Link label="EXPLORE" active={!/saved|analytics|links/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.explore)} />
                        <Link label="MY POSTS" active={/saved/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.saved)} />
                        <Link label="ANALYTICS" active={/analytics/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.analytics)} />
                        <Link label="LINKS" active={/links/.test(this.props.path)} onClick={History.push.bind(this, Config.routes.links)} />
                        <InfluencerSwitcher />
                    </Navigation>
                </div>
                <div className={Styles.navMenuMobile}>
                    <div className={Styles.dropdownWrapper}>
                        <Dropdown
                            auto={true}
                            source={navItems}
                            onChange={::this.handleChange}
                            template={::this.customItem}
                            value={this.state.selected}
                        />
                    </div>
                    <InfluencerSwitcher />
                </div>
            </ReactAppBar>
        );
    }
}
