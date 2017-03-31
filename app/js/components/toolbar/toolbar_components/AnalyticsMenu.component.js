import React, { Component } from 'react';
import History from '../../../history';
import { List, ListItem, ListSubHeader, Dropdown } from 'react-toolbox';
import Config from '../../../config';
import Styles from './styles.analyticsMenu';
import UserStore from '../../../stores/User.store';

let accountingMenuItem = {
    value: 0,
    name: "Accounting",
    icon: "attach_money",
    path: Config.routes.accounting,
    pathRegex: /analytics\/accounting/
};

let dashboardMenuItem = {
    value: 1,
    name: "Dashboard",
    icon: "trending_up",
    path: Config.routes.dashboard,
    pathRegex: /analytics\/dashboard/
};

let globalAnalyticsMenuItem = {
    value: 2,
    name: "Global Stats",
    icon: "public",
    path: Config.routes.global,
    pathRegex: /analytics\/global/
};

let menuItems = [];

export default class AnalyticsMenu extends Component {
    constructor(props) {
        super(props);

        const user = UserStore.getState().user;

        menuItems = [];

        // Only show the Accounting menu item if this user has permission to see monetization details
        if (_(user.permissions).includes('view_monetization')) {

            // If the user has permission to see monetization, we want Accounting to be the first and default menu item
            accountingMenuItem.pathRegex = /analytics$|analytics\/accounting/;
            accountingMenuItem.default = true;

            menuItems.push(accountingMenuItem);
        } else {
            // If they don't have permission to see monetization, Dashboard will be first and default
            dashboardMenuItem.pathRegex = /analytics$|analytics\/dashboard/;
            dashboardMenuItem.default = true;
        }

        // Always add the Dashboard menu item
        menuItems.push(dashboardMenuItem);

        // Only show the Global Stats menu item if the user has permission to view global analytics
        if (_(user.permissions).includes('view_global_analytics')) {
            menuItems.push(globalAnalyticsMenuItem);
        }

        // Map the values of each menu item to their actual index in the menu item array
        menuItems = _.map(menuItems, (item, index) => {
           item.value = index;
           return item;
        });

        this.state = {
            selected: this.getCurrentActiveMenuItem().value
        };
    }

    customItem(item) {
    	return (
    		<span className={Styles.menuItem}><i className="material-icons">{item.icon}</i><span className={Styles.menuText}>{item.name}</span></span>
    	);
    }

    customItem2(item) {
    	return (
    		<ListItem
    			disabled={item.pathRegex.test(window.location.hash)}
    			caption={item.name}
    			leftIcon={item.icon}
    			to={item.path}
    		/>
    		)
    }

    getCurrentActiveMenuItem() {
        return _.find(menuItems, (item) => {
            return item.pathRegex.test(window.location.hash);
        });
    }

    handleChange(value) {
        this.setState({
            selected: value
        });

        const newRoute = menuItems[value].path;

        History.push(newRoute);
    }

    render() {
        return (
            <Dropdown
                theme={Styles}
            	className={Styles.viewSwitcher}
                auto={true}
                source={menuItems}
                onChange={::this.handleChange}
                template={::this.customItem}
                value={this.state.selected}
            />
        );
    }
}
