import React, { Component, PropTypes } from 'react';
import Container from 'alt-container';
import { AppBar, IconButton, Navigation, Link } from 'react-toolbox';

import Config from '../../../config';
import History from '../../../history';

import ListStore from '../../../stores/List.store';

import InfluencerSwitcher from './InfluencerSwitcher.component';
import SecondaryMenu, { options } from './SecondaryMenu.component';
import Styles from '../styles';
import {appBar, label, rightItems, title, upButton} from './styles';

const Default = props => { 
    const withoutSelectMenuItem = options.slice((/^home$/.test(props.path) ? 1 : 0), options.length);
    const path = props.location.pathname;

    return (
        <AppBar flat className={appBar}>
            <Brand {...props} />
            <div className={rightItems}>
                <Navigation type="horizontal" className={Styles.mainNav}>
                    {Config.navItems.slice(0, Config.navItems.length-1).map(navItem => (
                        <Link
                            key={navItem.label}
                            label={navItem.label}
                            active={new RegExp(navItem.pathRegex).test(path)}
                            onClick={History.push.bind(null, Config.routes[navItem.route])}
                        />
                    ))}
                </Navigation>
                <InfluencerSwitcher />
                <SecondaryMenu options={withoutSelectMenuItem} />
            </div>
        </AppBar>
    );
};

const Brand = props => (
    <h1 className={Styles.brand} onClick={History.push.bind(null, Config.routes.home)}>{Config.appName}</h1>
);

Default.proptypes = {
    location: PropTypes.object.isRequired // determines which page is currently loaded so we know which nav item to set as active
};

export default Default;
