import React, { Component } from 'react';
import AltContainer from 'alt-container';

import ProfileStore from '../../stores/Profile.store';
import ProfileActions from '../../actions/Profile.action';
import ProfileSelectorActions from '../../actions/ProfileSelector.action';

import CalendarViewComponent from './CalendarView.component';

/**
 * Container component for the CalendarView view
 * If you need to connect this component to stores/actions, insert them here
 * @return {React.Component}
 */
export default class CalendarView extends Component {

    /**
     * Instantiates the component with props passed from Router
     * @param {object} props
     * @return {CalendarView}
     */
    constructor(props) {
        super(props);
    }

    /**
     * If profiles have not yet loaded, load them
     */
    componentDidMount() {
        const { profiles } = ProfileStore.getState();

        if (!Array.isArray(profiles) || profiles.length < 1) {
            ProfileActions.loadProfiles();
        }

        ProfileSelectorActions.selectValidProfile();
    }

    /**
     * Component Container is defined here
     */
    render() {
        return (
            <AltContainer
                component={CalendarViewComponent}
                inject={this.props}
            />
        );
    }
}
