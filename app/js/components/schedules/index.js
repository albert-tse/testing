import React from 'react';
import AltContainer from 'alt-container';

import Actions from '../../actions/Profile.action';
import Component from './ScheduleView.component';
import Store from '../../stores/ProfileSelector.store';

/**
 * This view allows influencers/admins manage the pre-defined time slots
 * for each profile.
 * @return {React.Component}
 */
class Schedules extends React.Component {

    /**
     * Ideally this will only have the container component that determines
     * which stores to listen to and
     * which actions it can dispatch
     * @return {JSX}
     */
    render() {
        return (
            <AltContainer
                actions={Actions}
                component={Component}
                store={Store}
            />
        );
    }
}

export default Schedules;
