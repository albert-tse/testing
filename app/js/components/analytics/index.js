import React from 'react';
import { List, ListItem, ListSubHeader, Tabs, Tab } from 'react-toolbox';

import { isMobilePhone } from '../../utils';
import Config from '../../config';

import Accounting from './Accounting.component';
import Dashboard from './Dashboard.component';
import GlobalStats from './GlobalStats.component';
import styles, { analytics, content, subheader, tabs } from './styles';

export default class Analytics extends React.Component {

    constructor(props) {
        super(props);
        this.isMobile = isMobilePhone();
        this.checkIfMobile = this.checkIfMobile.bind(this);
        this.Navigation = this.Navigation.bind(this);
        this.switchTabs = this.switchTabs.bind(this);
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

        return (
            <div className={content}>
                {this.state.isMobile && isIndexRoute && <this.Navigation />}
                <section className={analytics}>
                    {this.props.children}
                </section>
            </div>
        );
    }

    checkIfMobile() {
        this.setState({ isMobile: isMobilePhone() });
    }

    Navigation() {
        return (
            <Tabs index={this.state.index} fixed onChange={this.switchTabs} theme={styles}>
                <Tab label="Accounting"><Accounting /></Tab>
                <Tab label="Dashboard"><Dashboard /></Tab>
                <Tab label="Global"><GlobalStats /></Tab>
            </Tabs>
        );
    }

    switchTabs(index) {
        this.setState({ index: index });
    }

}

export Accounting from './Accounting.component';
export Dashboard from './Dashboard.component';
export GlobalStats from './GlobalStats.component';
