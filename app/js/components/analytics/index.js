import React from 'react';
import { List, ListItem, ListSubHeader, Tabs, Tab } from 'react-toolbox';

import { isMobilePhone } from '../../utils';
import Config from '../../config';

import Accounting from './Accounting.component';
import { AnalyticsBar } from '../app/AppBar';
import Dashboard from './Dashboard.component';
import { DownloadCSV } from '../toolbar/toolbar_components';
import ExplorerBar from '../app/AppBar/Explorer.component';
import GlobalStats from './GlobalStats.component';
import { ToolbarSpecs } from '../toolbar';
import styles, { analytics, content, subheader, tabs } from './styles';

export default class Analytics extends React.Component {

    accountingFilters = ToolbarSpecs['Accounting'].left

    tabs = [
        {
            label: 'Accounting',
            component: <Accounting />,
            filters: this.accountingFilters,
            actions: <DownloadCSV />
        },
        {
            label: 'Dashboard',
            component: <Dashboard />,
            filters: ToolbarSpecs['Analytics'].left
        },
        {
            label: 'Global',
            component: <GlobalStats />,
            filters: this.accountingFilters,
            actions: <DownloadCSV />
        }
    ]

    constructor(props) {
        super(props);
        this.isMobile = isMobilePhone();
        this.checkIfMobile = this.checkIfMobile.bind(this);
        this.Navigation = this.Navigation.bind(this);
        this.switchTabs = this.switchTabs.bind(this);
        this.Web = this.Web.bind(this);
        this.Mobile = this.Mobile.bind(this);
        this.state = {
            index: 0,
            isMobile: isMobilePhone()
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.checkIfMobile);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.checkIfMobile);
    }

    render() {
        const isIndexRoute = /analytics\/?$/.test(this.props.location.pathname);
        return this.state.isMobile && isIndexRoute ? <this.Mobile /> : <this.Web /> ;
    }

    Web() {
        return (
            <div className={content}>
                <section className={analytics}>
                    {this.props.children}
                </section>
            </div>
        );
    }

    Mobile() {
        const currentTab = this.tabs[this.state.index];
        return (
            <div className={content}>
                <AnalyticsBar 
                    filters={currentTab.filters}
                    actions={currentTab.actions}
                />
                <this.Navigation />
            </div>
        );
    }

    checkIfMobile() {
        this.setState({ isMobile: isMobilePhone() });
    }

    Navigation() {
        return (
            <div>
                <Tabs index={this.state.index} fixed onChange={this.switchTabs} theme={styles}>
                    {this.tabs.map(tab => <Tab label={tab.label}>{tab.component}</Tab>)}
                </Tabs>
            </div>
        );
    }

    switchTabs(index) {
        this.setState({ index: index });
    }

}

export Accounting from './Accounting.component';
export Dashboard from './Dashboard.component';
export GlobalStats from './GlobalStats.component';
