import React, { Component, PropTypes } from 'react';
import { pick, values } from 'lodash';

import Config from '../../../config';
import { isMobilePhone } from '../../../utils';
import Default from './Default.component';
import Search from './Search.component.js';

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
        const exploreRoutes = values(pick(Config.routes, 'all', 'recommended', 'trending', 'relevant', 'saved', 'curated', 'internalCurated', 'list'))
                            .join('|')
                            .replace(':listId', '');
        const isInExploreList = new RegExp(exploreRoutes).test(props.location.pathname);

        if (/explore/.test(props.location.pathname)) {
            return null;
        } else {
            props = { ...props, upButton: isInExploreList };
            return <Default {...props} />;
        }
    }
}

AppBar.propTypes = {
    location: PropTypes.object.isRequired // determines which page is currently loaded so we know which nav item to set as active
};
