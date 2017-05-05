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
        this.toggleSelected = debounce(this.toggleSelected.bind(this), 200);
        this.state = {
            ...omit(this.props, 'onChange')
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState(omit(nextProps, 'onChange'));
    }

    /**
     * Show a list item for the profile option
     * @return {JSX}
     */
    render() {
        return (
            <ListItem
                theme={Styles}
                className={!this.state.selected ? Styles.dimmed : ''}
                avatar={this.props.profile_picture}
                caption={this.props.profile_name}
                legend={this.props.platformName}
                onClick={this.toggleSelected}
                onChange={this.onChange}
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
        const { id, selected } = this.state;
        const { selectProfile, deselectProfile } = this.props;

        return selected ? deselectProfile(id) : selectProfile(id);
    }
}

Profile.defaultProps = {
    selected: false,
    platform: 'Unknown'
};
