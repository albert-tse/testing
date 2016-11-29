import React, { Component, PropTypes } from 'react';
import { AppBar, Navigation, Link } from 'react-toolbox';

import Config from '../../../config';
import History from '../../../history';
import InfluencerSwitcher from './InfluencerSwitcher.component';
import SecondaryMenu, { options } from './SecondaryMenu.component';
import Styles from '../styles';
import {appBar, rightItems} from './styles';

const Default = props => {
    const withoutSelectMenuItem = options.slice((/^home$/.test(props.path) ? 1 : 0), options.length);

    return (
        <AppBar className={appBar}>
            <h1 className={Styles.brand} onClick={History.push.bind(null, Config.routes.home)}>{Config.appName}</h1>
            <div className={rightItems}>
                <Navigation type="horizontal" className={Styles.mainNav}>
                    {Config.navItems.slice(0, Config.navItems.length-1).map(navItem => (
                        <Link
                            key={navItem.label}
                            label={navItem.label}
                            active={new RegExp(navItem.pathRegex).test(props.path)}
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

Default.proptypes = {
    path: PropTypes.string.isRequired // determines which page is currently loaded so we know which nav item to set as active
};

export default Default;
