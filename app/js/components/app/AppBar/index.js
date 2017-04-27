import React, { Component, PropTypes } from 'react';
import { pick, values } from 'lodash';

import Config from '../../../config';
import Default from './Default.component';
import { isMobilePhone } from '../../../utils';
import History from '../../../history';
import Search from './Search.component.js';

import Styles from '../styles';

/** Represents an App Bar */
export default class AppBar extends Component {

    /**
     * Initialize the component's props with the ones passed by the parent component
     * @param {object} props contains the current pathname
     * @return {Component} AppBar
     */
    constructor(props) {
        super(props);
    }

    /**
     * Display the app bar containing
     * @return {JSX} the component
     */
    render() {
        return !isMobilePhone() ? <Default {...this.props} /> : <this.Mobile {...this.props} />;
    }

    /**
     * This will only be called if the screen is a mobile phone
     * @param {Object} props should contain the path property
     * @return {JSX} element
     */
    Mobile(props) {
        const exploreRoutes = [
            ...values(pick(Config.routes, 'all', 'explore', 'recommended', 'trending', 'relevant', 'saved', 'curated', 'internalCurated', 'list', 'search', 'topPerforming')),
            '/' ].join('|').replace(':listId', '');
        const isInExploreList = new RegExp(exploreRoutes).test(props.location.pathname);
        const isInAnalytics = /analytics/.test(props.location.pathname);
        return isInExploreList || isInAnalytics ? null : <Default {...props} />
    }
}

AppBar.propTypes = {
    location: PropTypes.object.isRequired // determines which page is currently loaded so we know which nav item to set as active
};

export const Brand = props => (
    <h1 className={Styles.brand} onClick={History.push.bind(null, Config.routes.explore)}>{Config.appName}</h1>
);

export ExplorerBar from './Explorer.component';
export SearchBar from './Search.component';
export AnalyticsBar from './Analytics.component';
