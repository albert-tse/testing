import React, { Component, PropTypes } from 'react';
import { ListItem } from 'react-toolbox';
import { debounce, omit } from 'lodash';

import NoAvatar from '../NoAvatar.component';
import Styles from './styles';

/**
 * Keeps track of whether a platform is selected or not
 */
export default class Profile extends Component {

    /**
     * Create a profile option
     * @param {Object} props refer to propTypes at the bottom for reference
     * @return {Profile}
     */
    constructor(props) {
        super(props);
        this.componentDidMount = this.cacheCallbackMethods;
        this.componentDidUpdate = this.cacheCallbackMethods;
        this.toggleSelected = debounce(this.toggleSelected.bind(this), 50);
    }

    /**
     * Show a list item for the profile option
     * @return {JSX}
     */
    render() {
        return (
            <ListItem
                theme={Styles}
                className={!this.props.selected ? Styles.dimmed : ''}
                avatar={this.props.profile_picture}
                caption={this.props.profile_name}
                legend={this.props.platformName}
                onClick={this.toggleSelected}
            />
        );
    }

    /**
     * Cache callback methods
     * onMount and onUpdate
     */
    cacheCallbackMethods() {
        this.onChange = this.props.onChange;
    }

    /**
     * Update with new selection state then notify parent element via callback
     * @param {Event} evt from click event
     */
    toggleSelected(evt) {
        const { id, selected, selectProfile, deselectProfile } = this.props;
        return selected ? deselectProfile(id) : selectProfile(id);
    }
}

Profile.defaultProps = {
    selected: false,
    platform: 'Unknown'
};
