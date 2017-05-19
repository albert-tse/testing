import React, { Component } from 'react';
import AltContainer from 'alt-container';
import { delay } from 'lodash';

import Store from '../../stores/ProfileSelector.store';
import Actions from '../../actions/ProfileSelector.action';
import ProfileActions from '../../actions/Profile.action';
import Selector from './Selector.component';
import Dropdown from './Dropdown.component';

/**
 * Profile Selector
 * This is the main component for selecting a single profile associated to the user
 * This is mounted in a Dropdown component on Explore page, Share Dialog and the Calendar view's sidebar
 * It is a container component so it should update on its own
 * @return {MultiInfluencerSelector}
 */
export default class MultiInfluencerSelector extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * Fetch profiles from server
     */
    componentDidMount() {
        delay(ProfileActions.loadProfiles, 1000);
    }

    /**
     * Renders a container component that wraps around the
     * Selector pure component
     * @return {React.component}
     */
    render() {
        return (
            <AltContainer
                component={this.props.type === "dropdown" ? Dropdown : Selector}
                store={Store}
                actions={Actions}
                transform={props => ({
                    ...props,
                    ...this.props,
                })}
            />
        );
    }
}
