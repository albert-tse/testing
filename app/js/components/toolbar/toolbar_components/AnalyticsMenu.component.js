import React, { Component } from 'react';
import History from '../../../history';
import { List, ListItem, ListSubHeader, Dropdown } from 'react-toolbox';
import Config from '../../../config';
import Styles from './styles.analyticsMenu';

const menuItems = [
	{	
		value: 0,
		name: "Dashboard",
		icon: "trending_up",
		path: Config.routes.dashboard,
		pathRegex: /analytics$|analytics\/dashboard/
	},
	{	
		value: 1,
		name: "Accounting",
		icon: "attach_money",
		path: Config.routes.accounting,
		pathRegex: /analytics\/accounting/
	}
]

export default class AnalyticsMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: this.getCurrentActiveMenuItem().value
        };
    }

    customItem(item) {
    	return (
    		<span className={Styles.menuItem}><i className="material-icons">{item.icon}</i>{item.name}</span>
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
